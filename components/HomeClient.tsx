"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isRestDay, weeklySchedule } from "@/data/program";
import { dayTitle } from "@/data/i18n";
import {
  dateKey,
  longDateLabel,
  weekDates as getWeekDates,
  weekdayMonFirst,
} from "@/lib/date";
import {
  completedDates,
  completedDaysInWeek,
  countCompletedInMonth,
} from "@/lib/storage";
import WeekStrip from "./WeekStrip";
import { LangToggle, useLang } from "./LangProvider";

export default function HomeClient() {
  const { t, lang } = useLang();
  const [mounted, setMounted] = useState(false);
  // Recompute after mount so we read the real date + localStorage on the
  // client only (avoids any server/client mismatch).
  const [today] = useState(() => new Date());

  const [completedKeys, setCompletedKeys] = useState<Set<string>>(new Set());
  const [doneDays, setDoneDays] = useState<Set<number>>(new Set());
  const [monthCount, setMonthCount] = useState(0);

  useEffect(() => {
    const wDates = getWeekDates(today);
    const doneDates = completedDates();
    const done = new Set<string>();
    for (const d of wDates) {
      if (doneDates.has(dateKey(d))) done.add(dateKey(d));
    }
    setCompletedKeys(done);
    setDoneDays(completedDaysInWeek(wDates));
    setMonthCount(countCompletedInMonth(today));
    setMounted(true);
  }, [today]);

  const suggestedDay = weekdayMonFirst(today); // today's scheduled day
  const todayKey = dateKey(today);
  const wDates = getWeekDates(today);

  // Stable placeholder before mount (keeps server + first client render equal).
  if (!mounted) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="safe-top safe-x mx-auto max-w-md pb-10 md:max-w-3xl">
        {/* Header */}
        <header className="flex items-end justify-between gap-3 pt-4">
          <div className="min-w-0">
            <p className="text-[15px] font-medium text-gray1">
              {longDateLabel(today)}
            </p>
            <h1 className="mt-1 text-[34px] font-bold leading-tight tracking-tight">
              {t.appTitle}
            </h1>
          </div>
          <div className="pb-1">
            <LangToggle />
          </div>
        </header>

        {/* AI calorie estimator */}
        <Link
          href="/meal"
          className="mt-5 flex items-center gap-4 rounded-card border border-gray2 bg-gray3 p-5 transition-transform duration-150 active:scale-[0.99] active:bg-white/5"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gray2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] font-semibold leading-snug">{t.mealTitle}</h2>
            <p className="mt-0.5 text-[13px] text-gray1">{t.mealTagline}</p>
          </div>
          <Chevron />
        </Link>

        {/* Day list — tap ANY day and just do it. Nothing is locked. */}
        <section className="mt-5 space-y-3">
          {weeklySchedule.map((w) => {
            const rest = isRestDay(w);
            const done = doneDays.has(w.day);
            const suggested = w.day === suggestedDay && !rest;

            if (rest) {
              return (
                <div
                  key={w.day}
                  className="flex items-center gap-4 rounded-card border border-gray2/60 bg-black p-5"
                >
                  <DayBadge day={w.day} muted />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[17px] font-semibold text-gray1">
                      {dayTitle(w.title, lang)}
                    </h2>
                  </div>
                  <MoonIcon />
                </div>
              );
            }

            return (
              <Link
                key={w.day}
                href={`/workout?day=${w.day}`}
                className={`flex items-center gap-4 rounded-card border p-5 transition-transform duration-150 active:scale-[0.99] ${
                  done
                    ? "border-white/60 bg-white/[0.05]"
                    : "border-gray2 bg-gray3 active:bg-white/5"
                }`}
              >
                <DayBadge day={w.day} done={done} />
                <div className="min-w-0 flex-1">
                  {suggested && (
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray1">
                      {t.upNext}
                    </p>
                  )}
                  <h2 className="text-[17px] font-semibold leading-snug">
                    {dayTitle(w.title, lang)}
                  </h2>
                  <p className="mt-0.5 text-[13px] text-gray1">
                    {w.exercises.length} {t.exercisesUnit} · {t.setsEach}
                  </p>
                </div>
                {done ? <CheckCircle /> : <Chevron />}
              </Link>
            );
          })}
        </section>

        {/* Week strip */}
        <section className="mt-8">
          <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-gray1">
            {t.thisWeek}
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
              {monthCount === 1 ? t.doneThisMonthOne : t.doneThisMonthMany}
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}

function DayBadge({
  day,
  done,
  muted,
}: {
  day: number;
  done?: boolean;
  muted?: boolean;
}) {
  return (
    <span
      className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl border ${
        done
          ? "border-white bg-white text-black"
          : muted
            ? "border-gray2/60 text-gray1"
            : "border-gray2 text-white"
      }`}
    >
      <span className="text-[10px] font-semibold uppercase leading-none opacity-70">
        Day
      </span>
      <span className="mt-0.5 text-[18px] font-bold leading-none tabular-nums">
        {day}
      </span>
    </span>
  );
}

function Chevron() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-gray1">
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckCircle() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-gray1">
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
