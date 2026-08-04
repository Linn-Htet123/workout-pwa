// ---------------------------------------------------------------------------
// localStorage layer. This is our "database" — a filing cabinet in the browser.
//
// v2: one drawer (key) per SESSION = date + program day, like "2026-08-04|4".
// That means you can do Day 4 on a Monday and it is stored as exactly that.
// Old v1 data (keyed by date only) is migrated once, assuming the day that
// was scheduled on that date.
// ---------------------------------------------------------------------------

import { dateKey, monthKey, weekdayMonFirst } from "./date";

const STORAGE_KEY = "workout-progress-v2";
const LEGACY_KEY = "workout-progress-v1";

// Per-session record of progress.
//   setsDone[exerciseIndex] = list of set indexes that are checked (0-based)
//   completed = the whole session was finished
export interface DayProgress {
  setsDone: Record<number, number[]>;
  completed: boolean;
}

type AllProgress = Record<string, DayProgress>; // key = "YYYY-MM-DD|day"

export function sessionKey(date: string, day: number): string {
  return `${date}|${day}`;
}

function emptyDay(): DayProgress {
  return { setsDone: {}, completed: false };
}

/** One-time migration: v1 keys "YYYY-MM-DD" -> v2 keys "YYYY-MM-DD|<weekday>". */
function migrateLegacy(): AllProgress | null {
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const migrated: AllProgress = {};
    for (const [date, prog] of Object.entries(parsed as Record<string, DayProgress>)) {
      const [y, m, d] = date.split("-").map(Number);
      if (!y || !m || !d) continue;
      const weekday = weekdayMonFirst(new Date(y, m - 1, d));
      migrated[sessionKey(date, weekday)] = prog;
    }
    return migrated;
  } catch {
    return null;
  }
}

/** Read the whole store. Safe on server (returns {}) and on bad JSON. */
function readAll(): AllProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed as AllProgress;
      return {};
    }
    // No v2 data yet — try migrating v1 so old progress is not lost.
    const migrated = migrateLegacy();
    if (migrated) {
      writeAll(migrated);
      return migrated;
    }
    return {};
  } catch {
    // Corrupt data should never crash the app — start clean instead.
    return {};
  }
}

function writeAll(all: AllProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Out of space or private mode — fail quietly, don't crash the workout.
  }
}

/** Progress for one session (a program day done on a real date). */
export function getSessionProgress(date: string, day: number): DayProgress {
  const all = readAll();
  return all[sessionKey(date, day)] ?? emptyDay();
}

export function saveSessionProgress(
  date: string,
  day: number,
  progress: DayProgress,
): void {
  const all = readAll();
  all[sessionKey(date, day)] = progress;
  writeAll(all);
}

/** Toggle a single set on/off and return the fresh session progress. */
export function toggleSet(
  date: string,
  day: number,
  exerciseIndex: number,
  setIndex: number,
): DayProgress {
  const session = getSessionProgress(date, day);
  const current = session.setsDone[exerciseIndex] ?? [];
  const has = current.includes(setIndex);
  const next = has
    ? current.filter((s) => s !== setIndex)
    : [...current, setIndex].sort((a, b) => a - b);

  const setsDone = { ...session.setsDone, [exerciseIndex]: next };
  const updated: DayProgress = { ...session, setsDone };
  saveSessionProgress(date, day, updated);
  return updated;
}

export function setSessionCompleted(
  date: string,
  day: number,
  completed: boolean,
): DayProgress {
  const session = getSessionProgress(date, day);
  const updated: DayProgress = { ...session, completed };
  saveSessionProgress(date, day, updated);
  return updated;
}

/** Dates (as "YYYY-MM-DD") that have at least one completed session. */
export function completedDates(): Set<string> {
  const all = readAll();
  const dates = new Set<string>();
  for (const [key, prog] of Object.entries(all)) {
    if (prog.completed) dates.add(key.split("|")[0]);
  }
  return dates;
}

/** Program day numbers (1..7) completed within the given week's dates. */
export function completedDaysInWeek(weekDates: Date[]): Set<number> {
  const all = readAll();
  const weekKeys = new Set(weekDates.map((d) => dateKey(d)));
  const days = new Set<number>();
  for (const [key, prog] of Object.entries(all)) {
    if (!prog.completed) continue;
    const [date, dayStr] = key.split("|");
    if (weekKeys.has(date)) days.add(Number(dayStr));
  }
  return days;
}

/** How many sessions completed in the same month as `d`. */
export function countCompletedInMonth(d: Date): number {
  const all = readAll();
  const targetMonth = monthKey(d);
  let count = 0;
  for (const [key, prog] of Object.entries(all)) {
    if (prog.completed && key.startsWith(targetMonth)) count += 1;
  }
  return count;
}

/** Any sets checked (but maybe not finished) for a session? */
export function sessionHasAnySets(date: string, day: number): boolean {
  const session = getSessionProgress(date, day);
  return Object.values(session.setsDone).some((arr) => arr.length > 0);
}
