"use client";

import { useEffect, useRef, useState } from "react";
import { playAlarm } from "@/lib/sound";
import { useLang } from "./LangProvider";

interface Props {
  // Changes each time we should (re)start the timer fresh.
  startToken: number;
  // Chosen total duration in seconds.
  duration: number;
  onPickDuration: (seconds: number) => void;
  onStop: () => void;
}

const QUICK = [60, 90, 120];

export default function RestTimer({
  startToken,
  duration,
  onPickDuration,
  onStop,
}: Props) {
  const { t } = useLang();
  // While running we track an END timestamp, so the countdown stays correct
  // even if the phone screen locks (locked screens pause JS timers).
  const [endTime, setEndTime] = useState<number | null>(null);
  // While paused we freeze the remaining milliseconds here.
  const [pausedMs, setPausedMs] = useState<number | null>(null);
  const [now, setNow] = useState<number>(0);
  const vibratedRef = useRef(false);

  const running = endTime !== null;

  // (Re)start whenever startToken changes.
  useEffect(() => {
    vibratedRef.current = false;
    setPausedMs(null);
    setEndTime(Date.now() + duration * 1000);
    setNow(Date.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startToken]);

  // Tick only while running.
  useEffect(() => {
    if (!running) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [running, endTime]);

  // Remaining milliseconds: from the timestamp if running, else the frozen value.
  const remainingMs = running
    ? Math.max(0, (endTime as number) - now)
    : Math.max(0, pausedMs ?? 0);

  const finished = running && remainingMs <= 0;

  // Alarm once when we hit zero: a sound (works on iPhone) plus a buzz on
  // devices that support vibration (Android).
  if (finished && !vibratedRef.current) {
    vibratedRef.current = true;
    playAlarm("rest");
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch {
        /* ignore */
      }
    }
  }

  function pause() {
    if (!running) return;
    setPausedMs(Math.max(0, (endTime as number) - Date.now()));
    setEndTime(null);
  }

  function start() {
    // Resume from paused, or restart a fresh full rest if it was at zero.
    const ms = pausedMs && pausedMs > 0 ? pausedMs : duration * 1000;
    vibratedRef.current = false;
    setPausedMs(null);
    setEndTime(Date.now() + ms);
    setNow(Date.now());
  }

  const remaining = Math.ceil(remainingMs / 1000);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const label = `${mins}:${String(secs).padStart(2, "0")}`;

  // Progress ring.
  const R = 30;
  const C = 2 * Math.PI * R;
  const fraction =
    duration > 0 ? Math.min(1, remainingMs / (duration * 1000)) : 0;
  const dashoffset = finished ? 0 : C * (1 - fraction);

  const statusText = finished ? t.restDone : running ? t.rest : t.paused;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 safe-bottom">
      <div className="safe-x pb-2">
        <div className="mx-auto max-w-md rounded-card border border-gray2 bg-gray3/95 p-4 backdrop-blur md:max-w-3xl">
          {/* Top: ring + status + duration pills */}
          <div className="flex items-center gap-4">
            <div className="relative h-[72px] w-[72px] shrink-0">
              <svg className="h-[72px] w-[72px] -rotate-90" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r={R} fill="none" stroke="#3A3A3C" strokeWidth="6" />
                <circle
                  cx="36"
                  cy="36"
                  r={R}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={dashoffset}
                  style={{ transition: "stroke-dashoffset 250ms linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {finished ? (
                  <span className="text-base font-bold tracking-wide">{t.go}</span>
                ) : (
                  <span className="text-lg font-semibold tabular-nums">{label}</span>
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-[13px] font-medium text-gray1">{statusText}</span>
              <div className="mt-2 flex gap-2">
                {QUICK.map((s) => {
                  const active = s === duration;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onPickDuration(s)}
                      className={`h-10 flex-1 touch-manipulation rounded-xl border text-[14px] font-semibold transition-all duration-150 active:scale-95 ${
                        active
                          ? "border-white bg-white text-black"
                          : "border-gray2 bg-black text-white active:bg-white/10"
                      }`}
                    >
                      {s}s
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom: Start/Pause + Stop */}
          <div className="mt-3 flex gap-2">
            {running && !finished ? (
              <button
                type="button"
                onClick={pause}
                className="flex h-12 flex-1 touch-manipulation items-center justify-center gap-2 rounded-xl bg-white text-[15px] font-semibold text-black transition-transform duration-150 active:scale-95"
              >
                <PauseIcon /> {t.pause}
              </button>
            ) : (
              <button
                type="button"
                onClick={start}
                className="flex h-12 flex-1 touch-manipulation items-center justify-center gap-2 rounded-xl bg-white text-[15px] font-semibold text-black transition-transform duration-150 active:scale-95"
              >
                <PlayIcon /> {t.start}
              </button>
            )}
            <button
              type="button"
              onClick={onStop}
              className="flex h-12 flex-1 touch-manipulation items-center justify-center gap-2 rounded-xl border border-gray2 bg-black text-[15px] font-semibold text-white transition-transform duration-150 active:scale-95 active:bg-white/10"
            >
              <StopIcon /> {t.stop}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
    </svg>
  );
}
function StopIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
    </svg>
  );
}
