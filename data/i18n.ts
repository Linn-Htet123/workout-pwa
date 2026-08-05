// ---------------------------------------------------------------------------
// Tiny i18n dictionary: English + Burmese. No library — this is a one-user
// app, a plain object is enough. Exercise NAMES stay in English in both
// languages (they are gym terms and match the videos).
// ---------------------------------------------------------------------------

export type Lang = "en" | "my";

export const LANG_STORAGE_KEY = "workout-lang";

export interface UIStrings {
  appTitle: string;
  upNext: string;
  restDay: string;
  takeItEasy: string;
  restDayMessage: string;
  restDayShort: string;
  exercisesUnit: string; // "exercises" / "ခု"
  setsEach: string; // "3 sets each" / "တစ်ခုကို 3 set"
  thisWeek: string;
  doneThisMonthOne: string;
  doneThisMonthMany: string;
  workoutComplete: string;
  niceWork: string;
  watchVideo: string;
  hideVideo: string;
  notPlaying: string;
  works: string;
  tapEachSet: string;
  set: string;
  repsLine: string; // "10–12 reps"
  backHome: string;
  nothingToday: string;
  rest: string;
  paused: string;
  restDone: string;
  go: string;
  start: string;
  pause: string;
  stop: string;
  day: string;
  // --- Calorie estimator ---
  mealTitle: string;
  mealTagline: string; // home card subtitle
  mealSub: string; // screen subtitle / instruction
  addPhoto: string;
  photosUnit: string; // "photos" / "ပုံ"
  photosHint: string;
  noteLabel: string;
  notePlaceholder: string;
  estimateBtn: string;
  estimating: string;
  estCaloriesLabel: string;
  aboutRange: string; // "Likely range"
  itemsLabel: string;
  confidenceLabel: string;
  confLow: string;
  confMedium: string;
  confHigh: string;
  tryAgain: string;
  newPhoto: string; // "New estimate" / start over
  errGeneric: string;
  errNoKey: string;
  needPhotos: string;
  kcal: string;
  aiDisclaimer: string;
  remove: string;
}

export const UI: Record<Lang, UIStrings> = {
  en: {
    appTitle: "My Workout",
    upNext: "Up next",
    restDay: "Rest Day",
    takeItEasy: "Take it easy",
    restDayMessage:
      "No workout today. Rest, recover, and drink water. You'll come back stronger tomorrow.",
    restDayShort: "Rest",
    exercisesUnit: "exercises",
    setsEach: "3 sets each",
    thisWeek: "This Week",
    doneThisMonthOne: "workout done this month",
    doneThisMonthMany: "workouts done this month",
    workoutComplete: "Workout complete",
    niceWork: "Nice work. See you next session.",
    watchVideo: "Watch video",
    hideVideo: "Hide video",
    notPlaying: "Not playing? Open in YouTube",
    works: "Works",
    tapEachSet: "Tap each set when done",
    set: "Set",
    repsLine: "10–12 reps",
    backHome: "Back home",
    nothingToday: "Nothing to train today. Enjoy the rest.",
    rest: "Rest",
    paused: "Paused",
    restDone: "Rest done",
    go: "GO",
    start: "Start",
    pause: "Pause",
    stop: "Stop",
    day: "Day",
    mealTitle: "Calorie Estimator",
    mealTagline: "Snap your meal, get calories",
    mealSub: "Take 3+ photos from different angles, then estimate.",
    addPhoto: "Add photo",
    photosUnit: "photos",
    photosHint: "Different angles = better guess",
    noteLabel: "Note (optional)",
    notePlaceholder: "e.g. fried rice, one plate, with egg",
    estimateBtn: "Estimate calories",
    estimating: "Estimating…",
    estCaloriesLabel: "Estimated calories",
    aboutRange: "Likely range",
    itemsLabel: "What AI sees",
    confidenceLabel: "Confidence",
    confLow: "Low",
    confMedium: "Medium",
    confHigh: "High",
    tryAgain: "Try again",
    newPhoto: "New estimate",
    errGeneric: "Couldn't estimate. Please try again.",
    errNoKey: "AI is not set up yet. Add your API key on Vercel.",
    needPhotos: "Add at least one photo first.",
    kcal: "kcal",
    aiDisclaimer: "AI guess — not exact. Use as a rough guide.",
    remove: "Remove",
  },
  my: {
    appTitle: "ကျွန်တော့် လေ့ကျင့်ခန်း",
    upNext: "နောက်တစ်ခု",
    restDay: "နားရက်",
    takeItEasy: "အနားယူပါ",
    restDayMessage:
      "ဒီနေ့ လေ့ကျင့်ခန်းမရှိပါ။ နားပြီး ရေများများသောက်ပါ။ မနက်ဖြန် ပိုသန်မာလာမယ်။",
    restDayShort: "နားရက်",
    exercisesUnit: "ခု",
    setsEach: "တစ်ခုကို 3 set",
    thisWeek: "ဒီအပတ်",
    doneThisMonthOne: "ကြိမ် ဒီလအတွင်း ပြီးပြီ",
    doneThisMonthMany: "ကြိမ် ဒီလအတွင်း ပြီးပြီ",
    workoutComplete: "လေ့ကျင့်ခန်း ပြီးပါပြီ",
    niceWork: "အရမ်းကောင်းတယ်။ နောက်တစ်ကြိမ် တွေ့မယ်။",
    watchVideo: "ဗီဒီယိုကြည့်ရန်",
    hideVideo: "ဗီဒီယိုပိတ်ရန်",
    notPlaying: "မဖွင့်ဘူးလား? YouTube မှာဖွင့်ပါ",
    works: "အလုပ်လုပ်တဲ့နေရာ",
    tapEachSet: "Set ပြီးတိုင်း နှိပ်ပါ",
    set: "Set",
    repsLine: "10–12 ကြိမ်",
    backHome: "ပင်မသို့",
    nothingToday: "ဒီနေ့ လေ့ကျင့်စရာမရှိပါ။ ကောင်းကောင်းနားပါ။",
    rest: "အနားယူချိန်",
    paused: "ခဏရပ်ထားသည်",
    restDone: "အနားယူပြီးပြီ",
    go: "GO",
    start: "စတင်ရန်",
    pause: "ခဏရပ်ရန်",
    stop: "ရပ်ရန်",
    day: "Day",
    mealTitle: "ကယ်လိုရီ ခန့်မှန်း",
    mealTagline: "အစားအစာ ဓာတ်ပုံရိုက်၊ ကယ်လိုရီသိ",
    mealSub: "ထောင့်အမျိုးမျိုးက ၃ ပုံလောက်ရိုက်ပြီး ခန့်မှန်းပါ။",
    addPhoto: "ဓာတ်ပုံထည့်ရန်",
    photosUnit: "ပုံ",
    photosHint: "ထောင့်များစွာ = ပိုတိကျ",
    noteLabel: "မှတ်ချက် (ဖြည့်စွက်လိုက)",
    notePlaceholder: "ဥပမာ - ထမင်းကြော် တစ်ပွဲ၊ ဥနှင့်",
    estimateBtn: "ကယ်လိုရီ ခန့်မှန်းရန်",
    estimating: "ခန့်မှန်းနေသည်…",
    estCaloriesLabel: "ခန့်မှန်း ကယ်လိုရီ",
    aboutRange: "ဖြစ်နိုင်ခြေ အတိုင်းအတာ",
    itemsLabel: "AI မြင်တဲ့အရာများ",
    confidenceLabel: "ယုံကြည်မှု",
    confLow: "နည်း",
    confMedium: "အလယ်အလတ်",
    confHigh: "မြင့်",
    tryAgain: "ပြန်ကြိုးစားရန်",
    newPhoto: "အသစ် ခန့်မှန်းရန်",
    errGeneric: "ခန့်မှန်း၍မရပါ။ ပြန်ကြိုးစားပါ။",
    errNoKey: "AI ကို မတပ်ဆင်ရသေးပါ။ Vercel မှာ API key ထည့်ပါ။",
    needPhotos: "အနည်းဆုံး ဓာတ်ပုံတစ်ပုံ အရင်ထည့်ပါ။",
    kcal: "kcal",
    aiDisclaimer: "AI ခန့်မှန်းချက် — တိကျမှုမဟုတ်ပါ။ အကြမ်းဖျင်းသာ။",
    remove: "ဖယ်ရှားရန်",
  },
};

// Day titles from the trainer's plan, translated. Keys are the English
// titles used in data/program.ts.
export const DAY_TITLES_MY: Record<string, string> = {
  "Chest & Tricep": "ရင်အုပ်နှင့် လက်မောင်းနောက်ကြွက်သား",
  "Back & Bicep": "ကျောနှင့် လက်မောင်းကြွက်သား",
  "Shoulder & Abs": "ပခုံးနှင့် ဗိုက်ကြွက်သား",
  Leg: "ခြေထောက်",
  "Whole Body": "တစ်ကိုယ်လုံး",
  Rest: "နားရက်",
};

export function dayTitle(title: string, lang: Lang): string {
  if (lang === "my") return DAY_TITLES_MY[title] ?? title;
  return title;
}
