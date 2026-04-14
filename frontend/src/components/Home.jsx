// pages/Home.jsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Rocket, 
  Lightbulb, 
  Brain, 
  UserPlus, 
  ClipboardList, 
  Target,
  Zap,
  Menu,
  X,
  UserRound, 
  Home as HomeIcon,
  Plus,
  Palette,
  Handshake
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    {
      id: 'add-idea',
      title: 'Your Ideas',
      icon: <Lightbulb className="w-5 h-5" />,
      path: '/app/add-idea',
      description: 'Submit new campaign ideas'
    },
    {
      id: 'strategy',
      title: 'Strategy',
      icon: <Target className="w-5 h-5" />,
      path: '/app/strategy',
      description: 'Strategy planning & analysis'
    },
    {
      id: 'creative',
      title: 'Creativity Area',
      icon: <Palette className="w-5 h-5" />,
      path: '/app/creative',
      description: 'Quick AI prompt generation'
    },
    {
      id: 'influencers',
      title: 'Find Influencers',
      icon: <Handshake  className="w-5 h-5" />,
      path: '/app/influencers',
      description: 'Manage influencer campaigns'
    },
    // {
    //   id: 'profile',
    //   title: 'Profile',
    //   icon: <UserRound  className="w-5 h-5" />,
    //   path: '/profile',
    //   description: 'Manage influencer campaigns'
    // }
  ];

  // Find active item
  const activeItem = navItems.find(item => 
    location.pathname === item.path || 
    (item.path === '/' && location.pathname === '/')
  ) || navItems[0];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <Rocket className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg">CampaignAI</span>
        </div>
        
        <div className="w-10"></div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - 20% width */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 min-h-screen bg-gradient-to-b from-gray-900 to-gray-950
        border-r border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-2xl flex flex-col
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold">CampaignAI</div>
              <div className="text-sm text-gray-400">Growth Studio</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/' && location.pathname === '/');
            
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  group relative flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-900/40 to-pink-900/20 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }
                  hover:scale-[1.02] active:scale-[0.98]
                `}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r"></div>
                )}
                
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white' 
                    : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-white'
                  }
                `}>
                  {item.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-400 truncate">{item.description}</div>
                </div>
                
                {isActive && (
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="mb-4 p-3 bg-gray-900/60 border border-gray-800 rounded-xl">
            <div className="text-sm font-semibold truncate">{user?.displayName || "Campaign User"}</div>
            <div className="text-xs text-gray-400 truncate">{user?.email}</div>
            <button
              onClick={logout}
              className="mt-3 w-full px-3 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Right Content Area - 80% width, flush with sidebar */}
      <main className="flex-1 lg:ml-0 min-h-screen bg-gray-950 overflow-hidden">
        {/* Active Section Header - Now flush with sidebar */}
        <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                {activeItem.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{activeItem.title}</h1>
                <p className="text-gray-400">{activeItem.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - This starts immediately after header */}
        <div className="h-[calc(100vh-112px)] overflow-y-auto">
          <div className="p-6">
            <Outlet /> {/* This will render Landing.jsx or other pages */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;