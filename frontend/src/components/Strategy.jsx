import React, { useState, useEffect } from 'react';
import Input from './Input';
import CampaignStrategyDashboard from './CampaignStrategyDashboard';
import { Target, Sparkles, AlertCircle } from 'lucide-react';
import { useIdeas } from "../context/IdeaContext";

export default function Strategy() {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activePrompt, setActivePrompt] = useState('');
  const { ideas } = useIdeas();
  const [savedIdeas, setSavedIdeas] = useState([]);

  useEffect(() => {
    const formattedIdeas = ideas.map((idea) => ({
      id: idea.id,
      title: idea.brandName,
      description: `${idea.productService} • ${idea.goal} • ${idea.budgetRange}`,
      prompt: `Create a marketing campaign for ${idea.brandName}, which offers ${idea.productService}. Target audience: ${idea.targetAudience}. Primary goal: ${idea.goal}. Recommended platforms: ${idea.platforms.join(", ")}. Brand tone: ${idea.tone}. Budget range: ${idea.budgetRange}.`,
    }));
    setSavedIdeas(formattedIdeas);
  }, [ideas]);

  // Function to extract structured data from prompt
  const extractDataFromPrompt = (promptText) => {
    console.log("Extracting data from prompt:", promptText);
    
    const brandMatch = promptText.match(/for\s+([^,]+)/i);
    const productMatch = promptText.match(/offers\s+([^.]+?)\./i) || 
                        promptText.match(/which offers\s+([^.]+?)\./i);
    const audienceMatch = promptText.match(/Target audience:\s+([^.]+)/i);
    const goalMatch = promptText.match(/Primary goal:\s+([^.]+)/i);
    const platformsMatch = promptText.match(/Recommended platforms:\s+([^.]+)/i);
    const toneMatch = promptText.match(/Brand tone:\s+([^.]+)/i);
    const budgetMatch = promptText.match(/Budget range:\s+([^.]+)/i);

    // For custom prompts (not from saved ideas)
    if (!brandMatch && promptText.length > 0) {
      return {
        brandName: "Custom Campaign",
        description: promptText,
        productOrService: promptText.substring(0, 50) + "...",
        targetAudience: "General audience",
        goal: "Awareness",
        platforms: ["Instagram", "LinkedIn"],
        budgetRange: "Medium",
        tone: "Professional",
        uniqueValue: "AI-powered campaign strategy",
        callToAction: "Get started today"
      };
    }

    return {
      brandName: brandMatch ? brandMatch[1].trim() : "Custom Brand",
      description: promptText,
      productOrService: productMatch ? productMatch[1].trim() : "Marketing Campaign",
      targetAudience: audienceMatch ? audienceMatch[1].trim() : "General audience",
      goal: goalMatch ? goalMatch[1].trim() : "Awareness",
      platforms: platformsMatch ? platformsMatch[1].split(/,\s*/).map(p => p.trim()) : ["Instagram", "LinkedIn"],
      budgetRange: budgetMatch ? budgetMatch[1].trim() : "Medium",
      tone: toneMatch ? toneMatch[1].trim() : "Professional",
      uniqueValue: "AI-powered campaign strategy",
      callToAction: "Get started today"
    };
  };

  const handleGenerate = async (content) => {
    if (!content.prompt) {
      setError("Please enter a prompt or select an idea");
      return;
    }
    
    setLoading(true);
    setError(null);
    setActivePrompt(content.prompt);
    
    try {
      // Transform the prompt into REQUEST_BODY format
      const requestBody = extractDataFromPrompt(content.prompt);
      console.log("Sending to backend:", requestBody);
      
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/ai-text`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const json = await res.json();
      console.log("Received response:", json);
      
      if (!json.success) {
        throw new Error(json.message || "Failed to generate strategy");
      }

      setStrategy(json.data);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      console.error("Error generating strategy:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
            <Target className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Campaign Strategy</h1>
            <p className="text-gray-400">Generate AI-powered marketing strategies</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Create Your Strategy</h2>
          <Input 
            onGenerate={handleGenerate}
            placeholder="Describe your campaign or select a saved idea..."
            savedIdeas={savedIdeas}
          />
        </div>

        {/* Active Prompt Display */}
        {activePrompt && !error && !loading && (
          <div className="mb-6">
            <div className="flex items-center justify-between bg-gradient-to-r from-purple-900/20 to-pink-900/10 border border-purple-800/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-sm text-gray-400">Generating strategy for:</div>
                  <div className="font-medium">{activePrompt.substring(0, 100)}...</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Generating Strategy...</h3>
          <p className="text-gray-400">AI is creating your perfect marketing campaign</p>
          <div className="mt-4 text-sm text-gray-500">
            Based on: {activePrompt.substring(0, 80)}...
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-gradient-to-br from-red-900/20 to-rose-900/10 border border-red-800/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <h3 className="text-xl font-semibold">Error Generating Strategy</h3>
          </div>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setStrategy(null);
              setActivePrompt('');
            }}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Strategy Results */}
      {strategy && !loading && !error && (
        <div className="animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-purple-400">Generated Strategy</h2>
            <button 
              onClick={() => {
                setStrategy(null);
                setActivePrompt('');
              }}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
            >
              Generate New Strategy
            </button>
          </div>
          <CampaignStrategyDashboard strategy={strategy} />
        </div>
      )}

      {/* Empty State */}
      {!strategy && !loading && !error && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800">
          <Target className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Strategy Generated Yet</h3>
          <p className="text-gray-400 mb-6">Enter a prompt or select an idea above to generate your AI strategy</p>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 bg-gray-900/30 rounded-xl">
              <div className="font-medium mb-2">1. Enter Prompt</div>
              <p className="text-sm text-gray-400">Describe your campaign goals</p>
            </div>
            <div className="p-4 bg-gray-900/30 rounded-xl">
              <div className="font-medium mb-2">2. Or Select Idea</div>
              <p className="text-sm text-gray-400">Choose from saved ideas</p>
            </div>
            <div className="p-4 bg-gray-900/30 rounded-xl">
              <div className="font-medium mb-2">3. Generate</div>
              <p className="text-sm text-gray-400">Get AI-powered strategy</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}