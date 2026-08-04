"use client";

import { useState } from "react";
import type { Exercise } from "@/data/program";
import { RIR_NOTE } from "@/data/program";
import { getExerciseInfo } from "@/data/exerciseInfo";
import { useLang } from "./LangProvider";

interface Props {
  exercise: Exercise;
  index: number;
  doneSets: number[];
  onToggleSet: (setIndex: number) => void;
  // Per-exercise stopwatch (managed by the parent so only one runs at a time).
  timerRunning: boolean;
  timerLabel: string;
  onStartTimer: () => void;
  onStopTimer: () => void;
}

// Pull the YouTube video id out of a youtu.be / watch link.
function videoId(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.split("/").filter(Boolean).pop() ?? "";
    }
    return u.searchParams.get("v") ?? u.pathname.split("/").filter(Boolean).pop() ?? "";
  } catch {
    return "";
  }
}

export default function ExerciseCard({
  exercise,
  index,
  doneSets,
  onToggleSet,
  timerRunning,
  timerLabel,
  onStartTimer,
  onStopTimer,
}: Props) {
  const { t, lang } = useLang();
  // Video is an accordion: closed by default, opens (and plays) only on tap.
  const [open, setOpen] = useState(false);
  const info = getExerciseInfo(exercise.name);
  const works = info ? (lang === "my" ? info.worksMy : info.works) : "";
  const howTo = info ? (lang === "my" ? info.howToMy : info.howTo) : "";
  const doneCount = doneSets.length;
  const allDone = doneCount >= exercise.sets;
  const id = videoId(exercise.video);
  const thumb = id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : "";
  const embedUrl = id
    ? `https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`
    : exercise.video;

  return (
    <div
      className={`rounded-card border p-5 transition-colors duration-200 ${
        allDone ? "border-white/60 bg-white/[0.05]" : "border-gray2 bg-gray3"
      }`}
    >
      {/* Title + set stopwatch */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-[17px] font-semibold leading-tight">
          <span className="text-gray1">{index + 1}.</span> {exercise.name}
        </h3>
        <button
          type="button"
          onClick={timerRunning ? onStopTimer : onStartTimer}
          aria-label={timerRunning ? "Stop set timer" : "Start set timer"}
          className={`flex h-9 shrink-0 touch-manipulation items-center gap-1.5 rounded-full border px-3 text-[14px] font-semibold tabular-nums transition-all duration-150 active:scale-95 ${
            timerRunning
              ? "border-white bg-white text-black"
              : "border-gray2 bg-black text-white active:bg-white/10"
          }`}
        >
          {timerRunning ? (
            <>
              <StopSquare /> {timerLabel}
            </>
          ) : (
            <>
              <StopwatchIcon /> {t.start}
            </>
          )}
        </button>
      </div>

      <div className="mt-1 flex items-center justify-between gap-3">
        <p className="text-[15px] text-gray1">
          {t.repsLine} · {RIR_NOTE}
        </p>
        <span className="shrink-0 text-[13px] font-medium tabular-nums text-gray1">
          {doneCount}/{exercise.sets}
        </span>
      </div>

      {/* What it works + how to do it (short, simple, white text). */}
      {info && (
        <div className="mt-2">
          <p className="text-[13px] text-gray1">
            {t.works}: {works}
          </p>
          <p className="mt-1 text-[14px] leading-relaxed text-white">{howTo}</p>
        </div>
      )}

      {/* Video accordion — a compact row that opens and plays only when tapped. */}
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full touch-manipulation items-center gap-3 rounded-2xl border border-gray2 bg-black p-2 transition-transform duration-150 active:scale-[0.99] active:bg-white/10"
        >
          <span className="relative flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray2">
            {thumb && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumb}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-black/55">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
          <span className="flex-1 text-left text-[15px] font-semibold text-white">
            {open ? t.hideVideo : t.watchVideo}
          </span>
          <span className={`mr-1 text-gray1 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>

        {open && (
          <div className="mt-2">
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-gray2 bg-black">
              <iframe
                src={embedUrl}
                title={`${exercise.name} video`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <a
              href={exercise.video}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-[13px] text-gray1 underline underline-offset-2 active:opacity-60"
            >
              {t.notPlaying}
            </a>
          </div>
        )}
      </div>

      {/* Set targets — three big circles. Tap to complete, tap again to undo. */}
      <div className="mt-4">
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-gray1">
          {t.tapEachSet}
        </p>
        <div className="flex gap-3">
          {Array.from({ length: exercise.sets }, (_, setIndex) => {
            const done = doneSets.includes(setIndex);
            return (
              <button
                key={setIndex}
                type="button"
                aria-pressed={done}
                aria-label={`Set ${setIndex + 1}${done ? ", done" : ", not done"}`}
                onClick={() => onToggleSet(setIndex)}
                className={`flex h-[60px] flex-1 touch-manipulation select-none items-center justify-center rounded-2xl border text-[16px] font-semibold transition-all duration-150 active:scale-95 ${
                  done
                    ? "border-white bg-white text-black"
                    : "border-gray2 bg-black text-white active:bg-white/10"
                }`}
              >
                {done ? <CheckIcon /> : `${t.set} ${setIndex + 1}`}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5l4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StopwatchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M12 13V9M9 2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StopSquare() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
    </svg>
  );
}
