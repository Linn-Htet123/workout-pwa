// ---------------------------------------------------------------------------
// Date helpers. We key everything by a local date string like "2026-08-03".
// IMPORTANT: We always use the device's LOCAL time, never UTC, so the workout
// matches the real day where you are standing (Bangkok, etc.).
// ---------------------------------------------------------------------------

/** Weekday number for a Date, where Monday = 1 ... Sunday = 7. */
export function weekdayMonFirst(d: Date): number {
  const js = d.getDay(); // JS: Sunday = 0, Monday = 1 ... Saturday = 6
  return js === 0 ? 7 : js;
}

/** Local date string "YYYY-MM-DD" (no timezone shifting). */
export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Short month key like "2026-08" — used for the monthly counter. */
export function monthKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/** The Monday date of the week that contains `d`. */
export function startOfWeekMonday(d: Date): Date {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const wd = weekdayMonFirst(copy); // 1..7
  copy.setDate(copy.getDate() - (wd - 1));
  return copy;
}

/** The 7 dates Mon..Sun for the week containing `d`. */
export function weekDates(d: Date): Date[] {
  const monday = startOfWeekMonday(d);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });
}

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** e.g. "Monday, August 3" */
export function longDateLabel(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
