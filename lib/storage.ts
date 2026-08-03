// ---------------------------------------------------------------------------
// localStorage layer. This is our "database" — a filing cabinet in the browser.
// One drawer (key) per date. If the cabinet is empty, we start clean and never
// crash.
// ---------------------------------------------------------------------------

import { dateKey, monthKey } from "./date";

const STORAGE_KEY = "workout-progress-v1";

// Per-date record of progress.
//   setsDone[exerciseIndex] = list of set indexes that are checked (0-based)
//   completed = the whole day was finished
export interface DayProgress {
  setsDone: Record<number, number[]>;
  completed: boolean;
}

type AllProgress = Record<string, DayProgress>; // key = "YYYY-MM-DD"

function emptyDay(): DayProgress {
  return { setsDone: {}, completed: false };
}

/** Read the whole store. Safe on server (returns {}) and on bad JSON. */
function readAll(): AllProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as AllProgress;
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

export function getDayProgress(key: string): DayProgress {
  const all = readAll();
  return all[key] ?? emptyDay();
}

export function saveDayProgress(key: string, progress: DayProgress): void {
  const all = readAll();
  all[key] = progress;
  writeAll(all);
}

/** Toggle a single set on/off and return the fresh day progress. */
export function toggleSet(
  key: string,
  exerciseIndex: number,
  setIndex: number,
): DayProgress {
  const day = getDayProgress(key);
  const current = day.setsDone[exerciseIndex] ?? [];
  const has = current.includes(setIndex);
  const next = has
    ? current.filter((s) => s !== setIndex)
    : [...current, setIndex].sort((a, b) => a - b);

  const setsDone = { ...day.setsDone, [exerciseIndex]: next };
  const updated: DayProgress = { ...day, setsDone };
  saveDayProgress(key, updated);
  return updated;
}

export function setDayCompleted(key: string, completed: boolean): DayProgress {
  const day = getDayProgress(key);
  const updated: DayProgress = { ...day, completed };
  saveDayProgress(key, updated);
  return updated;
}

/** Was a given date's workout marked complete? */
export function isDateCompleted(d: Date): boolean {
  return getDayProgress(dateKey(d)).completed;
}

/** How many workouts completed in the same month as `d`. */
export function countCompletedInMonth(d: Date): number {
  const all = readAll();
  const targetMonth = monthKey(d);
  let count = 0;
  for (const [key, prog] of Object.entries(all)) {
    if (prog.completed && key.startsWith(targetMonth)) count += 1;
  }
  return count;
}
