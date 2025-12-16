'use client'

import React, { createContext, useContext, useReducer, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Gamepad2, Music2, MonitorPlay, FolderOpen,
  Mic2, Trophy, Play, Settings, Disc, Headphones, Heart, MoreVertical,
  Search, Bell, Menu, ChevronRight, X, Maximize, Minimize, SkipForward, Volume2,
  Star, Pause, Cast, MessageSquare, Share2, LayoutGrid, Calendar
} from 'lucide-react';

// --- 1. TYPES & MOCK DATA ---

export interface Video {
  id: string;
  title: string;
  url: string; // Using MP4 for broader compatibility in this demo
  thumb: string;
  isLive: boolean;
  author: string;
  views: string;
  rating: number;
  time: string;
  category: string;
}

interface AppState {
  items: Video[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  selectedVideo: Video | null;
  filter: string;
  currentApp: string;
  isSidebarOpen: boolean;
  searchQuery: string;
}

const CATEGORIES = ['All', 'Live', 'Gaming', 'Music', 'IRL'];

const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'CYBERPUNK 2077: Phantom Liberty - 4K Ray Tracing Max Settings',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop',
    isLive: true,
    author: 'NeonRider',
    views: '24K',
    rating: 4.9,
    time: 'Live',
    category: 'Gaming'
  },
  {
    id: '2',
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumb: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2670&auto=format&fit=crop',
    isLive: true,
    author: 'ChilledCowboy',
    views: '12K',
    rating: 4.8,
    time: 'Live',
    category: 'Music'
  },
  {
    id: '3',
    title: 'Building a React App in 30 Minutes',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumb: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop',
    isLive: false,
    author: 'DevMaster',
    views: '1.2M',
    rating: 4.7,
    time: '30:21',
    category: 'IRL'
  },
  {
    id: '4',
    title: 'VALORANT Champions Tour 2024 - Grand Finals',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumb: 'https://images.unsplash.com/photo-1533236897111-512635af748b?q=80&w=2669&auto=format&fit=crop',
    isLive: true,
    author: 'ValorantEsports',
    views: '350K',
    rating: 5.0,
    time: 'Live',
    category: 'Gaming'
  },
  {
    id: '5',
    title: 'Deep House Mix 2025 | Summer Vibes',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumb: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2670&auto=format&fit=crop',
    isLive: false,
    author: 'SoundWaves',
    views: '89K',
    rating: 4.5,
    time: '1:45:00',
    category: 'Music'
  },
  {
    id: '6',
    title: 'Speedrun: Elden Ring Any% No Hit',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumb: 'https://images.unsplash.com/photo-1593305841991-05c29736cef7?q=80&w=2574&auto=format&fit=crop',
    isLive: false,
    author: 'SoulsBorne',
    views: '500K',
    rating: 4.9,
    time: '2:15:30',
    category: 'Gaming'
  }
];

// --- 2. STATE MANAGEMENT (Context + Reducer) ---

type Action =
  | { type: 'SET_SELECTED_VIDEO'; payload: Video | null }
  | { type: 'SET_FILTER'; payload: string }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Video[] }
  | { type: 'SET_APP'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SEARCH_QUERY'; payload: string };

const initialState: AppState = {
  items: [],
  status: 'idle',
  selectedVideo: null,
  filter: 'All',
  currentApp: 'Stream',
  isSidebarOpen: true,
  searchQuery: '',
};

const TVContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

const tvReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading' };
    case 'FETCH_SUCCESS':
      return { ...state, status: 'succeeded', items: action.payload };
    case 'SET_SELECTED_VIDEO':
      return { ...state, selectedVideo: action.payload };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_APP':
      return { ...state, currentApp: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

// --- 3. UI COMPONENTS ---

const PhoenixPlayer = ({ video, onClose }: { video: Video, onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true); // Auto-play
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Auto-play fix for some browsers
    if (videoRef.current) {
        videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      setVolume(newVol);
      setIsMuted(newVol === 0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-0 md:p-8"
    >
      <div className="w-full h-full max-w-[1600px] max-h-[90vh] bg-[#0a0a0a] md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col lg:flex-row relative">
        
        {/* Video Area */}
        <div className="flex-1 relative bg-black group flex flex-col justify-center">
            {/* Native Video Element */}
            <video
                ref={videoRef}
                src={video.url}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                loop
                onClick={togglePlay}
            />

            {/* Custom Overlay Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between pointer-events-none">
                
                {/* Top Bar */}
                <div className="p-6 flex justify-between items-start pointer-events-auto">
                    <div className="flex gap-3">
                        {video.isLive && (
                            <span className="bg-red-600 px-3 py-1 rounded text-xs font-bold text-white flex items-center gap-2 animate-pulse">
                                <span className="w-2 h-2 bg-white rounded-full" /> LIVE
                            </span>
                        )}
                         <span className="bg-white/10 backdrop-blur px-3 py-1 rounded text-xs font-bold text-white flex items-center gap-2">
                             {video.category}
                        </span>
                    </div>
                    <button onClick={onClose} className="p-2 bg-black/40 backdrop-blur-md rounded-full hover:bg-white/20 text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Center Play Button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                    {!isPlaying && (
                         <motion.button 
                         initial={{ scale: 0.5, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         onClick={togglePlay}
                         className="w-20 h-20 bg-orange-600/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                             <Play size={32} fill="white" className="ml-1" />
                         </motion.button>
                    )}
                </div>

                {/* Bottom Bar */}
                <div className="p-6 pointer-events-auto">
                    {/* Progress Bar */}
                    <div 
                        className="w-full bg-white/20 h-1.5 rounded-full mb-4 cursor-pointer relative group/progress"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const pos = (e.clientX - rect.left) / rect.width;
                            if (videoRef.current) videoRef.current.currentTime = pos * videoRef.current.duration;
                        }}
                    >
                        <div className="absolute top-0 left-0 h-full bg-orange-600 rounded-full" style={{ width: `${progress}%` }} />
                        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow opacity-0 group-hover/progress:opacity-100" style={{ left: `${progress}%` }} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button onClick={togglePlay} className="text-white hover:text-orange-500 transition-colors">
                                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                            </button>
                            <button className="text-white hover:text-orange-500 transition-colors">
                                <SkipForward size={24} />
                            </button>
                            
                            {/* Volume Control */}
                            <div className="flex items-center gap-3 group/vol">
                                <button onClick={() => handleVolumeChange(isMuted ? 0.8 : 0)}>
                                    <Volume2 size={24} className={`text-white ${isMuted ? 'opacity-50' : ''}`} />
                                </button>
                                <div className="w-0 overflow-hidden group-hover/vol:w-24 transition-all duration-300">
                                    <input 
                                        type="range" 
                                        min="0" max="1" step="0.1" 
                                        value={volume}
                                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                        className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-orange-500" 
                                    />
                                </div>
                            </div>

                            <span className="text-sm font-mono text-white/70 tracking-wider">
                                {videoRef.current ? 
                                    `${Math.floor(videoRef.current.currentTime / 60)}:${Math.floor(videoRef.current.currentTime % 60).toString().padStart(2, '0')} / ${video.isLive ? 'LIVE' : Math.floor(videoRef.current.duration / 60) + ':' + Math.floor(videoRef.current.duration % 60).toString().padStart(2, '0')}` 
                                    : '0:00 / 0:00'}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-white/70">
                            <button className="hover:text-white transition-colors" title="Cast to device"><Cast size={22} /></button>
                            <button className="hover:text-white transition-colors" title="Settings"><Settings size={22} /></button>
                            <button className="hover:text-white transition-colors" title="Fullscreen"><Maximize size={22} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Sidebar / Chat */}
        <div className="hidden lg:flex w-96 bg-[#111] flex-col border-l border-white/5">
             <div className="p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white leading-tight mb-2 line-clamp-2">{video.title}</h2>
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white text-xs">
                            {video.author.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-orange-500 text-sm font-medium">{video.author}</span>
                   </div>
                   <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded text-yellow-500">
                     <Star size={14} fill="currentColor" />
                     <span className="text-xs font-bold">{video.rating}</span>
                   </div>
                </div>
                <div className="flex gap-2">
                    <button className="flex-1 bg-white text-black text-sm font-bold py-2 rounded-lg hover:bg-gray-200 transition-colors">Subscribe</button>
                    <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20"><Share2 size={20} /></button>
                </div>
             </div>
             
             {/* Chat Area */}
             <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col-reverse custom-scrollbar">
                {[...Array(8)].map((_, i) => (
                   <div key={i} className="flex gap-3 text-sm animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${['bg-blue-500', 'bg-green-500', 'bg-purple-500'][i % 3]}`}>
                          U{i}
                      </div>
                      <div>
                        <span className="font-bold text-white/90 mr-2">User_{992 + i}:</span>
                        <span className="text-white/60">
                            {['This is insane! 🔥', 'Can you play the other map?', 'GG WP', 'Wait for it...', 'What specs are you running?', 'Legendary move'][i % 6]}
                        </span>
                      </div>
                   </div>
                ))}
                <div className="text-center py-4 text-white/20 text-xs uppercase tracking-widest font-mono">Chat Room Initialized</div>
             </div>

             <div className="p-4 bg-[#0a0a0a] border-t border-white/5 relative">
                <input type="text" placeholder="Send a message..." className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-zinc-600" />
                <button className="absolute right-6 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-400">
                    <MessageSquare size={20} />
                </button>
             </div>
        </div>
      </div>
    </motion.div>
  )
}

const VideoCard = ({ video, onClick }: { video: Video, onClick: () => void }) => {
    return (
    <motion.div 
        layoutId={`video-${video.id}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        onClick={onClick}
        className="group relative bg-[#121212] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-orange-500/30 transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(249,115,22,0.15)]"
    >
        <div className="aspect-video relative overflow-hidden">
            <img src={video.thumb} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
            
            {/* Play Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                <div className="w-14 h-14 rounded-full bg-orange-600 flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
                    <Play fill="white" className="ml-1 text-white" size={24} />
                </div>
            </div>

            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-md rounded text-[10px] font-bold font-mono text-white tracking-wide">
                {video.isLive ? 
                    <span className="text-red-500 flex items-center gap-1 uppercase"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>Live</span> 
                    : video.time}
            </div>
        </div>
        
        <div className="p-4">
            <div className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-full bg-neutral-800 shrink-0 overflow-hidden border border-white/10">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.author}`} alt={video.author} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold leading-tight text-neutral-100 group-hover:text-orange-400 transition-colors mb-1 truncate">{video.title}</h3>
                    <div className="flex flex-col text-xs text-neutral-400 gap-0.5">
                        <span className="font-medium hover:text-white transition-colors">{video.author}</span>
                        <div className="flex items-center gap-2">
                            <span>{video.views} views</span>
                            <span className="w-1 h-1 bg-neutral-600 rounded-full"></span>
                            <span>{video.isLive ? 'Now' : '2 days ago'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
)};

const Sidebar = () => {
    const context = useContext(TVContext);
    if (!context) return null;
    const { state, dispatch } = context;

    const apps = [
        { id: 'Stream', icon: MonitorPlay, label: 'Stream' },
        { id: 'Tunes', icon: Music2, label: 'Tunes' },
        { id: 'Arcade', icon: Gamepad2, label: 'Arcade' },
        { id: 'Assets', icon: FolderOpen, label: 'Assets' },
    ];

    return (
        <motion.div 
            animate={{ width: state.isSidebarOpen ? 240 : 80 }}
            className={`fixed hidden md:flex flex-col py-6 z-50 bg-[#050202] border-r border-white/5 h-screen shrink-0 top-0`}
        >
             <div className="mb-10 px-6 flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                    <Flame className="text-white" size={20} fill="currentColor" />
                </div>
                {state.isSidebarOpen && (
                    <motion.span 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="font-black text-xl tracking-tighter text-white"
                    >
                        PHOENIX
                    </motion.span>
                )}
            </div>

            <nav className="flex-1 flex flex-col gap-2 w-full px-3">
                <div className="px-4 mb-2 text-xs font-bold text-neutral-500 uppercase tracking-widest">{state.isSidebarOpen ? 'Menu' : '-'}</div>
                {apps.map((app) => (
                    <button 
                        key={app.id}
                        onClick={() => dispatch({ type: 'SET_APP', payload: app.id })}
                        className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${state.currentApp === app.id ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                    >
                        {state.currentApp === app.id && (
                             <motion.div layoutId="active-pill" className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r-full" />
                        )}
                        <app.icon size={22} className={`${state.currentApp === app.id ? 'text-orange-500' : 'group-hover:scale-110 transition-transform'}`} />
                        {state.isSidebarOpen && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium">{app.label}</motion.span>
                        )}
                    </button>
                ))}
            </nav>

             <div className="mt-auto px-4">
                 <div className={`p-4 rounded-2xl bg-gradient-to-br from-neutral-900 to-black border border-white/5 ${!state.isSidebarOpen && 'hidden'}`}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                            <Trophy size={18} />
                        </div>
                        <div>
                            <div className="text-xs text-neutral-400">Pro Plan</div>
                            <div className="text-sm font-bold text-white">Active</div>
                        </div>
                    </div>
                    <button className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 transition-colors">Manage</button>
                 </div>
                 
                 <div className="mt-6 flex items-center gap-3 px-2 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
                    <div className="w-9 h-9 rounded-full bg-neutral-800 border border-white/10 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=PhoenixAdmin" alt="User" />
                    </div>
                    {state.isSidebarOpen && (
                        <div className="flex-1 overflow-hidden">
                            <div className="text-sm font-bold text-white truncate">Alex Doe</div>
                            <div className="text-xs text-neutral-500 truncate">alex@phoenix.tv</div>
                        </div>
                    )}
                 </div>
            </div>
        </motion.div>
    );
};

const Header = () => {
    const context = useContext(TVContext);
    if (!context) return null;
    const { state, dispatch } = context;

    return (
        <header className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between bg-[#050202]/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center gap-6 flex-1">
                 <button onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} className="hidden md:block text-neutral-400 hover:text-white transition-colors">
                    <LayoutGrid size={22} />
                </button>
                 <button className="md:hidden text-neutral-400 hover:text-white transition-colors">
                    <Menu size={24} />
                </button>
                
                <div className="relative group w-full max-w-md hidden sm:block">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-neutral-500 group-focus-within:text-orange-500 transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        value={state.searchQuery}
                        onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                        placeholder={`Search ${state.currentApp}...`} 
                        className="w-full bg-[#1a1a1a] border border-white/5 rounded-full py-2.5 pl-12 pr-6 text-sm text-white focus:outline-none focus:bg-[#222] focus:border-orange-500/50 transition-all shadow-inner placeholder:text-neutral-600"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                    <Bell size={22} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050202]"></span>
                </button>
                <button className="hidden sm:flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-95">
                    <span>Upload</span>
                    <ChevronRight size={16} />
                </button>
            </div>
        </header>
    );
};

// --- 4. APP SECTIONS ---

const StreamApp = () => {
    const context = useContext(TVContext);
    if (!context) return null;
    const { state, dispatch } = context;
    const { items, status, filter, searchQuery } = state;

    // Filter Logic
    const filteredItems = items.filter(item => {
        const matchesCategory = filter === 'All' || item.category === filter || (filter === 'Live' && item.isLive);
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Loading State
    if (status === 'loading') {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 animate-pulse">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white/5 rounded-2xl aspect-video relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Featured Hero */}
            {filter === 'All' && !searchQuery && (
                <div className="relative w-full h-[400px] rounded-3xl overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Featured" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-4 inline-block">Featured Stream</span>
                        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">Cyberpunk 2077: <br/>Night City Wire</h1>
                        <p className="text-neutral-300 text-lg mb-8 line-clamp-2">Join us for the latest updates on the Phantom Liberty expansion, developer interviews, and exclusive gameplay reveal.</p>
                        <div className="flex gap-4">
                            <button className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-neutral-200 transition-colors flex items-center gap-2">
                                <Play size={20} fill="black" /> Watch Now
                            </button>
                             <button className="bg-white/10 backdrop-blur text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white/20 transition-colors">
                                + Playlist
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Filter */}
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar sticky top-[72px] z-30 py-2 bg-[#050202]/95 backdrop-blur-sm -mx-2 px-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => dispatch({ type: 'SET_FILTER', payload: cat })}
                        className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                            filter === cat 
                            ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                            : "bg-[#1a1a1c] text-zinc-400 border-transparent hover:bg-[#27272a] hover:text-white"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredItems.map((video) => (
                        <VideoCard key={video.id} video={video} onClick={() => dispatch({ type: 'SET_SELECTED_VIDEO', payload: video })} />
                    ))}
                </AnimatePresence>
                {filteredItems.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Search size={32} className="text-neutral-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No streams found</h3>
                        <p className="text-neutral-500">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ArcadeApp = () => {
    return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-white tracking-tight">Arcade <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Legends</span></h2>
            <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-full font-bold transition-colors">View All Games</button>
        </div>
        
        <div className="bg-gradient-to-r from-blue-900/40 to-black rounded-[40px] p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
             <div className="w-full md:w-1/2 relative z-10 space-y-6">
                <span className="bg-blue-500/20 text-blue-300 font-bold px-4 py-2 rounded-full text-xs uppercase tracking-wider border border-blue-500/30">New Season</span>
                <h3 className="text-4xl md:text-6xl font-black leading-[0.9]">Pro League <br/><span className="text-blue-500">Winter Clash</span></h3>
                <p className="text-zinc-300 text-lg font-medium max-w-md">Compete in daily challenges, climb the leaderboard, and win exclusive animated skins.</p>
                <div className="flex gap-4 pt-4">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-full font-black text-lg shadow-lg shadow-blue-600/30 transition-all flex items-center gap-3"><Trophy size={20} /> Join Tournament</button>
                    <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3.5 rounded-full font-bold transition-all">Leaderboard</button>
                </div>
             </div>
             <div className="w-full md:w-1/2 flex justify-center z-10">
                <motion.div animate={{ rotate: [0, 5, 0, -5, 0], y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                    <Gamepad2 size={240} className="text-blue-500 drop-shadow-[0_0_60px_rgba(59,130,246,0.6)]" strokeWidth={1} />
                </motion.div>
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
                <div key={i} className="bg-[#121212] rounded-3xl p-6 border border-white/5 hover:border-blue-500/50 transition-all duration-300 group hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Gamepad2 size={24} />
                        </div>
                        <span className="text-xs font-bold bg-white/5 px-3 py-1 rounded-full text-white/50">{i === 1 ? 'Live Now' : 'Starts 20:00'}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">Cyber Racer 2077</h3>
                    <p className="text-sm text-neutral-500 mb-6">High-octane racing in a neon-drenched metropolis.</p>
                    <div className="flex items-center -space-x-2">
                        {[...Array(3)].map((_, j) => (
                             <div key={j} className="w-8 h-8 rounded-full border-2 border-[#121212] bg-neutral-800 flex items-center justify-center text-[10px] text-white">
                                {j+1}
                             </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-[#121212] bg-neutral-800 flex items-center justify-center text-[10px] text-white font-bold">+4k</div>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
    );
};

const TunesApp = () => {
    return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto h-[calc(100vh-140px)]">
        <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            <header className="flex items-center justify-between">
                <h2 className="text-4xl font-black text-white tracking-tight">Your <span className="text-purple-500">Mix</span></h2>
                <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-white"><Settings size={20} /></button>
            </header>
            
            <div className="grid grid-cols-1 gap-3">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group border border-transparent hover:border-white/5">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0 relative overflow-hidden">
                            <Music2 className="text-white relative z-10" size={24} />
                            <div className="absolute inset-0 bg-black/10" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors">Midnight City</h4>
                            <p className="text-xs text-neutral-400">M83 • Hurry Up, We're Dreaming</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-6 text-neutral-500">
                             <span className="text-xs">1,240,492 plays</span>
                             <span className="text-xs font-mono">4:03</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="hover:text-white p-2"><Heart size={18} /></button>
                            <button className="hover:text-white p-2"><MoreVertical size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <motion.div 
            initial={{ x: 50, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ delay: 0.2, type: "spring" }} 
            className="w-full md:w-[400px] shrink-0 bg-[#121214]/80 backdrop-blur-2xl border border-white/5 rounded-[40px] p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden h-fit"
        >
            <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b from-purple-600/10 to-transparent pointer-events-none" />
            
            <div className="w-72 h-72 rounded-[32px] bg-gradient-to-br from-purple-500 to-indigo-600 mb-8 shadow-[0_20px_60px_-10px_rgba(88,28,135,0.4)] flex items-center justify-center relative z-10 group cursor-pointer">
                <Headphones size={80} className="text-white opacity-80" />
                <div className="absolute inset-0 bg-black/10 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* Visualizer bars */}
                <div className="absolute bottom-8 flex gap-1.5 items-end h-16 opacity-50">
                    {[...Array(10)].map((_,i) => (
                        <motion.div 
                            key={i} 
                            animate={{ height: [10, 40, 15, 50, 20] }} 
                            transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, repeatType: "mirror" }} 
                            className="w-1.5 bg-white rounded-full" 
                        />
                    ))}
                </div>
            </div>
            
            <div className="mb-8 w-full">
                <h3 className="text-2xl font-black text-white mb-1">Neon Nights</h3>
                <p className="text-purple-400 font-medium text-sm">Synthwave Collective</p>
            </div>

            <div className="w-full space-y-4 mb-10">
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden cursor-pointer group">
                    <motion.div className="bg-purple-500 h-full w-2/3 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500 font-bold font-mono tracking-wider">
                    <span>2:14</span>
                    <span>3:45</span>
                </div>
            </div>

            <div className="flex items-center justify-between w-full px-6">
                <button className="text-zinc-400 hover:text-white transition-colors"><Disc size={24} /></button>
                <div className="flex items-center gap-6">
                    <button className="text-white hover:text-purple-400 transition-colors"><Play size={24} className="rotate-180 fill-current" /></button>
                    <button className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                        <Play size={24} fill="black" className="ml-1" />
                    </button>
                    <button className="text-white hover:text-purple-400 transition-colors"><Play size={24} className="fill-current" /></button>
                </div>
                <button className="text-zinc-400 hover:text-white transition-colors"><Mic2 size={24} /></button>
            </div>
        </motion.div>
    </motion.div>
    );
};

// --- 5. MAIN CONTENT ---

function PhoenixContent() {
    const context = useContext(TVContext);
    if (!context) throw new Error("PhoenixContent must be used within TVProvider");
    const { state, dispatch } = context;

    useEffect(() => {
        // Simulation of API Fetch
        const loadData = async () => {
            dispatch({ type: 'FETCH_START' });
            await new Promise(r => setTimeout(r, 1500)); // Fake network delay
            dispatch({ type: 'FETCH_SUCCESS', payload: MOCK_VIDEOS });
        };
        loadData();
    }, [dispatch]);

    return (
        <div className="min-h-screen w-full bg-[#050202] text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
          
          {/* Dynamic Backgrounds */}
          <motion.div 
            animate={{ 
                background: state.currentApp === 'Arcade' ? 'linear-gradient(to bottom, rgba(30,58,138,0.15), transparent)' 
                    : state.currentApp === 'Tunes' ? 'linear-gradient(to bottom, rgba(88,28,135,0.15), transparent)' 
                    : 'linear-gradient(to bottom, rgba(124,45,18,0.15), transparent)' 
            }} 
            className="fixed top-0 left-0 w-full h-[600px] pointer-events-none z-0 transition-all duration-1000" 
          />
          
          <div className={`fixed top-[-20%] right-[-10%] w-[800px] h-[800px] ${state.currentApp === 'Arcade' ? 'bg-blue-600/10' : state.currentApp === 'Tunes' ? 'bg-purple-600/10' : 'bg-red-600/10'} rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen transition-colors duration-1000`} />
          <div className={`fixed bottom-[-20%] left-[-10%] w-[600px] h-[600px] ${state.currentApp === 'Arcade' ? 'bg-cyan-600/10' : state.currentApp === 'Tunes' ? 'bg-indigo-600/10' : 'bg-orange-600/10'} rounded-full blur-[150px] pointer-events-none z-0 transition-colors duration-1000`} />

          <div className="flex relative z-10 min-h-screen">
            <Sidebar />
            
            <main className="flex-1 flex flex-col ml-60 w-full min-w-0 relative">
                 <Header />
                 <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1920px] mx-auto w-full">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={state.currentApp} 
                            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }} 
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} 
                            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }} 
                            transition={{ duration: 0.3 }} 
                            className="w-full h-full"
                        >
                            {state.currentApp === 'Stream' && <StreamApp />}
                            {state.currentApp === 'Arcade' && <ArcadeApp />}
                            {state.currentApp === 'Tunes' && <TunesApp />}
                            {state.currentApp === 'Assets' && (
                                <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500">
                                    <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
                                        <FolderOpen size={80} className="mb-6 opacity-30" />
                                    </motion.div>
                                    <h2 className="text-3xl font-black text-zinc-400 mb-2">Design Assets</h2>
                                    <p className="text-lg font-medium">Connect your cloud storage to view files.</p>
                                    <button className="mt-8 px-8 py-3 bg-zinc-800 rounded-full font-bold hover:bg-zinc-700 transition-colors text-white">Connect Drive</button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                 </div>
            </main>
          </div>

          <AnimatePresence>
            {state.selectedVideo && (
                <PhoenixPlayer 
                    video={state.selectedVideo} 
                    onClose={() => dispatch({ type: 'SET_SELECTED_VIDEO', payload: null })} 
                />
            )}
          </AnimatePresence>
        </div>
    );
}

// --- APP ENTRY ---
const PhoenixFireApp = () => {
    const [state, dispatch] = useReducer(tvReducer, initialState);

    return (
        <TVContext.Provider value={{ state, dispatch }}>
            <PhoenixContent />
        </TVContext.Provider>
    );
}

export default PhoenixFireApp;