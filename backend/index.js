import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(cors());

/* ------------------ RETRY FUNCTION ------------------ */
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      const contentType = res.headers.get("content-type");

      // ✅ Accept only valid image responses
      if (res.ok && contentType && contentType.includes("image")) {
        return res;
      }

      const text = await res.text();
      console.log(`Retry ${i + 1} failed:`, text.slice(0, 100));

    } catch (err) {
      console.log(`Retry ${i + 1} error:`, err.message);
    }

    // wait before retry
    await new Promise(r => setTimeout(r, 1000));
  }

  throw new Error("Image API failed after retries");
}

/* ------------------ ROUTE ------------------ */
app.get("/api/generate-image", async (req, res) => {
  const { prompt, width = 768, height = 1024 } = req.query;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt required" });
  }

  try {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}`;

    const response = await fetchWithRetry(url);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Send image properly
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Length", buffer.length);
    res.setHeader("Cache-Control", "no-cache");

    res.send(buffer);

  } catch (err) {
    console.error("Final Error:", err.message);

    // ✅ Fallback (IMPORTANT)
    return res.status(500).json({
      error: "Image generation failed",
      message: "Pollinations API unstable",
      fallback: `https://via.placeholder.com/512?text=${encodeURIComponent("Try Again")}`
    });
  }
});

/* ------------------ SERVER ------------------ */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});