import WorkoutClient from "@/components/WorkoutClient";

// /workout?day=4 opens Day 4 no matter what the calendar says.
// Without ?day, we fall back to today's scheduled day (handled client-side).
export default function WorkoutPage({
  searchParams,
}: {
  searchParams?: { day?: string };
}) {
  const n = Number(searchParams?.day);
  const day = Number.isInteger(n) && n >= 1 && n <= 7 ? n : undefined;
  return <WorkoutClient dayOverride={day} />;
}
