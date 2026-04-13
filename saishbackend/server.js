import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running", timestamp: new Date().toISOString() });
});

app.get("/api/influencers", async (req, res) => {
  const { query = "fitness" } = req.query;

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=12&key=${process.env.YOUTUBE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("YouTube API error:", data);
      return res.status(500).json({ error: "YouTube API failed", details: data });
    }

    const influencers = data.items.map((item, index) => ({
      id: index + 1,
      name: item.snippet.title,
      handle: "@" + item.snippet.channelTitle.replace(/\s+/g, "").toLowerCase(),
      category: query,
      rating: (4 + Math.random()).toFixed(1),
      minBudget: Math.floor(Math.random() * 2000) + 1000,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));

    res.json(influencers);
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: "Failed to fetch influencers", message: err.message });
  }
});

app.post("/ai-text", async (req, res) => {
  try {
    const {
      brandName,
      description,
      productOrService,
      targetAudience,
      goal,
      platforms,
      budgetRange,
      tone,
      uniqueValue,
      callToAction,
    } = req.body;

    if (!brandName || !productOrService || !goal) {
      return res.status(400).json({
        success: false,
        message: "brandName, productOrService, and goal are required",
      });
    }

    const prompt = `
You are a senior brand strategist.

Your task is to analyze the brand information and produce a COMPLETE marketing strategy.
Use abstract reasoning.
Do NOT generate ad copy.
Return ONLY valid JSON.
ALL analytics values must be NUMERIC ONLY (no %, no text).

Brand Brief:
Brand Name: ${brandName}
Description: ${description}
Product / Service: ${productOrService}
Target Audience: ${targetAudience}
Goal: ${goal}
Platforms: ${platforms?.join(", ")}
Budget Range: ${budgetRange}
Tone: ${tone}
Unique Value: ${uniqueValue}
Call To Action: ${callToAction}

Return JSON with EXACT structure:
{
  "campaignTheme": "",
  "campaignObjective": "",
  "coreMessage": "",
  "targetAudienceProfile": {
    "ageRange": "",
    "interests": [],
    "psychographics": []
  },
  "brandPositioning": {
    "marketPosition": "",
    "emotionalAppeal": "",
    "differentiation": ""
  },
  "recommendedPlatforms": [
    { "platform": "", "role": "" }
  ],
  "contentStyle": {
    "tone": "",
    "formats": []
  },
  "keyConstraints": [],
  "timeline": {
    "monday": [],
    "tuesday": [],
    "wednesday": [],
    "thursday": [],
    "friday": [],
    "saturday": [],
    "sunday": []
  },
  "analytics": {
    "platformDistribution": {},
    "contentTypeSplit": {},
    "funnelFocus": {},
    "expectedKPIs": {
      "engagementRate": 0,
      "mauGrowth": 0,
      "clickThroughRate": 0,
      "retentionRate": 0,
      "costPerAcquisition": 0
    }
  }
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const aiText = response.text || "{}";
    let strategy;
    try {
      strategy = JSON.parse(aiText);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI response",
        rawResponse: aiText,
      });
    }

    res.json({
      success: true,
      message: "Campaign strategy generated successfully",
      data: strategy,
    });
  } catch (error) {
    console.error("Gemini AI Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while generating campaign strategy",
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/health`);
  console.log(`🤖 AI Endpoint: http://localhost:${PORT}/ai-text`);
});