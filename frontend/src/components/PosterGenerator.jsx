import { useEffect, useState } from "react";
import { Image, Download, Loader2, AlertCircle } from "lucide-react";

export default function PosterGenerator({ selectedIdea }) {
  const [prompt, setPrompt] = useState(
    `subtle marketing poster for apple brand campaign,
bold energetic style, neon green and black,
sharp cinematic lighting, high contrast,
professional graphic design, instagram ad poster`
  );
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aspectRatio, setAspectRatio] = useState("4:5"); // Instagram feed poster

  useEffect(() => {
    if (!selectedIdea) return;
    setPrompt(
      `Marketing poster for ${selectedIdea.brandName} promoting ${selectedIdea.productService}. Tone: ${selectedIdea.tone}. Audience: ${selectedIdea.targetAudience}. Goal: ${selectedIdea.goal}. Clean modern ad design, high contrast, social media ready.`
    );
  }, [selectedIdea]);

  const base64ToObjectUrl = (base64, mimeType = "image/png") => {
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: mimeType });
      return URL.createObjectURL(blob);
    } catch (e) {
      console.error("base64 decode error:", e);
      return null;
    }
  };

  const generatePoster = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);
    images.forEach((img) => img?.objectUrl && URL.revokeObjectURL(img.objectUrl));
    setImages([]);

    try {
      const backendUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${backendUrl}/api/generate-posters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          count: 3,
          aspectRatio,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await res.json();
      const generated = (data.images || []).map((img, idx) => ({
        idx,
        mimeType: img.mimeType || "image/png",
        objectUrl: base64ToObjectUrl(img.imageBytes, img.mimeType || "image/png"),
      }));

      if (!generated.length) throw new Error("No images generated");
      setImages(generated);
    } catch (err) {
      setError(err.message || "Server error (check backend on port 4001)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center">
            <Image className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Image Generator</h2>
            <p className="text-sm text-gray-400">Create marketing posters and social media graphics</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Prompt Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            disabled={loading}
            className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent text-gray-200 placeholder-gray-500"
          />
        </div>

        {/* Aspect Ratio */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Poster size</label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            disabled={loading}
            className="w-full p-2 rounded-xl bg-gray-900/50 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="4:5">Instagram Feed Poster (4:5)</option>
            <option value="1:1">Square (1:1)</option>
            <option value="9:16">Story/Reel (9:16)</option>
          </select>
          <p className="mt-2 text-xs text-gray-500">
            Tip: For Instagram feed ads, 4:5 is the most “poster-like” format.
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePoster}
          disabled={loading}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Image className="w-4 h-4" />}
          {loading ? "Generating..." : "Generate 3 Posters"}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-800/30 rounded-xl flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-6 text-center py-8 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-2"></div>
            <p className="text-sm text-gray-400">Generating your image...</p>
          </div>
        )}

        {/* Image Results */}
        {images.length > 0 && !loading && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {images.map((img) => (
                <div key={img.idx} className="space-y-3">
                  <img
                    src={img.objectUrl}
                    alt={`Generated poster ${img.idx + 1}`}
                    className="w-full rounded-xl border border-gray-700 shadow-lg"
                  />
                  <a
                    href={img.objectUrl}
                    download={`poster-${img.idx + 1}.png`}
                    className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download #{img.idx + 1}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {images.length === 0 && !loading && !error && (
          <div className="mt-6 text-center py-8 bg-gray-900/30 rounded-xl border border-gray-800">
            <Image className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Enter a prompt and click generate to create your image.</p>
          </div>
        )}
      </div>
    </div>
  );
}