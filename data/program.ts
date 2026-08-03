// ---------------------------------------------------------------------------
// Your trainer's plan. This is the single source of truth for the program.
//
// The video links below were extracted directly from the clickable links
// inside your trainer's PDF (Linn-Htet-Sheet1.pdf) — the exact ones that open
// YouTube when tapped in the PDF. If any single video is ever removed by its
// uploader, just fix that one URL right here in this file.
//
// Every exercise: 3 sets, "10 or 12" reps, RIR +2 2 0.
// ---------------------------------------------------------------------------

export interface Exercise {
  name: string;
  video: string;
  reps: string;
  sets: number;
}

export interface WorkoutDay {
  day: number; // 1 = Monday ... 7 = Sunday
  title: string;
  exercises: Exercise[];
}

// Shown on every exercise (from the trainer's note).
export const RIR_NOTE = "RIR +2 2 0";

export const weeklySchedule: WorkoutDay[] = [
  {
    day: 1,
    title: "Chest & Tricep",
    exercises: [
      { name: "Floor Dumbbells Chest Press", video: "https://youtu.be/yjOzxq8FVVM?si=SQU3DjLKzfNzb7uj", reps: "10 or 12", sets: 3 },
      { name: "Floor Dumbbells Chest Fly", video: "https://youtu.be/TXvq3s_IXrI?si=L2a0BUryKA7Oh39D", reps: "10 or 12", sets: 3 },
      { name: "Floor Dumbbells Pullover", video: "https://youtu.be/j8BZgkQUCrg?si=dpNBFQkAwBk9sLsJ", reps: "10 or 12", sets: 3 },
      { name: "Decline Push Up", video: "https://youtu.be/JGMABCVu_20?si=Qc7R2FGtjkKA8a8y", reps: "10 or 12", sets: 3 },
      { name: "Seated Dumbbells Tricep Extension", video: "https://youtu.be/fahr9ZDvVtY?si=TJoHnuxOrxYx-cbv", reps: "10 or 12", sets: 3 },
      { name: "Dumbbells Tricep Kickback", video: "https://youtu.be/KBk0eZiL58Q?si=erhFGj5IFiRpUv_P", reps: "10 or 12", sets: 3 },
    ],
  },
  {
    day: 2,
    title: "Back & Bicep",
    exercises: [
      { name: "Dumbbells Row", video: "https://youtu.be/hK5XW2qUVUk?si=X1CSkNBEdcHEBaAn", reps: "10 or 12", sets: 3 },
      { name: "Dumbbells Back Fly", video: "https://youtu.be/0S-esuAYf04?si=u9VSho4iiXcFmJyQ", reps: "10 or 12", sets: 3 },
      { name: "Dumbbells Single Arm Row", video: "https://youtu.be/8pPHPozUtao?si=LUWWdFeGuI5a4nb5", reps: "10 or 12", sets: 3 },
      { name: "Dumbbells Drag Curl", video: "https://youtu.be/0pPYApR9-kA?si=raRSpdfbSAwEVMfL", reps: "10 or 12", sets: 3 },
      { name: "Concentration Curl", video: "https://youtu.be/A5URmn7lo9g?si=etP12MBHkd-FziYQ", reps: "10 or 12", sets: 3 },
      { name: "Dumbbells Hammer Curl", video: "https://youtu.be/_Nllgt5LM84?si=zVN3d_bDI_1B1EOF", reps: "10 or 12", sets: 3 },
    ],
  },
  {
    day: 3,
    title: "Rest",
    exercises: [],
  },
  {
    day: 4,
    title: "Shoulder & Abs",
    exercises: [
      { name: "Dumbbells Shoulder Press", video: "https://youtu.be/5Ozbt8SdR_A?si=U5kev-dFq3uO87cg", reps: "10 or 12", sets: 3 },
      { name: "Dumbbells Front Raises", video: "https://youtu.be/3nx5_OJs8iY?si=FIAj37iZytgZ8qxO", reps: "10 or 12", sets: 3 },
      { name: "Dumbbells Lateral Raises", video: "https://youtu.be/CADKU4SJ624?si=Hq2BS-E2aqv5qEJJ", reps: "10 or 12", sets: 3 },
      { name: "Crunches", video: "https://youtu.be/6chRVqWcu34?si=cN-FFD7c_2eSUomv", reps: "10 or 12", sets: 3 },
      { name: "Russian Twist", video: "https://youtu.be/B0k51rUbu_I?si=rT-PcCyPqJDP4btg", reps: "10 or 12", sets: 3 },
      { name: "Leg Raise", video: "https://youtu.be/WuDTppa4JMs?si=8xCGE6OhLqeAFDGr", reps: "10 or 12", sets: 3 },
    ],
  },
  {
    day: 5,
    title: "Leg",
    exercises: [
      { name: "Squat", video: "https://youtu.be/q7wHjELpNV8?si=4ZomSxjolGcDz-dh", reps: "10 or 12", sets: 3 },
      { name: "Dumbbells Sumo Squat", video: "https://youtu.be/V44R6fo8ong?si=qg69Idd2DiXVaILn", reps: "10 or 12", sets: 3 },
      { name: "Dumbbells RDL", video: "https://youtu.be/EGkHvonlo90?si=RF3MipAyRVoUuG9D", reps: "10 or 12", sets: 3 },
      { name: "Prisoner Squat", video: "https://youtu.be/9_kNHBi8yKc?si=TCq2g6kDaHv7rhoc", reps: "10 or 12", sets: 3 },
      { name: "Lunges", video: "https://youtu.be/Ni8mEh-Na-k?si=3xCUYR5O1HYNmHnR", reps: "10 or 12", sets: 3 },
      { name: "Glute Bridge", video: "https://youtu.be/gbVF5ydzTh8?si=cb7FZD7HaOqNGnqI", reps: "10 or 12", sets: 3 },
    ],
  },
  {
    day: 6,
    title: "Whole Body",
    exercises: [
      { name: "Dumbbells Shoulder Press", video: "https://youtu.be/5Ozbt8SdR_A?si=U5kev-dFq3uO87cg", reps: "10 or 12", sets: 3 },
      { name: "Push Up", video: "https://youtu.be/qKDO6KlS_Hk?si=C-m1x3Acq5nK8Tyv", reps: "10 or 12", sets: 3 },
      { name: "Dumbbells Rear Delt Fly", video: "https://youtu.be/gGmC0KbTLvE?si=56my_7CMECbMHl7_", reps: "10 or 12", sets: 3 },
      { name: "Dumbbells Drag Curl", video: "https://youtu.be/0pPYApR9-kA?si=raRSpdfbSAwEVMfL", reps: "10 or 12", sets: 3 },
      { name: "Dumbbells Hammer Curl", video: "https://youtu.be/_Nllgt5LM84?si=zVN3d_bDI_1B1EOF", reps: "10 or 12", sets: 3 },
      { name: "Squat", video: "https://youtu.be/q7wHjELpNV8?si=4ZomSxjolGcDz-dh", reps: "10 or 12", sets: 3 },
    ],
  },
  {
    day: 7,
    title: "Rest",
    exercises: [],
  },
];

/**
 * Get the workout for a given weekday number.
 * @param weekday 1 = Monday ... 7 = Sunday
 */
export function getDayWorkout(weekday: number): WorkoutDay {
  const found = weeklySchedule.find((d) => d.day === weekday);
  // Fallback to a rest day so the UI never crashes on a bad number.
  return found ?? { day: weekday, title: "Rest", exercises: [] };
}

export function isRestDay(day: WorkoutDay): boolean {
  return day.exercises.length === 0;
}
