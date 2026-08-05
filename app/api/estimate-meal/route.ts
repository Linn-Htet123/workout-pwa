import Anthropic from "@anthropic-ai/sdk";

// This runs on the SERVER (Vercel serverless function), never in the browser.
// The API key lives only here, in an environment variable — it is never sent
// to the phone, so it can't be stolen from the public app.
export const runtime = "nodejs";
export const maxDuration = 30; // allow up to 30s for the AI to look at the photos

interface InImage {
  media_type: string;
  data: string; // base64, no data: prefix
}

const MODEL = "claude-sonnet-5";

const SYSTEM = `You are a careful nutrition estimator for a personal fitness app.
The user sends 1–3 photos of ONE meal (often the same meal from different angles) and an optional note.
Estimate the total calories of the whole meal shown.

Identifying the food (important — get the names right):
- Look carefully and name each item using the simple, common name people actually use (e.g. "mushrooms", "fried rice", "grilled chicken").
- If you are not fully sure exactly what a dish is, DO NOT guess a specific named dish. Instead describe what you can clearly see, e.g. "stir-fried mushrooms with vegetables" — a plain description is better than a wrong specific name.
- If the user's note names the food, trust the note for identification.
- Never invent a fancy or specific dish name you are not confident about.

Estimating calories:
- Treat all photos as the SAME single meal, not separate meals. Use the extra angles only to judge portion size better.
- Assume realistic restaurant/street-food portions (the user often eats out in Thailand).
- Give a single best total, plus a low–high range that reflects your uncertainty.
- Break the meal into the main items you can see, each with its own calorie estimate.
- Be honest with the confidence level: "low" if the photos are unclear or the food is hard to identify.

Respond with ONLY a single minified JSON object, no markdown, no code fences, no extra text. Shape:
{"dish":string,"totalCalories":integer,"lowRange":integer,"highRange":integer,"items":[{"name":string,"calories":integer}],"confidence":"low"|"medium"|"high","notes":string}
- "dish" is a short, plain name (or description) for the whole meal.
- "notes" is one short sentence (max ~20 words) of helpful context or a caveat.`;

function langLine(lang: string): string {
  if (lang === "my") {
    return 'Write "dish", every item "name", and "notes" in everyday Burmese (Myanmar). Use the common Burmese word people actually use for each food. If there is no natural common Burmese word for an item, keep that item\'s name in English rather than inventing an awkward literal translation. Keep all numbers as digits.';
  }
  return 'Write "dish", item names, and "notes" in clear, simple English.';
}

// Pull the first {...} JSON object out of the model's text, defensively.
function extractJson(text: string): string | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return text.slice(start, end + 1);
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "no_key" }, { status: 503 });
  }

  let body: { images?: InImage[]; remark?: string; lang?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const images = (body.images ?? []).filter(
    (i) => i && typeof i.data === "string" && typeof i.media_type === "string"
  );
  const remark = (body.remark ?? "").toString().slice(0, 500);
  const lang = body.lang === "my" ? "my" : "en";

  if (images.length === 0) {
    return Response.json({ error: "no_images" }, { status: 400 });
  }

  const content: Anthropic.ContentBlockParam[] = [];
  for (const img of images.slice(0, 4)) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: img.media_type as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
        data: img.data,
      },
    });
  }
  content.push({
    type: "text",
    text: `${langLine(lang)}${remark ? `\n\nUser note about the meal: "${remark}"` : ""}`,
  });

  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the env

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: "user", content }],
      // Medium effort: the model looks more carefully so it names the food
      // right, while staying reasonably fast and cheap.
      output_config: { effort: "medium" },
    } as Anthropic.MessageCreateParamsNonStreaming);

    const textBlock = response.content.find((b) => b.type === "text");
    const raw = textBlock && textBlock.type === "text" ? textBlock.text : "";
    const jsonStr = extractJson(raw);
    if (!jsonStr) {
      return Response.json({ error: "parse" }, { status: 502 });
    }
    const parsed = JSON.parse(jsonStr);
    return Response.json({ result: parsed });
  } catch (err: unknown) {
    const status =
      err instanceof Anthropic.APIError && typeof err.status === "number"
        ? err.status
        : 500;
    return Response.json({ error: "ai_error" }, { status });
  }
}
