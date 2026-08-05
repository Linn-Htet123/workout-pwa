"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useLang, LangToggle } from "./LangProvider";

interface Photo {
  id: string;
  media_type: string;
  data: string; // base64 (no data: prefix)
  previewUrl: string; // small jpeg data URL for the thumbnail
}

interface MealItem {
  name: string;
  calories: number;
}
interface MealResult {
  dish: string;
  totalCalories: number;
  lowRange: number;
  highRange: number;
  items: MealItem[];
  confidence: "low" | "medium" | "high";
  notes: string;
}

const MAX_PHOTOS = 3;
const MAX_EDGE = 1024; // downscale so uploads stay small and cheap

// Read a camera/gallery File, shrink it, and return base64 JPEG + a preview.
function processFile(file: File): Promise<Photo> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("no-canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      URL.revokeObjectURL(url);
      resolve({
        id: `${Date.now()}-${Math.round(w * h)}-${file.size}`,
        media_type: "image/jpeg",
        data: dataUrl.split(",")[1] ?? "",
        previewUrl: dataUrl,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad-image"));
    };
    img.src = url;
  });
}

export default function MealClient() {
  const { t, lang } = useLang();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [remark, setRemark] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<MealResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const cameraRef = useRef<HTMLInputElement>(null); // opens the camera
  const galleryRef = useRef<HTMLInputElement>(null); // picks from gallery/files

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow picking the same file again
    for (const file of files) {
      if (photos.length >= MAX_PHOTOS) break;
      try {
        const p = await processFile(file);
        setPhotos((prev) => (prev.length >= MAX_PHOTOS ? prev : [...prev, p]));
      } catch {
        /* skip a file that won't decode */
      }
    }
  }

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  async function estimate() {
    if (photos.length === 0) {
      setErrorMsg(t.needPhotos);
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/estimate-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: photos.map((p) => ({ media_type: p.media_type, data: p.data })),
          remark,
          lang,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body?.error === "no_key" ? t.errNoKey : t.errGeneric);
        setStatus("error");
        return;
      }
      const body = await res.json();
      setResult(body.result as MealResult);
      setStatus("done");
    } catch {
      setErrorMsg(t.errGeneric);
      setStatus("error");
    }
  }

  function reset() {
    setPhotos([]);
    setRemark("");
    setResult(null);
    setErrorMsg("");
    setStatus("idle");
  }

  const confLabel =
    result?.confidence === "high"
      ? t.confHigh
      : result?.confidence === "medium"
        ? t.confMedium
        : t.confLow;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="safe-top safe-x mx-auto max-w-md pb-16 md:max-w-2xl">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label={t.backHome}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray2 active:bg-white/10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <h1 className="text-[22px] font-bold leading-tight">{t.mealTitle}</h1>
          </div>
          <LangToggle />
        </header>

        {status === "done" && result ? (
          <ResultView result={result} confLabel={confLabel} t={t} onReset={reset} />
        ) : (
          <>
            <p className="mt-3 text-[15px] text-gray1">{t.mealSub}</p>

            {/* Photo grid (thumbnails only) */}
            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {photos.map((p) => (
                  <div key={p.id} className="relative aspect-square overflow-hidden rounded-2xl border border-gray2 bg-gray3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.previewUrl} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(p.id)}
                      aria-label={t.remove}
                      className="absolute right-1.5 top-1.5 flex h-7 w-7 touch-manipulation items-center justify-center rounded-full bg-black/70 text-white active:scale-90"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Take a photo OR upload from gallery — up to 3 total, mix freely. */}
            {photos.length < MAX_PHOTOS && (
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => cameraRef.current?.click()}
                  className="flex h-14 flex-1 touch-manipulation items-center justify-center gap-2 rounded-2xl border border-gray2 bg-gray3 text-[15px] font-semibold text-white active:scale-[0.98] active:bg-white/10"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  {t.takePhoto}
                </button>
                <button
                  type="button"
                  onClick={() => galleryRef.current?.click()}
                  className="flex h-14 flex-1 touch-manipulation items-center justify-center gap-2 rounded-2xl border border-gray2 bg-gray3 text-[15px] font-semibold text-white active:scale-[0.98] active:bg-white/10"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 16l5-5 4 4 3-3 4 4M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <circle cx="9" cy="9" r="1.4" fill="currentColor" />
                  </svg>
                  {t.uploadPhoto}
                </button>
              </div>
            )}
            <p className="mt-2 text-[12px] text-gray1">
              {photos.length}/{MAX_PHOTOS} {t.photosUnit} · {t.photosHint}
            </p>

            {/* Camera capture (opens the camera on phones) */}
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onPick}
            />
            {/* Gallery / file upload (no capture = pick existing photos) */}
            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onPick}
            />

            {/* Optional note */}
            <div className="mt-5">
              <label className="mb-2 block text-[13px] font-semibold uppercase tracking-wide text-gray1">
                {t.noteLabel}
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder={t.notePlaceholder}
                rows={2}
                className="w-full resize-none rounded-2xl border border-gray2 bg-gray3 p-4 text-[15px] text-white placeholder:text-gray1 focus:border-white focus:outline-none"
              />
            </div>

            {status === "error" && (
              <p className="mt-4 rounded-2xl border border-gray2 bg-gray3 p-3 text-[14px] text-white">
                {errorMsg}
              </p>
            )}

            {/* Estimate button */}
            <button
              type="button"
              onClick={estimate}
              disabled={status === "loading" || photos.length === 0}
              className="mt-5 flex h-14 w-full touch-manipulation items-center justify-center gap-2 rounded-2xl bg-white text-[17px] font-semibold text-black transition-transform duration-150 active:scale-[0.98] disabled:opacity-40"
            >
              {status === "loading" ? (
                <>
                  <Spinner /> {t.estimating}
                </>
              ) : (
                t.estimateBtn
              )}
            </button>

            <p className="mt-3 text-center text-[12px] text-gray1">{t.aiDisclaimer}</p>
          </>
        )}
      </div>
    </main>
  );
}

function ResultView({
  result,
  confLabel,
  t,
  onReset,
}: {
  result: MealResult;
  confLabel: string;
  t: ReturnType<typeof useLang>["t"];
  onReset: () => void;
}) {
  return (
    <div className="mt-5">
      {/* Big number */}
      <section className="rounded-card border border-gray2 bg-gray3 p-6 text-center">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-gray1">
          {t.estCaloriesLabel}
        </p>
        <p className="mt-1 text-[15px] font-medium text-white">{result.dish}</p>
        <p className="mt-2 text-[56px] font-bold leading-none tabular-nums">
          {Math.round(result.totalCalories)}
        </p>
        <p className="mt-1 text-[14px] text-gray1">{t.kcal}</p>
        <div className="mt-4 flex items-center justify-center gap-3 text-[13px] text-gray1">
          <span>
            {t.aboutRange}: {Math.round(result.lowRange)}–{Math.round(result.highRange)} {t.kcal}
          </span>
          <span className="rounded-full border border-gray2 px-2.5 py-0.5 font-medium">
            {t.confidenceLabel}: {confLabel}
          </span>
        </div>
      </section>

      {/* Items */}
      {result.items?.length > 0 && (
        <section className="mt-4 rounded-card border border-gray2 bg-gray3 p-5">
          <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-gray1">
            {t.itemsLabel}
          </h2>
          <ul className="divide-y divide-gray2">
            {result.items.map((it, i) => (
              <li key={i} className="flex items-center justify-between gap-3 py-2.5">
                <span className="text-[15px]">{it.name}</span>
                <span className="shrink-0 text-[15px] font-medium tabular-nums text-gray1">
                  {Math.round(it.calories)} {t.kcal}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {result.notes && (
        <p className="mt-4 text-[14px] leading-relaxed text-gray1">{result.notes}</p>
      )}
      <p className="mt-2 text-[12px] text-gray1">{t.aiDisclaimer}</p>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 flex h-14 w-full touch-manipulation items-center justify-center rounded-2xl border border-gray2 bg-black text-[17px] font-semibold text-white active:bg-white/10"
      >
        {t.newPhoto}
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
