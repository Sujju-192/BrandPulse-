import React, { useState, useEffect } from 'react';
import { 
  Check, Sparkles, X, TrendingUp, Users, Target,
  DollarSign, Mic, Globe, Plus, AlertCircle,
  Trash2, Edit, Eye, Calendar, Filter, Search,
  ChevronDown, MessageSquare, BarChart, Save,
  Copy  // ← Added for Discuss modal
} from 'lucide-react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useIdeas } from "../context/IdeaContext";

export default function Ideas() {
  const [ideas, setIdeas] = useState([]);
  const { user } = useAuth();
  const { selectedIdeaId, setSelectedIdeaId } = useIdeas();

  useEffect(() => {
    if (!user?.uid) return;

    const ideasRef = collection(db, "ideas");
    const q = query(ideasRef, where("uid", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((ideaDoc) => ({
        id: ideaDoc.id,
        ...ideaDoc.data(),
      }));

      data.sort((a, b) => {
        const aDate = a.createdAt?.seconds || 0;
        const bDate = b.createdAt?.seconds || 0;
        return bDate - aDate;
      });

      setIdeas(data);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Form state for adding
  const [formData, setFormData] = useState({
    brandName: '',
    productService: '',
    targetAudience: '',
    goal: '',
    platforms: [],
    budgetRange: '',
    tone: ''
  });

  // Edit modal state
  const [editingIdea, setEditingIdea] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // View modal state
  const [viewingIdea, setViewingIdea] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Discuss modal state
  const [discussingIdea, setDiscussingIdea] = useState(null);
  const [showDiscussModal, setShowDiscussModal] = useState(false);
  const [discussMessage, setDiscussMessage] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);

  const platformOptions = ['Instagram', 'LinkedIn', 'YouTube', 'Facebook', 'Twitter/X', 'TikTok', 'Pinterest', 'WhatsApp', 'Email'];
  const goalOptions = ['Leads', 'Awareness', 'Sales', 'Engagement', 'Traffic', 'Conversions'];
  const toneOptions = ['Professional', 'Fun/Casual', 'Premium/Luxury', 'Youth/Gen-Z', 'Friendly', 'Bold/Edgy', 'Inspirational'];
  const budgetRanges = ['INR.100 - INR.500', 'INR.500 - INR.2,000', 'INR.2,000 - INR.5,000', 'INR.5,000 - INR.10,000', 'INR.10,000+', 'Custom'];
  const statusOptions = ['Active', 'Pending', 'Completed'];

  // ========== ADD IDEA ==========
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePlatformToggle = (platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.brandName.trim()) newErrors.brandName = 'Brand name is required';
    if (!formData.productService.trim()) newErrors.productService = 'Product/Service is required';
    if (!formData.targetAudience.trim()) newErrors.targetAudience = 'Target audience is required';
    if (!formData.goal) newErrors.goal = 'Please select a goal';
    if (formData.platforms.length === 0) newErrors.platforms = 'Select at least one platform';
    if (!formData.budgetRange) newErrors.budgetRange = 'Budget range is required';
    if (!formData.tone) newErrors.tone = 'Please select a tone';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newIdea = {
      ...formData,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      uid: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await addDoc(collection(db, "ideas"), newIdea);
    setShowSuccess(true);
    setFormData({
      brandName: '',
      productService: '',
      targetAudience: '',
      goal: '',
      platforms: [],
      budgetRange: '',
      tone: ''
    });
    setShowAddForm(false);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  // ========== EDIT IDEA ==========
  const openEditModal = (idea) => {
    setEditingIdea(idea);
    setEditFormData({ ...idea });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditPlatformToggle = (platform) => {
    setEditFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const saveEdit = async () => {
    if (!editFormData.brandName.trim()) return;
    const ideaRef = doc(db, "ideas", editingIdea.id);
    const { id, ...ideaWithoutId } = editFormData;
    const payload = { ...ideaWithoutId, updatedAt: serverTimestamp() };
    await updateDoc(ideaRef, payload);
    setShowEditModal(false);
    setEditingIdea(null);
    setEditFormData(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // ========== VIEW IDEA ==========
  const openViewModal = (idea) => {
    setViewingIdea(idea);
    setShowViewModal(true);
  };

  // ========== DISCUSS IDEA ==========
  const openDiscussModal = (idea) => {
    setDiscussingIdea(idea);
    const prompt = `Let's discuss the campaign for ${idea.brandName} (${idea.productService}).\n\nGoal: ${idea.goal}\nAudience: ${idea.targetAudience}\nPlatforms: ${idea.platforms.join(', ')}\nTone: ${idea.tone}\nBudget: ${idea.budgetRange}\n\nWhat are your thoughts on creative angles or execution strategies?`;
    setDiscussMessage(prompt);
    setShowDiscussModal(true);
  };

  const copyDiscussMessage = () => {
    navigator.clipboard.writeText(discussMessage);
    alert('Discussion prompt copied to clipboard!');
  };

  // ========== DELETE IDEA ==========
  const handleDeleteIdea = async (id) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      await deleteDoc(doc(db, "ideas", id));
    }
  };

  // ========== FILTER ==========
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = 
      idea.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.productService.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.targetAudience.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || idea.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-900/30 text-green-400 border-green-800';
      case 'Pending': return 'bg-yellow-900/30 text-yellow-400 border-yellow-800';
      case 'Completed': return 'bg-blue-900/30 text-blue-400 border-blue-800';
      default: return 'bg-gray-900/30 text-gray-400 border-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Success Alert */}
      {showSuccess && (
        <div className="mb-6 animate-slideDown">
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/20 border border-green-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-green-300">Success!</div>
                <div className="text-sm text-green-400">Idea has been updated.</div>
              </div>
            </div>
            <button onClick={() => setShowSuccess(false)} className="text-green-400 hover:text-green-300 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Business Ideas</h1>
            <p className="text-gray-400">Manage and create new marketing campaign ideas</p>
          </div>
        </div>
        <div className="text-sm text-purple-300 bg-purple-900/20 border border-purple-800/40 rounded-xl px-3 py-2 inline-block">
          Active idea is shared across Strategy, Creative Area, and Find Influencers.
        </div>
      </div>

      {/* Add Idea Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" />
          {showAddForm ? 'Cancel' : 'Add New Idea'}
        </button>
      </div>

      {/* ========== FULL ADD IDEA FORM ========== */}
      {showAddForm && (
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800 p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Create New Idea</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Brand Name & Product/Service Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Target className="w-4 h-4" />
                  Brand Name *
                </label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  placeholder="Enter brand name"
                  className={`w-full px-4 py-3 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all ${
                    errors.brandName ? 'border-red-500/50' : 'border-gray-800 hover:border-gray-700'
                  }`}
                />
                {errors.brandName && (
                  <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.brandName}
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  Product / Service *
                </label>
                <input
                  type="text"
                  name="productService"
                  value={formData.productService}
                  onChange={handleChange}
                  placeholder="What are you selling/offering?"
                  className={`w-full px-4 py-3 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all ${
                    errors.productService ? 'border-red-500/50' : 'border-gray-800 hover:border-gray-700'
                  }`}
                />
                {errors.productService && (
                  <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.productService}
                  </div>
                )}
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Users className="w-4 h-4" />
                Target Audience *
              </label>
              <textarea
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                placeholder="Describe your ideal customers (age, interests, demographics, etc.)"
                rows="2"
                className={`w-full px-4 py-3 bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none ${
                  errors.targetAudience ? 'border-red-500/50' : 'border-gray-800 hover:border-gray-700'
                }`}
              />
              {errors.targetAudience && (
                <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.targetAudience}
                </div>
              )}
            </div>

            {/* Goal Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                <Target className="w-4 h-4" />
                Campaign Goal *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleChange({ target: { name: 'goal', value: goal } })}
                    className={`
                      px-3 py-2 rounded-lg border transition-all duration-300 text-sm
                      ${formData.goal === goal 
                        ? 'bg-gradient-to-r from-purple-900/40 to-pink-900/20 border-purple-500 text-white' 
                        : 'bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-800/30 text-gray-300'
                      }
                    `}
                  >
                    {goal}
                  </button>
                ))}
              </div>
              {errors.goal && (
                <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.goal}
                </div>
              )}
            </div>

            {/* Platforms Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                <Globe className="w-4 h-4" />
                Platforms *
              </label>
              <div className="flex flex-wrap gap-2">
                {platformOptions.map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => handlePlatformToggle(platform)}
                    className={`
                      px-3 py-2 rounded-lg border transition-all duration-300 text-sm flex items-center gap-2
                      ${formData.platforms.includes(platform)
                        ? 'bg-gradient-to-r from-blue-900/30 to-cyan-900/20 border-blue-500 text-white' 
                        : 'bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-800/30 text-gray-300'
                      }
                    `}
                  >
                    {platform}
                    {formData.platforms.includes(platform) && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
              {errors.platforms && (
                <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.platforms}
                </div>
              )}
            </div>

            {/* Budget Range & Tone */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                  <DollarSign className="w-4 h-4" />
                  Budget Range *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {budgetRanges.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => handleChange({ target: { name: 'budgetRange', value: range } })}
                      className={`
                        px-3 py-2 rounded-lg border transition-all duration-300 text-sm
                        ${formData.budgetRange === range 
                          ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/20 border-green-500 text-white' 
                          : 'bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-800/30 text-gray-300'
                        }
                      `}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                {errors.budgetRange && (
                  <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.budgetRange}
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                  <Mic className="w-4 h-4" />
                  Brand Tone *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {toneOptions.slice(0, 6).map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => handleChange({ target: { name: 'tone', value: tone } })}
                      className={`
                        px-3 py-2 rounded-lg border transition-all duration-300 text-sm
                        ${formData.tone === tone 
                          ? 'bg-gradient-to-r from-purple-900/40 to-pink-900/20 border-purple-500 text-white' 
                          : 'bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-800/30 text-gray-300'
                        }
                      `}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
                {errors.tone && (
                  <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.tone}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-800">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                Save Idea
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 bg-gray-900/50 hover:bg-gray-800 border border-gray-800 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="text" placeholder="Search ideas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500/50 text-white" />
          </div>
          <div className="relative">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="appearance-none bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-2 pl-10 pr-8 text-white">
              <option value="All">All</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Ideas List */}
      <div className="space-y-4">
        {filteredIdeas.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800">
            <Sparkles className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No ideas found</h3>
            <button onClick={() => setShowAddForm(true)} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">Add First Idea</button>
          </div>
        ) : (
          filteredIdeas.map(idea => (
            <div key={idea.id} className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl border border-gray-800 hover:border-purple-500/30 transition-all p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold">{idea.brandName}</h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(idea.status)}`}>
                          {idea.status}
                        </span>
                      </div>
                      <p className="text-gray-400">{idea.productService}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedIdeaId(idea.id)}
                        className={`px-2 py-1 rounded-lg text-xs border ${
                          selectedIdeaId === idea.id
                            ? "bg-purple-900/30 border-purple-500 text-purple-300"
                            : "bg-gray-900/50 border-gray-700 text-gray-300 hover:border-purple-500/40"
                        }`}
                        title="Use this idea in all tabs"
                      >
                        {selectedIdeaId === idea.id ? "Active Idea" : "Set Active"}
                      </button>
                      <button onClick={() => openEditModal(idea)} className="p-2 hover:bg-blue-900/20 text-blue-400 hover:text-blue-300 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteIdea(idea.id)} className="p-2 hover:bg-red-900/20 text-red-400 hover:text-red-300 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div><div className="text-sm text-gray-400 mb-1">Target Audience</div><p className="text-sm">{idea.targetAudience}</p></div>
                    <div><div className="text-sm text-gray-400 mb-1">Campaign Goal</div><div className="flex items-center gap-2"><Target className="w-4 h-4 text-purple-400" /><span className="font-medium">{idea.goal}</span></div></div>
                    <div><div className="text-sm text-gray-400 mb-1">Platforms</div><div className="flex flex-wrap gap-2">{idea.platforms.map((p, idx) => <span key={idx} className="px-2 py-1 bg-blue-900/20 text-blue-300 rounded text-xs">{p}</span>)}</div></div>
                    <div><div className="text-sm text-gray-400 mb-1">Tone & Budget</div><div className="flex items-center gap-3"><span className="text-sm">{idea.tone}</span><span className="text-lg font-bold">{idea.budgetRange}</span></div></div>
                  </div>
                </div>
                <div className="md:w-48 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400"><Calendar className="w-4 h-4" /> Created: {idea.date}</div>
                  <div className="flex gap-2">
                    <button onClick={() => openViewModal(idea)} className="flex-1 px-3 py-2 bg-gray-900/50 hover:bg-gray-800 border border-gray-800 rounded-lg text-sm flex items-center justify-center gap-2"><Eye className="w-4 h-4" /> View</button>
                    <button onClick={() => openDiscussModal(idea)} className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg text-sm text-white flex items-center justify-center gap-2"><MessageSquare className="w-4 h-4" /> Discuss</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl p-4 border border-gray-800"><div className="text-2xl font-bold mb-1">{ideas.length}</div><div className="text-sm text-gray-400">Total Ideas</div></div>
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl p-4 border border-gray-800"><div className="text-2xl font-bold mb-1">{ideas.filter(i => i.status === 'Active').length}</div><div className="text-sm text-gray-400">Active</div></div>
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl p-4 border border-gray-800"><div className="text-2xl font-bold mb-1">{ideas.filter(i => i.status === 'Pending').length}</div><div className="text-sm text-gray-400">Pending</div></div>
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 rounded-2xl p-4 border border-gray-800"><div className="text-2xl font-bold mb-1">{ideas.filter(i => i.status === 'Completed').length}</div><div className="text-sm text-gray-400">Completed</div></div>
      </div>

      {/* ========== MODALS ========== */}

      {/* Edit Modal */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Campaign Idea</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-800 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium mb-2">Brand Name</label><input name="brandName" value={editFormData.brandName} onChange={handleEditChange} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-2">Product/Service</label><input name="productService" value={editFormData.productService} onChange={handleEditChange} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-2">Target Audience</label><textarea name="targetAudience" value={editFormData.targetAudience} onChange={handleEditChange} rows="2" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-2">Goal</label><select name="goal" value={editFormData.goal} onChange={handleEditChange} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">{goalOptions.map(g => <option key={g}>{g}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-2">Platforms</label><div className="flex flex-wrap gap-2">{platformOptions.map(p => (<button key={p} type="button" onClick={() => handleEditPlatformToggle(p)} className={`px-3 py-1 rounded-lg border text-sm ${editFormData.platforms.includes(p) ? 'bg-blue-900/40 border-blue-500' : 'bg-gray-800 border-gray-700'}`}>{p}</button>))}</div></div>
              <div><label className="block text-sm font-medium mb-2">Budget Range</label><select name="budgetRange" value={editFormData.budgetRange} onChange={handleEditChange} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">{budgetRanges.map(b => <option key={b}>{b}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-2">Tone</label><select name="tone" value={editFormData.tone} onChange={handleEditChange} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">{toneOptions.map(t => <option key={t}>{t}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-2">Status</label><select name="status" value={editFormData.status} onChange={handleEditChange} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">{statusOptions.map(s => <option key={s}>{s}</option>)}</select></div>
              <div className="flex gap-3 pt-4"><button onClick={saveEdit} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</button><button onClick={() => setShowEditModal(false)} className="px-6 py-2 bg-gray-800 rounded-lg">Cancel</button></div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingIdea && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-2xl w-full">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Idea Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-800 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><div className="text-sm text-gray-400">Brand Name</div><div className="text-lg font-semibold">{viewingIdea.brandName}</div></div>
              <div><div className="text-sm text-gray-400">Product/Service</div><div>{viewingIdea.productService}</div></div>
              <div><div className="text-sm text-gray-400">Target Audience</div><div>{viewingIdea.targetAudience}</div></div>
              <div><div className="text-sm text-gray-400">Campaign Goal</div><div>{viewingIdea.goal}</div></div>
              <div><div className="text-sm text-gray-400">Platforms</div><div className="flex flex-wrap gap-2">{viewingIdea.platforms.map((p,i) => <span key={i} className="px-2 py-1 bg-blue-900/20 rounded">{p}</span>)}</div></div>
              <div><div className="text-sm text-gray-400">Budget Range</div><div>{viewingIdea.budgetRange}</div></div>
              <div><div className="text-sm text-gray-400">Tone</div><div>{viewingIdea.tone}</div></div>
              <div><div className="text-sm text-gray-400">Status</div><span className={`inline-block px-2 py-1 rounded-lg text-xs border ${getStatusColor(viewingIdea.status)}`}>{viewingIdea.status}</span></div>
              <div><div className="text-sm text-gray-400">Created</div><div>{viewingIdea.date}</div></div>
            </div>
          </div>
        </div>
      )}

      {/* Discuss Modal */}
      {showDiscussModal && discussingIdea && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-2xl w-full">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Discuss Campaign</h2>
              <button onClick={() => setShowDiscussModal(false)} className="p-2 hover:bg-gray-800 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-4">Here's a prompt to start the discussion about <strong>{discussingIdea.brandName}</strong>:</p>
              <textarea readOnly value={discussMessage} rows="8" className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-gray-200" />
              <div className="flex gap-3 mt-6">
                <button onClick={copyDiscussMessage} className="px-4 py-2 bg-blue-600 rounded-lg flex items-center gap-2"><Copy className="w-4 h-4" /> Copy Prompt</button>
                <button onClick={() => setShowDiscussModal(false)} className="px-4 py-2 bg-gray-800 rounded-lg">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}