import React, { useState } from 'react';
import Input from './Input';
import { 
  Captions, Sparkles, Copy, Download, RefreshCw, 
  CheckCircle, AlertCircle, Hash, Volume2, 
  Instagram, Youtube, Facebook, FileText, 
  Type, MessageSquare, ChevronDown, ChevronUp,
  ExternalLink, BarChart, HashIcon, Globe
} from 'lucide-react';

export default function CaptionGenerator({ selectedIdea }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTone, setSelectedTone] = useState('professional');
  const [copiedItem, setCopiedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('instagram');
  
  const savedCaptionTemplates = selectedIdea
    ? [
        {
          id: selectedIdea.id,
          title: selectedIdea.brandName,
          description: `${selectedIdea.productService} • ${selectedIdea.goal} • ${selectedIdea.tone}`,
          prompt: `Generate marketing content for ${selectedIdea.brandName}, offering ${selectedIdea.productService}. Target audience: ${selectedIdea.targetAudience}. Goal: ${selectedIdea.goal}. Platforms: ${selectedIdea.platforms.join(", ")}. Tone: ${selectedIdea.tone}. Budget: ${selectedIdea.budgetRange}.`,
          serviceType: "captions",
        },
      ]
    : [];

  const handleGenerateContent = async (inputData) => {
    if (!inputData.prompt) {
      setError("Please enter a prompt or select a template");
      return;
    }

    setLoading(true);
    setError(null);
    setContent(null);
    setCopiedItem(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/captions/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: inputData.prompt,
            serviceType: 'captions',
            tone: selectedTone
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'SUCCESS') {
        setContent(result.data);
      } else {
        throw new Error(result.message || 'Failed to generate content');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Error generating content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text, type, index = null) => {
    navigator.clipboard.writeText(text);
    const key = index !== null ? `${type}-${index}` : type;
    setCopiedItem(key);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleDownloadAll = () => {
    if (content) {
      const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `content-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleRegenerate = () => {
    if (savedCaptionTemplates[0]?.prompt) {
      handleGenerateContent({ prompt: savedCaptionTemplates[0].prompt });
    }
  };

  const tones = [
    { id: 'professional', name: 'Professional', color: 'from-blue-500 to-cyan-500' },
    { id: 'inspirational', name: 'Inspirational', color: 'from-purple-500 to-pink-500' },
    { id: 'conversational', name: 'Conversational', color: 'from-green-500 to-emerald-500' },
    { id: 'urgent', name: 'Urgent', color: 'from-red-500 to-orange-500' }
  ];

  const tabs = [
    { id: 'instagram', name: 'Instagram Captions', icon: <Instagram className="w-4 h-4" />, count: content?.instagram_captions?.length || 0 },
    { id: 'adcopy', name: 'Ad Copy', icon: <Type className="w-4 h-4" />, count: content?.ad_copy?.length || 0 },
    { id: 'blog', name: 'Blog Content', icon: <FileText className="w-4 h-4" />, hasContent: !!content?.blog_content },
    { id: 'ctas', name: 'CTAs', icon: <HashIcon className="w-4 h-4" />, count: content?.ctas?.length || 0 }
  ];

  const calculateStats = () => {
    if (!content) return { totalItems: 0, totalChars: 0, totalWords: 0 };
    
    let totalItems = 0;
    let totalChars = 0;
    let totalWords = 0;
    
    if (content.instagram_captions) {
      content.instagram_captions.forEach(caption => {
        totalChars += caption.length;
        totalWords += caption.split(/\s+/).length;
      });
      totalItems += content.instagram_captions.length;
    }
    
    if (content.ad_copy) {
      content.ad_copy.forEach(ad => {
        if (ad.headline) {
          totalChars += ad.headline.length;
          totalWords += ad.headline.split(/\s+/).length;
        }
        if (ad.description) {
          totalChars += ad.description.length;
          totalWords += ad.description.split(/\s+/).length;
        }
        totalItems += 1;
      });
    }
    
    if (content.blog_content?.intro) {
      totalChars += content.blog_content.intro.length;
      totalWords += content.blog_content.intro.split(/\s+/).length;
      totalItems += 1;
    }
    
    if (content.ctas) {
      content.ctas.forEach(cta => {
        totalChars += cta.length;
        totalWords += cta.split(/\s+/).length;
      });
      totalItems += content.ctas.length;
    }
    
    return { totalItems, totalChars, totalWords };
  };

  const stats = calculateStats();

  return (
    <div className="w-full bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
            <Captions className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Content Generator</h2>
            <p className="text-sm text-gray-400">Instagram captions, ad copy, blog content & CTAs</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Input Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Generate Content</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Tone:</span>
              <div className="flex gap-2">
                {tones.map(tone => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={`px-3 py-1 rounded-lg text-xs transition-all ${
                      selectedTone === tone.id 
                        ? 'bg-gray-800 text-white border border-gray-700' 
                        : 'bg-gray-900/50 text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                    }`}
                  >
                    {tone.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <Input 
            onGenerate={handleGenerateContent}
            placeholder="Describe your brand, product, or campaign idea..."
            savedIdeas={savedCaptionTemplates}
            serviceType="captions"
            generateButtonText="Generate Marketing Content"
            ideasTitle="Use selected saved idea"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">AI is Generating Your Content</h3>
            <p className="text-gray-400 text-sm">Creating Instagram captions, ad copy, blog content, and CTAs...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Generated Content */}
        {content && !loading && !error && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-900/30 p-3 rounded-xl border border-gray-700 text-center">
                <div className="text-xl font-bold">{stats.totalItems}</div>
                <div className="text-xs text-gray-400">Total Items</div>
              </div>
              <div className="bg-gray-900/30 p-3 rounded-xl border border-gray-700 text-center">
                <div className="text-xl font-bold">{stats.totalWords}</div>
                <div className="text-xs text-gray-400">Total Words</div>
              </div>
              <div className="bg-gray-900/30 p-3 rounded-xl border border-gray-700 text-center">
                <div className="text-xl font-bold">{stats.totalChars}</div>
                <div className="text-xs text-gray-400">Characters</div>
              </div>
              <div className="bg-gray-900/30 p-3 rounded-xl border border-gray-700 text-center">
                <div className="text-xl font-bold">{tabs.reduce((sum, tab) => sum + (tab.count || 0), 0)}</div>
                <div className="text-xs text-gray-400">Variations</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border border-gray-800 rounded-xl overflow-hidden">
              <div className="flex border-b border-gray-800 overflow-x-auto bg-gray-900/20">
                {tabs.map(tab => {
                  const hasContent = tab.hasContent !== undefined ? tab.hasContent : (tab.count > 0);
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      disabled={!hasContent}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                        !hasContent ? 'opacity-50 cursor-not-allowed' : ''
                      } ${
                        activeTab === tab.id 
                          ? 'border-green-500 text-green-400' 
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {tab.icon}
                      {tab.name}
                      {tab.count > 0 && (
                        <span className="px-1.5 py-0.5 text-xs bg-gray-800 rounded">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="p-4">
                {activeTab === 'instagram' && content.instagram_captions && (
                  <div className="space-y-3">
                    {content.instagram_captions.map((caption, index) => (
                      <div key={index} className="bg-gray-900/30 p-4 rounded-lg border border-gray-800">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-xs text-gray-400">
                            #{index+1} • {caption.length} chars • {caption.split(/\s+/).length} words
                          </div>
                          <button
                            onClick={() => handleCopyText(caption, 'instagram', index)}
                            className="text-xs flex items-center gap-1 text-gray-400 hover:text-white"
                          >
                            {copiedItem === `instagram-${index}` ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copiedItem === `instagram-${index}` ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <p className="text-gray-200 text-sm whitespace-pre-wrap">{caption}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'adcopy' && content.ad_copy && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {content.ad_copy.map((ad, index) => (
                      <div key={index} className="bg-gray-900/30 p-4 rounded-lg border border-gray-800">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-gray-400">Ad #{index+1}</span>
                          <button
                            onClick={() => handleCopyText(`${ad.headline}\n\n${ad.description}`, 'adcopy', index)}
                            className="text-xs flex items-center gap-1 text-gray-400 hover:text-white"
                          >
                            {copiedItem === `adcopy-${index}` ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            Copy
                          </button>
                        </div>
                        <h4 className="font-bold text-white text-sm mb-1">{ad.headline}</h4>
                        <p className="text-gray-300 text-xs">{ad.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'blog' && content.blog_content && (
                  <div className="space-y-4">
                    {content.blog_content.titles && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Suggested Titles</h4>
                        <div className="space-y-1">
                          {content.blog_content.titles.map((title, i) => (
                            <div key={i} className="text-sm text-gray-200">• {title}</div>
                          ))}
                        </div>
                      </div>
                    )}
                    {content.blog_content.intro && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-semibold text-gray-300">Blog Introduction</h4>
                          <button
                            onClick={() => handleCopyText(content.blog_content.intro, 'blog-intro')}
                            className="text-xs flex items-center gap-1 text-gray-400 hover:text-white"
                          >
                            {copiedItem === 'blog-intro' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            Copy
                          </button>
                        </div>
                        <p className="text-gray-200 text-sm whitespace-pre-wrap">{content.blog_content.intro}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'ctas' && content.ctas && (
                  <div className="grid md:grid-cols-2 gap-3">
                    {content.ctas.map((cta, index) => (
                      <div key={index} className="bg-gray-900/30 p-3 rounded-lg border border-gray-800 flex justify-between items-center">
                        <span className="text-gray-200 text-sm">{cta}</span>
                        <button
                          onClick={() => handleCopyText(cta, 'cta', index)}
                          className="text-gray-400 hover:text-white"
                        >
                          {copiedItem === `cta-${index}` ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleDownloadAll}
                className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                JSON
              </button>
              <button
                onClick={handleRegenerate}
                className="px-3 py-1.5 text-sm bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!content && !loading && !error && (
          <div className="text-center py-12 bg-gray-900/30 rounded-xl border border-gray-800">
            <Captions className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">Ready to Create Content</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Describe your brand or product above to generate Instagram captions, ad copy, blog content, and CTAs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}