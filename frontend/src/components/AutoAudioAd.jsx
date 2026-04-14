import { useEffect, useRef, useState } from "react";
import { 
  Music, Volume2, Download, Play, Pause, Sparkles,
  Building2, Package, Loader2, Headphones,
  Share2, Copy, CheckCircle, Radio, AlertCircle
} from "lucide-react";

export default function AutoAudioAd({ selectedIdea }) {
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [copied, setCopied] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [error, setError] = useState(null);
  
  const audioRef = useRef(null);

  useEffect(() => {
    if (!selectedIdea) return;
    setCompany(selectedIdea.brandName || "");
    setProduct(selectedIdea.productService || "");
  }, [selectedIdea]);

  const generateAd = async () => {
    if (!company || !product) {
      setError("Please enter both company and product name");
      return;
    }

    setLoading(true);
    setError(null);
    setAudioUrl(null);
    setHasGenerated(true);
    setIsPlaying(false);
    setCurrentTime(0);
    setDurationSeconds(0);
    setAudioDuration("0:00");

    try {
      const res = await fetch("http://localhost:4001/api/audio/auto-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, product }),
      });

      if (!res.ok) throw new Error("Failed to generate audio ad");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (e) {
      setError(e.message || "Generation failed — check backend & API keys");
    }

    setLoading(false);
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `${company}_${product}_Ad.mp3`;
    a.click();
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const safeSeconds = Number.isFinite(seconds) ? seconds : 0;
    const minutes = Math.floor(safeSeconds / 60);
    const secs = Math.floor(safeSeconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAudioLoaded = (e) => {
    const duration = e.target.duration;
    setDurationSeconds(duration || 0);
    setAudioDuration(formatTime(duration || 0));
  };

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime || 0);
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const nextTime = Number(e.target.value);
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const copyPrompt = () => {
    const prompt = `Generate audio ad for ${company} - ${product}`;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && company && product) {
      generateAd();
    }
  };

  const progressPercent =
    durationSeconds > 0 ? Math.min((currentTime / durationSeconds) * 100, 100) : 0;

  return (
    <div className="w-full bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <Music className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Audio Ad Generator</h2>
            <p className="text-sm text-gray-400">Create professional voiceover ads with background music</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Input Fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Building2 className="w-4 h-4" />
              Company Name
            </label>
            <input
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent placeholder-gray-500"
              placeholder="e.g. Nike, Apple, Starbucks..."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Package className="w-4 h-4" />
              Product / Service
            </label>
            <input
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent placeholder-gray-500"
              placeholder="e.g. Running Shoes, iPhone 15, Coffee..."
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateAd}
          disabled={loading || !company || !product}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? "Generating Audio Ad..." : "Generate Audio Ad"}
        </button>

        {/* Quick Examples */}
        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-2">Try these examples:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setCompany("Nike"); setProduct("Running Shoes"); }}
              className="px-3 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-xs transition-colors text-left"
            >
              <div className="font-medium text-gray-200">Nike Running Shoes</div>
            </button>
            <button
              onClick={() => { setCompany("Starbucks"); setProduct("Holiday Coffee"); }}
              className="px-3 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-xs transition-colors text-left"
            >
              <div className="font-medium text-gray-200">Starbucks Holiday Coffee</div>
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-800/30 rounded-xl flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mt-6 text-center py-8 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-2"></div>
            <p className="text-sm text-gray-400">AI is creating your audio ad...</p>
          </div>
        )}

        {/* Audio Player */}
        {hasGenerated && audioUrl && !loading && (
          <div className="mt-6 space-y-4">
            <div className="bg-gray-900/30 rounded-xl border border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center hover:scale-105 transition"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{company} Ad</span>
                    <span className="text-gray-400 text-xs">
                      {formatTime(currentTime)} / {audioDuration}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-150"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                    <input
                      type="range"
                      min={0}
                      max={durationSeconds || 0}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <audio
                ref={audioRef}
                src={audioUrl}
                onLoadedMetadata={handleAudioLoaded}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadAudio}
                className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download MP3
              </button>
              <button
                onClick={copyPrompt}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm flex items-center gap-2"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy Prompt"}
              </button>
            </div>
          </div>
        )}

        {/* Failed State */}
        {hasGenerated && !audioUrl && !loading && !error && (
          <div className="mt-6 text-center py-8 bg-gray-900/30 rounded-xl border border-gray-800">
            <Radio className="w-10 h-10 text-red-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Generation failed. Please try again.</p>
          </div>
        )}

        {/* Empty State */}
        {!hasGenerated && !loading && !error && (
          <div className="mt-6 text-center py-8 bg-gray-900/30 rounded-xl border border-gray-800">
            <Headphones className="w-10 h-10 text-purple-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Enter your company and product to generate a professional audio ad.</p>
          </div>
        )}
      </div>
    </div>
  );
}