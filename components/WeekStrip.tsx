"use client";

import { WEEKDAY_LABELS, dateKey } from "@/lib/date";

interface Props {
  weekDates: Date[];
  todayKey: string;
  completedKeys: Set<string>;
}

// Small Mon–Sun strip. A filled check = that day's workout was completed.
export default function WeekStrip({ weekDates, todayKey, completedKeys }: Props) {
  return (
    <div className="flex justify-between gap-1">
      {weekDates.map((d, i) => {
        const key = dateKey(d);
        const isToday = key === todayKey;
        const done = completedKeys.has(key);
        return (
          <div key={key} className="flex flex-1 flex-col items-center gap-2">
            <span
              className={`text-[12px] font-medium ${
                isToday ? "text-white" : "text-gray1"
              }`}
            >
              {WEEKDAY_LABELS[i]}
            </span>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-200 ${
                done
                  ? "border-white bg-white text-black"
                  : isToday
                    ? "border-white text-white"
                    : "border-gray2 text-gray1"
              }`}
            >
              {done ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12.5l4.2 4.2L19 7"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span className="text-[13px] font-semibold">{d.getDate()}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
