import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';

export default function Influencers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [minFollowers, setMinFollowers] = useState('');
  const [maxFollowers, setMaxFollowers] = useState('');
  const [sortBy, setSortBy] = useState('followers_desc'); // default

  useEffect(() => {
    fetchInfluencers('fitness');
  }, []);

  const fetchInfluencers = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/influencers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: query,
          minFollowers: minFollowers ? Number(minFollowers) : null,
          maxFollowers: maxFollowers ? Number(maxFollowers) : null,
        }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Backend error (${res.status}): ${errorText}`);
      }
      const data = await res.json();
      setInfluencers(Array.isArray(data.influencers) ? data.influencers : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setInfluencers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchInfluencers(searchTerm || 'fitness');
  };

  // Client-side filtering (name) and sorting
  const getProcessedInfluencers = () => {
    let result = [...influencers];

    // Filter by name
    if (searchTerm) {
      result = result.filter(inf =>
        inf.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'followers_asc':
        result.sort((a, b) => (a.followers || 0) - (b.followers || 0));
        break;
      case 'followers_desc':
        result.sort((a, b) => (b.followers || 0) - (a.followers || 0));
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    return result;
  };

  const displayList = getProcessedInfluencers();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Influencer Directory</h1>
        <p className="text-gray-400">Find creators by niche, follower count, and more</p>
      </div>

      {/* SEARCH & FILTERS - Improved layout */}
      <div className="mb-6 space-y-4">
        {/* Row 1: Niche search */}
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Niche (e.g., fitness, gaming)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 bg-gray-900 border border-gray-800 rounded-xl text-white"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Search size={18} />
            Search
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

          {/* Optional: Apply range button (if you want to refetch with new range) */}
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-purple-600 rounded-xl text-white text-sm hover:bg-purple-700 transition"
          >
            Apply Range
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-400">
          ❌ {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-center py-10 text-gray-400">
          Loading influencers...
        </div>
      )}

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayList.map((influencer) => (
          <div
            key={influencer.id}
            className="bg-gray-900 rounded-2xl border border-gray-800 p-6 hover:border-blue-500/30 transition"
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src={influencer.thumbnail}
                alt={influencer.name}
                className="w-14 h-14 rounded-xl object-cover"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/56')}
              />
              <div>
                <h3 className="font-bold text-white">{influencer.name}</h3>
                <p className="text-gray-400 text-sm">{influencer.handle}</p>
                <div className="text-sm text-yellow-400">⭐ {influencer.rating}</div>
              </div>
            </div>

            <div className="text-sm text-gray-400 mb-1 capitalize">{influencer.category}</div>
            <div className="mb-2">
              <span className="text-gray-400 text-sm">Followers: </span>
              <span className="font-bold text-white">
                {influencer.followers?.toLocaleString()}
              </span>
            </div>
            <div className="mb-3">
              <span className="text-gray-400 text-sm">Est. Budget: </span>
              <span className="font-bold text-white">
                ${influencer.minBudget?.toLocaleString()}
              </span>
            </div>

            <button className="w-full bg-blue-600 py-2 rounded-lg text-white hover:bg-blue-700 transition">
              Contact
            </button>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && !error && displayList.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          No influencers found. Try adjusting your filters or search term.
        </div>
      )}
    </div>
  );
}