import React from 'react';
import CaptionGenerator from './CaptionGenerator';
import PosterGenerator from './PosterGenerator';
import AutoAudioAd from './AutoAudioAd';

export default function CreativePage() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-10">
      {/* Caption Generator Section */}
      <section>
        <CaptionGenerator />
      </section>

      {/* Divider */}
      <div className="border-t border-gray-800/50 my-2"></div>

      {/* Poster Generator Section */}
      <section>
        <PosterGenerator />
      </section>

      {/* Divider */}
      <div className="border-t border-gray-800/50 my-2"></div>

      {/* Audio Ad Section */}
      <section>
        <AutoAudioAd />
      </section>
    </div>
  );
}