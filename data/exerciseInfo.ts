// ---------------------------------------------------------------------------
// Short explanation for every exercise: which body part it works and how to
// do it, in English and Burmese. Looked up by exercise name, so exercises
// that repeat on different days (Squat, Shoulder Press, ...) share one entry.
// ---------------------------------------------------------------------------

export interface ExerciseInfo {
  works: string;
  howTo: string;
  worksMy: string;
  howToMy: string;
}

const INFO: Record<string, ExerciseInfo> = {
  "Floor Dumbbells Chest Press": {
    works: "Chest, front shoulders, triceps",
    howTo:
      "Lie on the floor, knees bent. Press the dumbbells straight up over your chest. Lower slowly until your upper arms touch the floor. Press up again.",
    worksMy: "ရင်အုပ်၊ ပခုံးအရှေ့ပိုင်း၊ လက်မောင်းနောက်ကြွက်သား",
    howToMy:
      "ကြမ်းပြင်ပေါ် ပက်လက်လှဲပြီး ဒူးထောင်ပါ။ ဒမ်ဘဲလ်ကို ရင်အုပ်အပေါ် တည့်တည့်တွန်းတင်ပါ။ လက်မောင်းအပေါ်ပိုင်း ကြမ်းပြင်ထိသည်အထိ ဖြည်းဖြည်းချပါ။ ပြန်တွန်းတင်ပါ။",
  },
  "Floor Dumbbells Chest Fly": {
    works: "Chest",
    howTo:
      "Lie on the floor. Hold dumbbells above your chest, small bend in the elbows. Open your arms wide, then bring the dumbbells back together. Like hugging a big tree.",
    worksMy: "ရင်အုပ်",
    howToMy:
      "ပက်လက်လှဲပါ။ ဒမ်ဘဲလ်ကို ရင်အုပ်အပေါ်မှာကိုင်ပြီး တံတောင်အနည်းငယ်ကွေးပါ။ လက်နှစ်ဖက်ကို ဘေးသို့ကျယ်ကျယ်ဖြန့်ပြီး ပြန်စုပါ။ သစ်ပင်ကြီးကို ဖက်သလိုမျိုးပါ။",
  },
  "Floor Dumbbells Pullover": {
    works: "Chest, lats (side back)",
    howTo:
      "Lie on the floor. Hold one dumbbell with both hands above your chest. Lower it back over your head with almost straight arms. Pull it back over your chest.",
    worksMy: "ရင်အုပ်၊ ကျောဘေးကြွက်သား",
    howToMy:
      "ပက်လက်လှဲပါ။ ဒမ်ဘဲလ်တစ်လုံးကို လက်နှစ်ဖက်နဲ့ ရင်အုပ်အပေါ်ကိုင်ပါ။ လက်ဖြောင့်နီးပါးထားပြီး ခေါင်းနောက်ဘက်သို့ ဖြည်းဖြည်းချပါ။ ရင်အုပ်အပေါ် ပြန်ဆွဲတင်ပါ။",
  },
  "Decline Push Up": {
    works: "Upper chest, shoulders",
    howTo:
      "Put your feet on a chair or bed, hands on the floor. Keep your body straight. Lower your chest to the floor, then push up.",
    worksMy: "ရင်အုပ်အပေါ်ပိုင်း၊ ပခုံး",
    howToMy:
      "ခြေထောက်ကို ကုလားထိုင် သို့မဟုတ် ခုတင်ပေါ်တင်ပြီး လက်ကို ကြမ်းပြင်ပေါ်ထောက်ပါ။ ခန္ဓာကိုယ် ဖြောင့်နေပါစေ။ ရင်အုပ်ကို ကြမ်းပြင်နားထိအောင်ချပြီး ပြန်တွန်းတက်ပါ။",
  },
  "Seated Dumbbells Tricep Extension": {
    works: "Triceps (back of the arm)",
    howTo:
      "Sit up straight. Hold one dumbbell with both hands above your head. Bend your elbows to lower it behind your head. Push it back up. Keep elbows close to your head.",
    worksMy: "လက်မောင်းနောက်ကြွက်သား (Triceps)",
    howToMy:
      "မတ်မတ်ထိုင်ပါ။ ဒမ်ဘဲလ်တစ်လုံးကို လက်နှစ်ဖက်နဲ့ ခေါင်းအပေါ်ကိုင်ပါ။ တံတောင်ကွေးပြီး ခေါင်းနောက်ဘက်သို့ချပါ။ ပြန်တွန်းတင်ပါ။ တံတောင်ကို ခေါင်းနားကပ်ထားပါ။",
  },
  "Dumbbells Tricep Kickback": {
    works: "Triceps",
    howTo:
      "Bend forward with a flat back. Keep your upper arm along your body. Straighten your arm behind you, then bend it back. Only the lower arm moves.",
    worksMy: "လက်မောင်းနောက်ကြွက်သား (Triceps)",
    howToMy:
      "ကျောဖြောင့်ဖြောင့်နဲ့ ရှေ့ကိုကုန်းပါ။ လက်မောင်းအပေါ်ပိုင်းကို ကိုယ်နဲ့ကပ်ထားပါ။ လက်ကို နောက်ဘက်သို့ဖြောင့်ပြီး ပြန်ကွေးပါ။ လက်အောက်ပိုင်းပဲ လှုပ်ပါစေ။",
  },
  "Dumbbells Row": {
    works: "Upper back, lats, biceps",
    howTo:
      "Bend forward with a flat back, knees a little bent. Pull the dumbbells up to your waist. Squeeze your back at the top. Lower slowly.",
    worksMy: "ကျောအပေါ်ပိုင်း၊ ကျောဘေးကြွက်သား၊ လက်မောင်း",
    howToMy:
      "ကျောဖြောင့်ထားပြီး ရှေ့ကိုကုန်းပါ၊ ဒူးအနည်းငယ်ကွေးပါ။ ဒမ်ဘဲလ်ကို ခါးဆီသို့ဆွဲတင်ပါ။ အပေါ်ရောက်ချိန် ကျောကြွက်သားညှစ်ပါ။ ဖြည်းဖြည်းပြန်ချပါ။",
  },
  "Dumbbells Back Fly": {
    works: "Rear shoulders, upper back",
    howTo:
      "Bend forward with a flat back. Let your arms hang down. Raise the dumbbells out to the sides like wings. Lower slowly.",
    worksMy: "ပခုံးနောက်ပိုင်း၊ ကျောအပေါ်ပိုင်း",
    howToMy:
      "ကျောဖြောင့်နဲ့ ရှေ့ကုန်းပါ။ လက်ကို တွဲလောင်းချထားပါ။ ဒမ်ဘဲလ်ကို အတောင်ပံလို ဘေးသို့မြှောက်ပါ။ ဖြည်းဖြည်းပြန်ချပါ။",
  },
  "Dumbbells Single Arm Row": {
    works: "Lats, upper back",
    howTo:
      "Put one hand on a chair or your knee. Pull the dumbbell up to your hip with the other arm. Keep your back flat. Do all reps, then switch sides.",
    worksMy: "ကျောဘေးကြွက်သား၊ ကျောအပေါ်ပိုင်း",
    howToMy:
      "လက်တစ်ဖက်ကို ကုလားထိုင် သို့မဟုတ် ဒူးပေါ်ထောက်ပါ။ ကျန်လက်နဲ့ ဒမ်ဘဲလ်ကို ခါးဆီဆွဲတင်ပါ။ ကျောဖြောင့်ထားပါ။ တစ်ဖက်ပြီးမှ တစ်ဖက်ပြောင်းပါ။",
  },
  "Dumbbells Drag Curl": {
    works: "Biceps",
    howTo:
      "Stand tall. Curl the dumbbells up while keeping them close to your body. Your elbows move back, not forward. Lower slowly.",
    worksMy: "လက်မောင်းကြွက်သား (Biceps)",
    howToMy:
      "မတ်မတ်ရပ်ပါ။ ဒမ်ဘဲလ်ကို ကိုယ်နဲ့ကပ်ပြီး အပေါ်ဆွဲတင်ပါ။ တံတောင်က နောက်ဘက်သို့ရွေ့ပါစေ၊ ရှေ့မထွက်ပါစေနဲ့။ ဖြည်းဖြည်းပြန်ချပါ။",
  },
  "Concentration Curl": {
    works: "Biceps",
    howTo:
      "Sit down. Rest your elbow on the inside of your thigh. Curl the dumbbell up slowly, squeeze, and lower slowly. One arm at a time.",
    worksMy: "လက်မောင်းကြွက်သား (Biceps)",
    howToMy:
      "ထိုင်ပါ။ တံတောင်ကို ပေါင်အတွင်းဘက်မှာထောက်ပါ။ ဒမ်ဘဲလ်ကို ဖြည်းဖြည်းကွေးတင်ပြီး ညှစ်ပါ၊ ဖြည်းဖြည်းပြန်ချပါ။ တစ်ဖက်ချင်းလုပ်ပါ။",
  },
  "Dumbbells Hammer Curl": {
    works: "Biceps, forearms",
    howTo:
      "Stand tall. Palms face each other, like holding a hammer. Curl the dumbbells up, then lower slowly. Keep elbows at your sides.",
    worksMy: "လက်မောင်းကြွက်သား၊ လက်ဖျံ",
    howToMy:
      "မတ်မတ်ရပ်ပါ။ လက်ဖဝါးနှစ်ဖက် မျက်နှာချင်းဆိုင်ထားပါ (တူကိုင်သလို)။ ဒမ်ဘဲလ်ကို ကွေးတင်ပြီး ဖြည်းဖြည်းပြန်ချပါ။ တံတောင်ကို ဘေးမှာကပ်ထားပါ။",
  },
  "Dumbbells Shoulder Press": {
    works: "Shoulders, triceps",
    howTo:
      "Hold the dumbbells at shoulder height. Press them straight up over your head. Lower slowly back to your shoulders.",
    worksMy: "ပခုံး၊ လက်မောင်းနောက်ကြွက်သား",
    howToMy:
      "ဒမ်ဘဲလ်ကို ပခုံးအမြင့်မှာကိုင်ပါ။ ခေါင်းအပေါ် တည့်တည့်တွန်းတင်ပါ။ ပခုံးဆီ ဖြည်းဖြည်းပြန်ချပါ။",
  },
  "Dumbbells Front Raises": {
    works: "Front shoulders",
    howTo:
      "Stand tall, arms down. Raise the dumbbells straight in front of you to shoulder height. Lower slowly. Do not swing.",
    worksMy: "ပခုံးအရှေ့ပိုင်း",
    howToMy:
      "မတ်မတ်ရပ်ပြီး လက်ချထားပါ။ ဒမ်ဘဲလ်ကို ရှေ့တည့်တည့် ပခုံးအမြင့်အထိမြှောက်ပါ။ ဖြည်းဖြည်းပြန်ချပါ။ ကိုယ်နဲ့ ဆောင့်မတင်ပါနဲ့။",
  },
  "Dumbbells Lateral Raises": {
    works: "Side shoulders",
    howTo:
      "Stand tall, arms at your sides. Raise the dumbbells out to the sides to shoulder height. Lower slowly. Small bend in the elbows.",
    worksMy: "ပခုံးဘေးပိုင်း",
    howToMy:
      "မတ်မတ်ရပ်ပါ၊ လက်ကို ဘေးမှာချထားပါ။ ဒမ်ဘဲလ်ကို ဘေးဘက်သို့ ပခုံးအမြင့်အထိမြှောက်ပါ။ ဖြည်းဖြည်းပြန်ချပါ။ တံတောင်အနည်းငယ်ကွေးထားပါ။",
  },
  Crunches: {
    works: "Abs",
    howTo:
      "Lie on your back, knees bent. Lift your shoulders off the floor and squeeze your abs. Lower slowly. Do not pull your neck.",
    worksMy: "ဗိုက်ကြွက်သား",
    howToMy:
      "ပက်လက်လှဲပြီး ဒူးကွေးပါ။ ပခုံးကို ကြမ်းပြင်မှခွာပြီး ဗိုက်ကြွက်သားညှစ်ပါ။ ဖြည်းဖြည်းပြန်ချပါ။ လည်ပင်းကို လက်နဲ့မဆွဲပါနဲ့။",
  },
  "Russian Twist": {
    works: "Side abs (obliques)",
    howTo:
      "Sit on the floor, lean back a little, knees bent. Twist your upper body to the left, then to the right. Keep your chest up.",
    worksMy: "ဗိုက်ဘေးကြွက်သား",
    howToMy:
      "ကြမ်းပြင်ပေါ်ထိုင်ပြီး နောက်သို့အနည်းငယ်မှီပါ၊ ဒူးကွေးထားပါ။ ကိုယ်အပေါ်ပိုင်းကို ဘယ်ညာလှည့်ပါ။ ရင်ကော့ထားပါ။",
  },
  "Leg Raise": {
    works: "Lower abs",
    howTo:
      "Lie flat on your back, legs straight. Raise your legs up slowly, then lower them without touching the floor. Keep your lower back on the floor.",
    worksMy: "ဗိုက်အောက်ပိုင်းကြွက်သား",
    howToMy:
      "ပက်လက်ဖြောင့်လှဲပါ၊ ခြေထောက်ဖြောင့်ထားပါ။ ခြေထောက်ကို ဖြည်းဖြည်းမြှောက်ပြီး ကြမ်းပြင်မထိအောင် ပြန်ချပါ။ ခါးကို ကြမ်းပြင်နဲ့ကပ်ထားပါ။",
  },
  Squat: {
    works: "Quads (front legs), glutes",
    howTo:
      "Feet shoulder-width apart. Push your hips back and bend your knees like sitting on a chair. Chest up. Stand back up.",
    worksMy: "ပေါင်အရှေ့ကြွက်သား၊ တင်ပါး",
    howToMy:
      "ခြေထောက်ကို ပခုံးအကျယ်ဖြန့်ပါ။ ကုလားထိုင်ထိုင်သလို တင်ပါးကို နောက်ဆုတ်ပြီး ဒူးကွေးပါ။ ရင်ကော့ထားပါ။ ပြန်မတ်တပ်ရပ်ပါ။",
  },
  "Dumbbells Sumo Squat": {
    works: "Inner thighs, glutes",
    howTo:
      "Wide stance, toes pointing out. Hold one dumbbell with both hands in front of you. Squat down slowly, then stand up.",
    worksMy: "ပေါင်အတွင်းပိုင်း၊ တင်ပါး",
    howToMy:
      "ခြေကျယ်ကျယ်ဖြန့်ပြီး ခြေဖျားကို အပြင်ဘက်လှည့်ပါ။ ဒမ်ဘဲလ်တစ်လုံးကို ရှေ့မှာကိုင်ပါ။ ဖြည်းဖြည်းထိုင်ချပြီး ပြန်ထပါ။",
  },
  "Dumbbells RDL": {
    works: "Hamstrings (back legs), glutes, lower back",
    howTo:
      "Stand tall, small bend in the knees. Push your hips back and lower the dumbbells along your legs. Keep your back flat. Squeeze your glutes to stand up.",
    worksMy: "ပေါင်နောက်ကြွက်သား၊ တင်ပါး၊ ခါးအောက်ပိုင်း",
    howToMy:
      "မတ်မတ်ရပ်ပါ၊ ဒူးအနည်းငယ်ကွေးပါ။ တင်ပါးကို နောက်တွန်းပြီး ဒမ်ဘဲလ်ကို ခြေထောက်တစ်လျှောက်ချပါ။ ကျောဖြောင့်ထားပါ။ တင်ပါးညှစ်ပြီး ပြန်ထပါ။",
  },
  "Prisoner Squat": {
    works: "Legs, core",
    howTo:
      "Put your hands behind your head. Squat down slowly, chest up, elbows wide. Stand back up. No weights.",
    worksMy: "ခြေထောက်၊ ကိုယ်လုံးအလယ်ပိုင်း (core)",
    howToMy:
      "လက်နှစ်ဖက်ကို ခေါင်းနောက်မှာထားပါ။ ရင်ကော့ပြီး ဖြည်းဖြည်းထိုင်ချပါ။ ပြန်ထပါ။ အလေးမလိုပါ။",
  },
  Lunges: {
    works: "Quads, glutes, balance",
    howTo:
      "Step forward with one leg. Lower your back knee close to the floor. Push back up to standing. Switch legs.",
    worksMy: "ပေါင်၊ တင်ပါး၊ ဟန်ချက်",
    howToMy:
      "ခြေတစ်ဖက်ကို ရှေ့သို့လှမ်းပါ။ နောက်ဒူးကို ကြမ်းပြင်နားထိအောင်ချပါ။ ပြန်တွန်းထပြီး ခြေပြောင်းပါ။",
  },
  "Glute Bridge": {
    works: "Glutes, hamstrings",
    howTo:
      "Lie on your back, knees bent, feet flat. Lift your hips up and squeeze your glutes at the top. Lower slowly.",
    worksMy: "တင်ပါး၊ ပေါင်နောက်ကြွက်သား",
    howToMy:
      "ပက်လက်လှဲပါ၊ ဒူးကွေးပြီး ခြေဖဝါးကို ကြမ်းပြင်ပေါ်ထားပါ။ တင်ပါးကို အပေါ်မြှောက်ပြီး အမြင့်ဆုံးမှာညှစ်ပါ။ ဖြည်းဖြည်းပြန်ချပါ။",
  },
  "Push Up": {
    works: "Chest, shoulders, triceps",
    howTo:
      "Hands on the floor under your shoulders, body straight. Lower your chest to the floor, then push up. Keep your core tight.",
    worksMy: "ရင်အုပ်၊ ပခုံး၊ လက်မောင်းနောက်ကြွက်သား",
    howToMy:
      "လက်ကို ပခုံးအောက်တည့်တည့်ထောက်ပါ၊ ကိုယ်ဖြောင့်ထားပါ။ ရင်အုပ်ကို ကြမ်းပြင်နားချပြီး ပြန်တွန်းတက်ပါ။ ဗိုက်တင်းထားပါ။",
  },
  "Dumbbells Rear Delt Fly": {
    works: "Rear shoulders",
    howTo:
      "Bend forward with a flat back. Raise the dumbbells out to the sides with a small elbow bend. Squeeze your rear shoulders. Lower slowly.",
    worksMy: "ပခုံးနောက်ပိုင်း",
    howToMy:
      "ကျောဖြောင့်နဲ့ ရှေ့ကုန်းပါ။ တံတောင်အနည်းငယ်ကွေးပြီး ဒမ်ဘဲလ်ကို ဘေးသို့မြှောက်ပါ။ ပခုံးနောက်ကြွက်သားညှစ်ပါ။ ဖြည်းဖြည်းပြန်ချပါ။",
  },
};

export function getExerciseInfo(name: string): ExerciseInfo | undefined {
  return INFO[name];
}
