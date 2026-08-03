"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDayWorkout, isRestDay } from "@/data/program";
import {
  dateKey,
  longDateLabel,
  weekDates as getWeekDates,
  weekdayMonFirst,
} from "@/lib/date";
import { countCompletedInMonth, getDayProgress } from "@/lib/storage";
import WeekStrip from "./WeekStrip";

export default function HomeClient() {
  const [mounted, setMounted] = useState(false);
  // Recompute after mount so we read the real date + localStorage on the
  // client only (avoids any server/client mismatch).
  const [today] = useState(() => new Date());

  const [completedKeys, setCompletedKeys] = useState<Set<string>>(new Set());
  const [monthCount, setMonthCount] = useState(0);
  const [todayDone, setTodayDone] = useState(false);
  const [anySetsToday, setAnySetsToday] = useState(false);

  useEffect(() => {
    const wDates = getWeekDates(today);
    const done = new Set<string>();
    for (const d of wDates) {
      if (getDayProgress(dateKey(d)).completed) done.add(dateKey(d));
    }
    setCompletedKeys(done);
    setMonthCount(countCompletedInMonth(today));

    const tp = getDayProgress(dateKey(today));
    setTodayDone(tp.completed);
    setAnySetsToday(
      Object.values(tp.setsDone).some((arr) => arr.length > 0)
    );
    setMounted(true);
  }, [today]);

  const weekday = weekdayMonFirst(today);
  const workout = getDayWorkout(weekday);
  const rest = isRestDay(workout);
  const todayKey = dateKey(today);
  const wDates = getWeekDates(today);

  // Stable placeholder before mount (keeps server + first client render equal).
  if (!mounted) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="safe-top safe-x mx-auto max-w-md pb-10">
        {/* Header */}
        <header className="pt-4">
          <p className="text-[15px] font-medium text-gray1">
            {longDateLabel(today)}
          </p>
          <h1 className="mt-1 text-[34px] font-bold leading-tight tracking-tight">
            {rest ? "Rest Day" : "Today"}
          </h1>
        </header>

        {/* Today's card */}
        {rest ? (
          <RestCard />
        ) : (
          <section className="mt-5 rounded-card border border-gray2 bg-gray3 p-6">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-gray1">
              Day {workout.day}
            </p>
            <h2 className="mt-1 text-[26px] font-bold leading-tight">
              {workout.title}
            </h2>
            <p className="mt-2 text-[15px] text-gray1">
              {workout.exercises.length} exercises · 3 sets each
            </p>

            {todayDone ? (
              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-white/70 bg-white/[0.06] px-4 py-3">
                <CheckCircle />
                <span className="text-[15px] font-semibold">
                  Workout complete
                </span>
              </div>
            ) : (
              <Link
                href="/workout"
                className="mt-5 flex h-14 items-center justify-center rounded-2xl bg-white text-[17px] font-semibold text-black transition-transform duration-150 active:scale-[0.98]"
              >
                {anySetsToday ? "Continue Workout" : "Start Workout"}
              </Link>
            )}
          </section>
        )}

        {/* Week strip */}
        <section className="mt-8">
          <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-gray1">
            This Week
          </h3>
          <WeekStrip
            weekDates={wDates}
            todayKey={todayKey}
            completedKeys={completedKeys}
          />
        </section>

        {/* Monthly counter */}
        <section className="mt-8 rounded-card border border-gray2 bg-gray3 p-6">
          <div className="flex items-baseline gap-2">
            <span className="text-[44px] font-bold leading-none tabular-nums">
              {monthCount}
            </span>
            <span className="text-[17px] font-medium text-gray1">
              workout{monthCount === 1 ? "" : "s"} done this month
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}

function RestCard() {
  return (
    <section className="mt-5 rounded-card border border-gray2 bg-gray3 p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gray2">
        <MoonIcon />
      </div>
      <h2 className="mt-4 text-[22px] font-bold">Take it easy</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-gray1">
        No workout today. Rest, recover, and drink water. You&apos;ll come back
        stronger tomorrow.
      </p>
    </section>
  );
}

function CheckCircle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M7.5 12.5l3 3 6-6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
