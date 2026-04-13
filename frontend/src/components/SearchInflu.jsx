import { useState } from "react";
import { 
  Search, Users, Mail, Youtube, Instagram, 
  ExternalLink, Copy, CheckCircle, Sparkles,
  Filter, TrendingUp, MessageSquare, Globe,
  Share2, Heart, Zap, Loader2
} from "lucide-react";

export default function InfluencerFinder() {
  const [niche, setNiche] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // New state for filters & pagination
  const [minFollowers, setMinFollowers] = useState("");
  const [maxFollowers, setMaxFollowers] = useState("");
  const [sortBy, setSortBy] = useState("followers_desc");
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const searchInfluencers = async (pageToken = null, append = false) => {
    if (!niche.trim()) return;

    if (!append) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetch("http://localhost:4003/api/influencers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche,
          minFollowers: minFollowers ? Number(minFollowers) : undefined,
          maxFollowers: maxFollowers ? Number(maxFollowers) : undefined,
          pageToken,
          maxResults: 20,
        }),
      });

      const data = await res.json();
      const newInfluencers = data.influencers || [];

      if (append) {
        setResults(prev => [...prev, ...newInfluencers]);
      } else {
        setResults(newInfluencers);
        setHasSearched(true);
      }
      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = () => {
    searchInfluencers(null, false);
  };

  const loadMore = () => {
    if (nextPageToken && !loading && !loadingMore) {
      searchInfluencers(nextPageToken, true);
    }
  };

  const generateOutreachEmail = async (influencer) => {
    setEmailLoading(true);
    try {
      const res = await fetch("http://localhost:4003/api/outreach-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          influencer,
          product: "AI Marketing Platform",
          brand: "BrandPulse",
        }),
      });
      const data = await res.json();
      alert(data.email);
    } catch (err) {
      console.error(err);
      alert("Failed to generate email");
    } finally {
      setEmailLoading(false);
    }
  };

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Client-side sorting (applied after fetching)
  const getSortedResults = () => {
    let sorted = [...results];
    switch (sortBy) {
      case "followers_asc":
        sorted.sort((a, b) => a.followers - b.followers);
        break;
      case "followers_desc":
        sorted.sort((a, b) => b.followers - a.followers);
        break;
      case "name_asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    return sorted;
  };

  const displayResults = getSortedResults();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Influencer Suggester
              </h1>
              <p className="text-gray-400">Find perfect influencers for your brand in seconds</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl border border-gray-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-400" />
                Find Influencers
              </h2>
              <p className="text-gray-400 text-sm">Enter a niche and optional follower range</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Powered by AI
            </div>
          </div>

          {/* Row 1: Niche + Search */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="e.g. fitness, skincare, tech startups, gaming..."
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !niche.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 rounded-xl font-semibold flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {loading ? "Searching..." : "Find Influencers"}
            </button>
          </div>

          {/* Row 2: Follower range + Sort */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-2 rounded-xl border border-gray-800">
              <span className="text-gray-400 text-sm">Followers:</span>
              <input
                type="number"
                placeholder="Min"
                value={minFollowers}
                onChange={(e) => setMinFollowers(e.target.value)}
                className="w-24 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              <span className="text-gray-400">–</span>
              <input
                type="number"
                placeholder="Max"
                value={maxFollowers}
                onChange={(e) => setMaxFollowers(e.target.value)}
                className="w-24 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>

            <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-2 rounded-xl border border-gray-800">
              <Filter size={16} className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white focus:outline-none"
              >
                <option value="followers_desc">Most Followers</option>
                <option value="followers_asc">Least Followers</option>
                <option value="name_asc">Name A-Z</option>
                <option value="name_desc">Name Z-A</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-purple-600 rounded-xl text-white text-sm hover:bg-purple-700"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                Discovered Influencers
                {hasSearched && results.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    ({results.length} found)
                  </span>
                )}
              </h2>
              <p className="text-gray-400">
                {hasSearched ? "AI-matched influencers" : "Enter a niche and click 'Find Influencers'"}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && !loadingMore && (
            <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-800">
              <Loader2 className="w-14 h-14 animate-spin text-purple-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold">AI is Searching...</h3>
              <p className="text-gray-400">Finding perfect influencers in "{niche}" niche</p>
            </div>
          )}

          {/* Results Grid */}
          {!loading && hasSearched && results.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayResults.map((i, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl border border-gray-800 hover:border-purple-500/30 transition-all p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                            <span className="text-lg font-bold">{i.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{i.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-sm text-gray-400">Verified</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-2">{i.description}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-900/30 p-3 rounded-xl border border-gray-800">
                        <div className="text-sm text-gray-400 mb-1">Followers</div>
                        <div className="text-lg font-bold flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-400" />
                          {i.followers.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-gray-900/30 p-3 rounded-xl border border-gray-800">
                        <div className="text-sm text-gray-400 mb-1">Est. Budget</div>
                        <div className="text-lg font-bold flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          ${i.minBudget.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">Email</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{i.email}</span>
                          <button
                            onClick={() => copyEmail(i.email)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              copiedEmail === i.email ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                          >
                            {copiedEmail === i.email ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-3 mb-6">
                      <a href={i.youtube} target="_blank" rel="noreferrer" className="flex-1 px-3 py-2 bg-red-900/20 hover:bg-red-900/30 border border-red-800/30 rounded-xl text-sm flex items-center justify-center gap-2">
                        <Youtube className="w-4 h-4" /> YouTube <ExternalLink className="w-3 h-3" />
                      </a>
                      {i.instagram !== "Not found" && (
                        <a href={i.instagram} target="_blank" rel="noreferrer" className="flex-1 px-3 py-2 bg-pink-900/20 hover:bg-pink-900/30 border border-pink-800/30 rounded-xl text-sm flex items-center justify-center gap-2">
                          <Instagram className="w-4 h-4" /> Instagram <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => generateOutreachEmail(i)}
                        disabled={emailLoading}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 rounded-xl font-medium flex items-center justify-center gap-2"
                      >
                        {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                        {emailLoading ? "Generating..." : "Outreach Email"}
                      </button>
                      <button className="px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {nextPageToken && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium flex items-center gap-2 mx-auto"
                  >
                    {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {loadingMore ? "Loading..." : "Load More Influencers"}
                  </button>
                </div>
              )}
            </>
          )}

          {/* No Results */}
          {!loading && hasSearched && results.length === 0 && (
            <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-800">
              <Search className="w-14 h-14 text-red-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-3">No Influencers Found</h3>
              <p className="text-gray-400">Try a different niche or adjust follower range.</p>
            </div>
          )}

          {/* Initial Empty State */}
          {!hasSearched && !loading && (
            <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-800">
              <Search className="w-14 h-14 text-purple-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-3">Ready to Discover Influencers?</h3>
              <p className="text-gray-400 max-w-md mx-auto">Enter a niche above and click "Find Influencers"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}