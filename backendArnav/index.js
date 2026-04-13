import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ENV Keys
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY;

// Validate API keys on startup
if (!GEMINI_KEY) {
  console.warn("⚠️  GEMINI_API_KEY is not set in .env file");
}
if (!ELEVEN_KEY) {
  console.warn("⚠️  ELEVENLABS_API_KEY is not set in .env file");
}

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

// ElevenLabs Voice
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel


// ----------------------------
// MAIN ROUTE
// ----------------------------
app.post("/api/audio/auto-ad", async (req, res) => {
  const { company, product } = req.body;

  // Validate input
  if (!company || !product) {
    return res.status(400).json({ error: "Company & Product are required" });
  }

  // Validate API keys
  if (!GEMINI_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured. Please set it in your .env file." });
  }

  if (!ELEVEN_KEY) {
    return res.status(500).json({ error: "ELEVENLABS_API_KEY is not configured. Please set it in your .env file." });
  }

  try {
    console.log(`\n🎯 Generating ad for: ${company} - ${product}`);

    // ------------------------------------------
    // 1️⃣ GENERATE AD SCRIPT FROM GEMINI AI (20 seconds)
    // ------------------------------------------
    const prompt = `Create a powerful 20-second advertising script (approximately 50-60 words when spoken at normal pace).

Company/Brand: ${company}
Product: ${product}

Requirements:
- Exactly 20 seconds when spoken (50-60 words)
- Tone: energetic, emotional, convincing
- Include: problem identification, solution/benefits, emotional hook, clear call-to-action
- End with a strong brand tagline for ${company}
- Make it engaging and memorable

Write only the script text, no additional commentary.`;

    console.log("🤖 Calling Gemini AI to generate script...");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const script = response.text?.trim() || 
      "Introducing our latest product — experience innovation like never before!";

    console.log("📝 Generated Script (20 seconds):\n", script);
    console.log(`📊 Script length: ${script.split(/\s+/).length} words\n`);


    // ------------------------------------------
    // 2️⃣ CONVERT SCRIPT → AUDIO (ELEVENLABS)
    // ------------------------------------------
    console.log("🎤 Converting script to audio with ElevenLabs...");
    const voiceResp = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVEN_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: script,
          model_id: "eleven_multilingual_v2",
          voice_settings: { 
            stability: 0.6, 
            similarity_boost: 0.8 
          },
        }),
      }
    );

    if (!voiceResp.ok) {
      const errorText = await voiceResp.text();
      console.error("❌ ElevenLabs API error:", voiceResp.status, errorText);
      throw new Error(`ElevenLabs audio generation failed: ${voiceResp.statusText}`);
    }

    const audioBuffer = await voiceResp.arrayBuffer();
    console.log(`✅ Audio generated successfully (${(audioBuffer.byteLength / 1024).toFixed(2)} KB)\n`);

    // Send audio response
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.byteLength,
      "Content-Disposition": `attachment; filename="${company}-${product}-ad.mp3"`,
    });

    res.send(Buffer.from(audioBuffer));

  } catch (err) {
    console.error("❌ ERROR:", err.message || err);
    const errorMessage = err.message || "Pipeline failed";
    res.status(500).json({ 
      error: errorMessage,
      details: err.stack 
    });
  }
});


app.listen(4001, () => console.log("🚀 Smart Ad Server Running @ PORT 4001"));