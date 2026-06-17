import { Router } from "express";
import { getGeminiClient } from "../lib/gemini.js";

const router = Router();

function normalizeContent(parsed) {
  return {
    instagram_captions: parsed.instagram_captions || [],
    ad_copy: parsed.ad_copy || [],
    blog_content: parsed.blog_content || { titles: [], intro: "" },
    ctas: parsed.ctas || [],
  };
}

router.post(`${import.meta.env.VITE_API_URL}/api/captions/generate`, async (req, res) => {
  try {
    const { prompt, tone = "professional", serviceType = "general" } = req.body;

    const aiPrompt = `
Generate STRICT JSON ONLY.

You are a senior digital marketer.

Rules:
- Tone: ${tone}
- Service: ${serviceType}
- Do not skip any field
- Do not return empty arrays

Return EXACT JSON format with minimum counts:

{
  "instagram_captions": [
    "caption 1",
    "caption 2",
    "caption 3"
  ],
  "ad_copy": [
    { "headline": "headline 1", "description": "desc 1" },
    { "headline": "headline 2", "description": "desc 2" }
  ],
  "blog_content": {
    "titles": [
      "title 1",
      "title 2"
    ],
    "intro": "minimum 60 words blog intro"
  },
  "ctas": [
    "cta 1",
    "cta 2",
    "cta 3",
    "cta 4"
  ]
}

User Prompt:
${prompt}
`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: aiPrompt,
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);

    res.json({ status: "SUCCESS", data: normalizeContent(parsed) });
  } catch (err) {
    console.error("Caption generation error:", err);
    res.status(500).json({ status: "ERROR" });
  }
});

export default router;
