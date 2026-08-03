"use client";

import { useState } from "react";
import type { Exercise } from "@/data/program";
import { RIR_NOTE } from "@/data/program";

interface Props {
  exercise: Exercise;
  index: number;
  doneSets: number[];
  onToggleSet: (setIndex: number) => void;
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
}: Props) {
  // Show the thumbnail first; only load the real player after a tap
  // (faster, and lets the video autoplay from a user gesture).
  const [playing, setPlaying] = useState(false);
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
      {/* Title + progress count */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-[17px] font-semibold leading-tight">
          <span className="text-gray1">{index + 1}.</span> {exercise.name}
        </h3>
        <span className="shrink-0 pt-0.5 text-[13px] font-medium tabular-nums text-gray1">
          {doneCount}/{exercise.sets}
        </span>
      </div>

      <p className="mt-1 text-[15px] text-gray1">10–12 reps · {RIR_NOTE}</p>

      {/* Video: thumbnail → tap → plays inline right here. */}
      <div className="mt-3">
        {playing ? (
          <div className="aspect-video w-full overflow-hidden rounded-2xl border border-gray2 bg-black">
            <iframe
              src={embedUrl}
              title={`${exercise.name} video`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${exercise.name} video`}
            className="relative flex aspect-video w-full touch-manipulation items-center justify-center overflow-hidden rounded-2xl border border-gray2 bg-gray2 transition-transform duration-150 active:scale-[0.99]"
          >
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
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-black/55">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="absolute bottom-2 left-3 text-[13px] font-semibold text-white drop-shadow">
              Watch video
            </span>
          </button>
        )}

        {/* Fallback: if the video won't play inline, open it in YouTube. */}
        <a
          href={exercise.video}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-[13px] text-gray1 underline underline-offset-2 active:opacity-60"
        >
          {playing ? "Not playing? Open in YouTube" : "Open in YouTube instead"}
        </a>
      </div>

      {/* Set targets — three big circles. Tap to complete, tap again to undo. */}
      <div className="mt-4">
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-gray1">
          Tap each set when done
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
                {done ? <CheckIcon /> : `Set ${setIndex + 1}`}
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
