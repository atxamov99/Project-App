const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

const API_KEY = "AIzaSyCg9lzk_EMNcOADaL_opWdYvBoU8ejsdks";
const MODELS = ["gemini-3.1-flash-lite", "gemini-flash-lite-latest", "gemini-2.5-flash-lite"];
const BATCH_SIZE = 300;
const REQUEST_DELAY_MS = 4500;
const MAX_RETRIES = 6;
const RETRY_DELAY_MS = 30000;

const genAI = new GoogleGenerativeAI(API_KEY);
const models = MODELS.map((m) => ({ name: m, instance: genAI.getGenerativeModel({ model: m }) }));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function buildPrompt(words, targetLang) {
  return `Translate each of the following English words to ${targetLang}.
Rules:
- Return ONLY a JSON array of strings, same length and same order as input.
- No explanations, no markdown, no code fences.
- For each English word output a single most-common ${targetLang} translation (one word or short phrase).
- If a word has no good translation, transliterate it.

Input (${words.length} words):
${JSON.stringify(words)}`;
}

function parseResponse(text, expectedLen) {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  let arr;
  try {
    arr = JSON.parse(cleaned);
  } catch {
    const m = cleaned.match(/\[[\s\S]*\]/);
    if (!m) throw new Error("No JSON array in response");
    arr = JSON.parse(m[0]);
  }
  if (!Array.isArray(arr)) throw new Error("Response is not an array");
  if (arr.length < expectedLen) {
    while (arr.length < expectedLen) arr.push("");
  } else if (arr.length > expectedLen) {
    arr.length = expectedLen;
  }
  return arr.map((x) => (typeof x === "string" ? x : String(x ?? "")));
}

async function translateBatch(words, targetLang) {
  const prompt = buildPrompt(words, targetLang);
  let lastErr;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    for (const m of models) {
      try {
        const result = await m.instance.generateContent(prompt);
        const text = result.response.text();
        const out = parseResponse(text, words.length);
        if (attempt > 1 || m !== models[0]) console.log(`    ok via ${m.name} on attempt ${attempt}`);
        return out;
      } catch (e) {
        lastErr = e;
        const msg = String(e?.message || e);
        const isQuota = msg.includes("429") || msg.toLowerCase().includes("quota");
        const is503 = msg.includes("503") || msg.toLowerCase().includes("unavailable") || msg.toLowerCase().includes("high demand");
        if (isQuota || is503) {
          console.log(`    [${m.name}] ${isQuota ? "quota" : "503"}, trying next model...`);
          continue;
        }
        console.log(`    [${m.name}] error: ${msg.slice(0, 200)}`);
      }
    }
    const wait = RETRY_DELAY_MS * attempt;
    console.log(`  all models failed, retry ${attempt}/${MAX_RETRIES} after ${wait}ms`);
    await sleep(wait);
  }
  throw lastErr;
}

async function translateAll(words, targetLang, outputPath, partialPath) {
  let translated = [];
  let startIdx = 0;
  if (fs.existsSync(partialPath)) {
    try {
      translated = JSON.parse(fs.readFileSync(partialPath, "utf8"));
      startIdx = translated.length;
      console.log(`[${targetLang}] resuming from index ${startIdx}/${words.length}`);
    } catch {
      translated = [];
    }
  }

  const total = words.length;
  const startTime = Date.now();

  for (let i = startIdx; i < total; i += BATCH_SIZE) {
    const batch = words.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(total / BATCH_SIZE);

    try {
      const out = await translateBatch(batch, targetLang);
      translated.push(...out);
    } catch (e) {
      console.error(`[${targetLang}] batch ${batchNum} FAILED after retries:`, e.message);
      translated.push(...Array(batch.length).fill(""));
    }

    fs.writeFileSync(partialPath, JSON.stringify(translated));

    const done = translated.length;
    const elapsed = (Date.now() - startTime) / 1000;
    const rate = (done - startIdx) / elapsed;
    const eta = rate > 0 ? Math.round((total - done) / rate) : 0;
    console.log(`[${targetLang}] batch ${batchNum}/${totalBatches} — ${done}/${total} (${(done / total * 100).toFixed(1)}%) — ETA ${Math.floor(eta / 60)}m${eta % 60}s`);

    if (i + BATCH_SIZE < total) await sleep(REQUEST_DELAY_MS);
  }

  fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2));
  if (fs.existsSync(partialPath)) fs.unlinkSync(partialPath);
  console.log(`[${targetLang}] DONE — saved to ${outputPath}`);
}

async function main() {
  const enPath = "./translater/en.json";
  const ruPath = "./translater/ru.json";
  const uzPath = "./translater/uz.json";
  const ruPartial = "./translater/ru.partial.json";
  const uzPartial = "./translater/uz.partial.json";

  const englishWords = JSON.parse(fs.readFileSync(enPath, "utf8"));
  console.log(`Loaded ${englishWords.length} English words`);
  console.log(`Models (with fallback): ${MODELS.join(" -> ")}`);
  console.log(`Batch: ${BATCH_SIZE}, delay: ${REQUEST_DELAY_MS}ms`);
  console.log("");

  const target = process.argv[2] || "both";

  if (target === "ru" || target === "both") {
    console.log("=== Translating to Russian ===");
    await translateAll(englishWords, "Russian", ruPath, ruPartial);
    console.log("");
  }

  if (target === "uz" || target === "both") {
    console.log("=== Translating to Uzbek ===");
    await translateAll(englishWords, "Uzbek", uzPath, uzPartial);
    console.log("");
  }

  console.log("All done.");
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
