import { useState } from "react";
import { Image, Download, Loader2, AlertCircle } from "lucide-react";

export default function PosterGenerator() {
  const [prompt, setPrompt] = useState(
    `subtle marketing poster for apple brand campaign,
bold energetic style, neon green and black,
sharp cinematic lighting, high contrast,
professional graphic design, instagram ad poster`
  );
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [width, setWidth] = useState(768);
  const [height, setHeight] = useState(1024);

  const generatePoster = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const url = `${backendUrl}/api/generate-image?prompt=${encodeURIComponent(
        prompt
      )}&width=${width}&height=${height}`;

      const res = await fetch(url);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(errorData.error || "Failed to generate image");
      }

      const blob = await res.blob();
      setImageUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message || "Server error on port 4000");
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

        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Width</label>
            <input
              type="number"
              value={width}
              min={256}
              max={2048}
              step={64}
              onChange={(e) => setWidth(parseInt(e.target.value) || 768)}
              disabled={loading}
              className="w-full p-2 rounded-xl bg-gray-900/50 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Height</label>
            <input
              type="number"
              value={height}
              min={256}
              max={2048}
              step={64}
              onChange={(e) => setHeight(parseInt(e.target.value) || 1024)}
              disabled={loading}
              className="w-full p-2 rounded-xl bg-gray-900/50 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePoster}
          disabled={loading}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Image className="w-4 h-4" />}
          {loading ? "Generating..." : "Generate Image"}
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

        {/* Image Result */}
        {imageUrl && !loading && (
          <div className="mt-6 space-y-4">
            <img src={imageUrl} alt="Generated poster" className="w-full rounded-xl border border-gray-700 shadow-lg" />
            <a
              href={imageUrl}
              download="poster.png"
              className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Image
            </a>
          </div>
        )}

        {/* Empty State */}
        {!imageUrl && !loading && !error && (
          <div className="mt-6 text-center py-8 bg-gray-900/30 rounded-xl border border-gray-800">
            <Image className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Enter a prompt and click generate to create your image.</p>
          </div>
        )}
      </div>
    </div>
  );
}