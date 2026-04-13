import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const YT_KEY = process.env.YOUTUBE_API_KEY;
const ai = new GoogleGenAI({});

// Helper functions
function extractInstagram(description = "") {
  const urlMatch = description.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
  const atMatch = description.match(/@([a-zA-Z0-9._]{3,})/);
  return urlMatch?.[1] || atMatch?.[1] || null;
}

function extractEmail(description = "") {
  const emailMatch = description.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return emailMatch ? emailMatch[0] : "Not public";
}

// POST /api/influencers – supports minFollowers, maxFollowers, pageToken
app.post("/api/influencers", async (req, res) => {
  const { niche, minFollowers, maxFollowers, pageToken, maxResults = 25 } = req.body;

  if (!niche) {
    return res.status(400).json({ error: "Niche is required" });
  }

  try {
    // 1. Search YouTube channels
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=${maxResults}&q=${encodeURIComponent(niche)}&key=${YT_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.items || searchData.items.length === 0) {
      return res.json({ influencers: [], nextPageToken: null });
    }

    const channelIds = searchData.items.map(item => item.snippet.channelId).join(",");
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds}&key=${YT_KEY}`;
    const channelRes = await fetch(channelUrl);
    const channelData = await channelRes.json();

    let influencers = channelData.items.map(c => {
      const desc = c.snippet.description || "";
      const followers = parseInt(c.statistics.subscriberCount, 10) || 0;

      return {
        id: c.id,
        name: c.snippet.title,
        handle: c.snippet.customUrl || c.snippet.title.replace(/\s/g, '').toLowerCase(),
        thumbnail: c.snippet.thumbnails.default?.url || c.snippet.thumbnails.medium?.url || '',
        category: niche,
        followers: followers,
        minBudget: Math.floor(followers * 0.02), // estimated budget
        rating: (Math.random() * 2 + 3).toFixed(1), // dummy rating
        email: extractEmail(desc),
        instagram: extractInstagram(desc) ? `https://instagram.com/${extractInstagram(desc)}` : "Not found",
        youtube: `https://youtube.com/channel/${c.id}`,
        description: desc.slice(0, 160),
      };
    });

    // 2. Apply follower range filter
    if (minFollowers !== undefined || maxFollowers !== undefined) {
      const min = minFollowers ? parseInt(minFollowers, 10) : null;
      const max = maxFollowers ? parseInt(maxFollowers, 10) : null;
      influencers = influencers.filter(inf => {
        if (min !== null && inf.followers < min) return false;
        if (max !== null && inf.followers > max) return false;
        return true;
      });
    }

    // 3. Return with nextPageToken for pagination
    res.json({
      influencers,
      nextPageToken: searchData.nextPageToken || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch influencers" });
  }
});

// POST /api/outreach-email – unchanged
app.post("/api/outreach-email", async (req, res) => {
  const { influencer, product, brand } = req.body;
  if (!influencer || !product || !brand) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const prompt = `
Write a short, personalized influencer outreach email.

Brand: ${brand}
Product: ${product}
Influencer name: ${influencer.name}
Platform: YouTube / Instagram

Tone:
- Friendly
- Professional
- Non-salesy
- Collaborative

End with a soft call to action.
`;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp", // use a valid model name
      contents: prompt,
    });
    res.json({ email: response.text });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Failed to generate outreach email" });
  }
});

app.listen(4003, () => {
  console.log("🚀 Influencer backend running on port 4003");
});