"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getDayWorkout, isRestDay } from "@/data/program";
import { dateKey, weekdayMonFirst } from "@/lib/date";
import {
  getDayProgress,
  setDayCompleted,
  toggleSet as toggleSetStore,
  type DayProgress,
} from "@/lib/storage";
import ExerciseCard from "./ExerciseCard";
import RestTimer from "./RestTimer";
import { unlockAudio, playAlarm } from "@/lib/sound";

const DEFAULT_REST = 90;

function fmt(ms: number): string {
  const s = Math.floor(Math.max(0, ms) / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export default function WorkoutClient() {
  const [mounted, setMounted] = useState(false);
  const [today] = useState(() => new Date());
  const [progress, setProgress] = useState<DayProgress>({
    setsDone: {},
    completed: false,
  });

  // Rest timer state. `restActive` shows the bar; `startToken` bumps to
  // (re)start the countdown; `restDuration` is the chosen length.
  const [restActive, setRestActive] = useState(false);
  const [startToken, setStartToken] = useState(0);
  const [restDuration, setRestDuration] = useState<number>(DEFAULT_REST);

  // Per-set stopwatch. Only one runs at a time; it counts UP from startAt.
  const [setTimer, setSetTimer] = useState<{ index: number; startAt: number } | null>(
    null
  );
  const [nowTick, setNowTick] = useState(0);

  // Tick every 250ms while a set stopwatch is running.
  useEffect(() => {
    if (!setTimer) return;
    setNowTick(Date.now());
    const id = setInterval(() => setNowTick(Date.now()), 250);
    return () => clearInterval(id);
  }, [setTimer]);

  const todayKey = dateKey(today);
  const weekday = weekdayMonFirst(today);
  const workout = useMemo(() => getDayWorkout(weekday), [weekday]);
  const rest = isRestDay(workout);

  useEffect(() => {
    setProgress(getDayProgress(todayKey));
    setMounted(true);
  }, [todayKey]);

  const totalSets = workout.exercises.reduce((sum, e) => sum + e.sets, 0);
  const doneCount = workout.exercises.reduce(
    (sum, e, i) => sum + (progress.setsDone[i]?.length ?? 0),
    0
  );
  const allDone = totalSets > 0 && doneCount >= totalSets;

  function handleToggle(exerciseIndex: number, setIndex: number) {
    unlockAudio(); // this tap lets iOS play sounds later
    const wasComplete = progress.completed;
    const updated = toggleSetStore(todayKey, exerciseIndex, setIndex);
    const nowChecked = updated.setsDone[exerciseIndex]?.includes(setIndex);

    // Recompute completion from the fresh data and persist it.
    const nowDoneCount = workout.exercises.reduce(
      (sum, e, i) => sum + (updated.setsDone[i]?.length ?? 0),
      0
    );
    const complete = totalSets > 0 && nowDoneCount >= totalSets;
    const finalProgress = setDayCompleted(todayKey, complete);
    setProgress(finalProgress);

    // Play the celebration sound the moment the day becomes complete.
    if (complete && !wasComplete) playAlarm("done");

    // Start a rest timer only when a set was just turned ON (not undone).
    if (nowChecked) {
      setRestActive(true);
      setStartToken((t) => t + 1);
    }
  }

  function pickDuration(seconds: number) {
    // Changing the length restarts the rest with the new time.
    unlockAudio();
    setRestDuration(seconds);
    setRestActive(true);
    setStartToken((t) => t + 1);
  }

  function startSetTimer(index: number) {
    unlockAudio();
    setSetTimer({ index, startAt: Date.now() });
  }

  function stopSetTimer() {
    if (setTimer) playAlarm("set");
    setSetTimer(null);
  }

  const setTimerElapsed = setTimer ? nowTick - setTimer.startAt : 0;

  if (!mounted) {
    return <div className="min-h-screen bg-black" />;
  }

  // Someone opened /workout on a rest day — send them somewhere calm.
  if (rest) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="safe-top safe-x mx-auto flex min-h-screen max-w-md flex-col items-center justify-center text-center">
          <h1 className="text-[28px] font-bold">Rest Day</h1>
          <p className="mt-2 text-[15px] text-gray1">
            Nothing to train today. Enjoy the rest.
          </p>
          <Link
            href="/"
            className="mt-6 flex h-12 items-center justify-center rounded-full border border-gray2 px-6 text-[15px] font-semibold active:bg-white/10"
          >
            Back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Sticky clock — stays pinned at the top while a set timer runs. */}
      {setTimer && (
        <div className="fixed inset-x-0 top-0 z-40">
          <div className="safe-top safe-x bg-black/80 backdrop-blur">
            <div className="mx-auto flex max-w-md items-center gap-3 py-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 13V9M9 2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] text-gray1">
                  {workout.exercises[setTimer.index]?.name}
                </p>
                <p className="text-[20px] font-bold leading-none tabular-nums">
                  {fmt(setTimerElapsed)}
                </p>
              </div>
              <button
                type="button"
                onClick={stopSetTimer}
                className="flex h-9 touch-manipulation items-center gap-1.5 rounded-full bg-white px-4 text-[14px] font-semibold text-black active:scale-95"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="6" width="12" height="12" rx="1.5" />
                </svg>
                Stop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extra bottom padding leaves room for the floating rest timer. */}
      <div className="safe-top safe-x mx-auto max-w-md pb-48">
        <header className="flex items-center justify-between pt-4">
          <Link
            href="/"
            aria-label="Back home"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray2 active:bg-white/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 5l-7 7 7 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <span className="text-[13px] font-semibold uppercase tracking-wide text-gray1">
            Day {workout.day}
          </span>
        </header>

        <div className="mt-3">
          <h1 className="text-[32px] font-bold leading-tight tracking-tight">
            {workout.title}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray2">
              <div
                className="h-full rounded-full bg-white transition-all duration-300"
                style={{ width: `${totalSets ? (doneCount / totalSets) * 100 : 0}%` }}
              />
            </div>
            <span className="text-[13px] font-medium tabular-nums text-gray1">
              {doneCount}/{totalSets}
            </span>
          </div>
        </div>

        {allDone && (
          <div className="mt-5 flex items-center gap-3 rounded-card border border-white/70 bg-white/[0.06] p-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path
                d="M7.5 12.5l3 3 6-6.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className="text-[16px] font-semibold">Workout complete</p>
              <p className="text-[13px] text-gray1">Nice work. See you next session.</p>
            </div>
          </div>
        )}

        <div className="mt-5 space-y-4">
          {workout.exercises.map((exercise, i) => (
            <ExerciseCard
              key={`${exercise.name}-${i}`}
              exercise={exercise}
              index={i}
              doneSets={progress.setsDone[i] ?? []}
              onToggleSet={(setIndex) => handleToggle(i, setIndex)}
              timerRunning={setTimer?.index === i}
              timerLabel={setTimer?.index === i ? fmt(setTimerElapsed) : ""}
              onStartTimer={() => startSetTimer(i)}
              onStopTimer={stopSetTimer}
            />
          ))}
        </div>
      </div>

      {restActive && (
        <RestTimer
          startToken={startToken}
          duration={restDuration}
          onPickDuration={pickDuration}
          onStop={() => setRestActive(false)}
        />
      )}
    </main>
  );
}
