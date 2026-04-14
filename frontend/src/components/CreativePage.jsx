import React from 'react';
import CaptionGenerator from './CaptionGenerator';
import PosterGenerator from './PosterGenerator';
import AutoAudioAd from './AutoAudioAd';
import { useIdeas } from '../context/IdeaContext';

export default function CreativePage() {
  const { ideas, selectedIdea, selectedIdeaId, setSelectedIdeaId } = useIdeas();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-10">
      <section className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
        <div className="text-sm text-gray-400 mb-2">Using saved database idea for all creative tools</div>
        <select
          value={selectedIdeaId || ""}
          onChange={(e) => setSelectedIdeaId(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
        >
          {ideas.length === 0 && <option value="">No saved ideas found</option>}
          {ideas.map((idea) => (
            <option key={idea.id} value={idea.id}>
              {idea.brandName} - {idea.productService}
            </option>
          ))}
        </select>
      </section>

      {/* Caption Generator Section */}
      <section>
        <CaptionGenerator selectedIdea={selectedIdea} />
      </section>

      {/* Divider */}
      <div className="border-t border-gray-800/50 my-2"></div>

      {/* Poster Generator Section */}
      <section>
        <PosterGenerator selectedIdea={selectedIdea} />
      </section>

      {/* Divider */}
      <div className="border-t border-gray-800/50 my-2"></div>

      {/* Audio Ad Section */}
      <section>
        <AutoAudioAd selectedIdea={selectedIdea} />
      </section>
    </div>
  );
}