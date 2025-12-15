'use client'

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Search, 
  Menu, 
  Bell, 
  Flame, 
  Compass, 
  History, 
  Clock, 
  Gamepad2,
  Music2,
  MonitorPlay,
  FolderOpen,
  Mic2,
  Trophy,
  Users,
  Settings,
  Disc,
  Headphones,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HLS_STREAMS } from '../data/videos';
import { AlbumCard, GameCard, VideoCard } from '../components/card';
import { PhoenixPlayer, Playlist } from '../components/phoenix-player';
import { Sidebar } from '../components/sidebar';

// --- Types ---
// In a real app, these would be in a separate types file
// type AppType = 'Stream' | 'Tunes' | 'Arcade' | 'Assets';
// type Category = 'All' | 'Live' | 'Gaming' | 'Music' | 'Mixes';

// --- Mock Data & HLS Streams ---
const CATEGORIES = ['All'];
const FEATURED_AMT = 10;

// 'Live', 'Gaming', 'Music', 'Mixes', 'React', 'Tailwind', 'Design'

// Real HLS Test Streams for Demo
// const HLS_STREAMS = [
//     { id: 'stream1', title: "Phoenix Live: Main Stage", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", thumb: "bg-gradient-to-br from-orange-600 to-red-900" },
//     { id: 'stream2', title: "Sintel: The Journey", url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8", thumb: "bg-gradient-to-bl from-red-600 via-orange-500 to-yellow-500" },
//     { id: 'stream3', title: "Big Buck Bunny 4K", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", thumb: "bg-gradient-to-tr from-slate-900 via-purple-900 to-slate-900" },
// ];

function randInt({ min = 0, max} : { min?: number, max: number  }) : number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const featured: { id: string; title: string; url: string; thumb: string; src: string; thumbnail: string; }[] = []
for (let i = 0; i < FEATURED_AMT; i++) {
    const ret = HLS_STREAMS[randInt({ max: HLS_STREAMS.length - 1})]
    const out = {
        ...ret,
        src: ret.url,
        thumbnail: 'https://picsum.photos/400/240?random'
    }
    featured.push(out)
}

const GAMES = [
  { id: 101, title: "Ember Knights", genre: "Roguelite", rating: "4.9", players: "12K Playing", thumbnail: "bg-gradient-to-b from-orange-900 to-black" },
  { id: 102, title: "Neon Abyss", genre: "Platformer", rating: "4.7", players: "8K Playing", thumbnail: "bg-gradient-to-br from-purple-900 to-blue-900" },
  { id: 103, title: "Cyber Drift", genre: "Racing", rating: "4.8", players: "15K Playing", thumbnail: "bg-gradient-to-tr from-cyan-900 to-blue-800" },
  { id: 104, title: "Flame Core", genre: "FPS", rating: "4.5", players: "22K Playing", thumbnail: "bg-gradient-to-bl from-red-900 to-orange-800" },
];

const ALBUMS = [
  { id: 201, title: "Midnight Heat", artist: "The Blaze", tracks: 12, cover: "bg-gradient-to-tr from-orange-500 to-yellow-500" },
  { id: 202, title: "Glass Heart", artist: "Prism", tracks: 8, cover: "bg-gradient-to-br from-blue-400 to-purple-500" },
  { id: 203, title: "Red Shift", artist: "Doppler", tracks: 10, cover: "bg-gradient-to-b from-red-600 to-black" },
  { id: 204, title: "Void Space", artist: "Null Pointer", tracks: 14, cover: "bg-zinc-800" },
];

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 12 }
    }
};



// --- App Views ---

const StreamApp = ({ category, setCategory, onVideoSelect }: { category: string, setCategory: (category: string) => void, onVideoSelect: (video: any) => void }) => {
    
    const handleVideoSelect = (video: { id: string; title: string; url: string; thumb: string; src: string; thumbnail: string; }) => {
        console.log('Video selected:', video);
        onVideoSelect(video);
    }
    
    return (
    <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
    >
        {/* Navigation Pills */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mask-fade-right sticky top-0 z-20 pt-2 -mt-2 bg-gradient-to-b from-[#050202] via-[#050202]/95 to-transparent px-2">
            {CATEGORIES.map((cat) => (
                <motion.button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border-2 shrink-0 ${
                        category === cat 
                        ? "bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.3)]" 
                        : "bg-[#1a1a1c] text-zinc-400 border-transparent hover:bg-[#27272a] hover:text-white hover:border-white/20"
                    }`}
                >
                    {cat}
                </motion.button>
            ))}
        </div>

        {/* Hero Section */}
        {category === 'All' && (
             <motion.div 
                variants={itemVariants}
                className="w-full h-[450px] rounded-[48px] relative overflow-hidden group shadow-2xl shadow-orange-900/20 ring-1 ring-white/5 mx-auto transform transition-all"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-red-950 via-orange-950 to-black z-0 scale-105 group-hover:scale-100 transition-transform duration-[2s]" />
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                
                {/* Floating Elements */}
                <motion.div 
                    animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px]" 
                />

                <div className="absolute inset-0 z-10 p-12 flex flex-col justify-end items-start bg-gradient-to-t from-black via-black/40 to-transparent">
                    <motion.span 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-red-600/90 backdrop-blur-xl border border-red-400/30 text-white text-xs font-black tracking-widest px-4 py-2 rounded-full mb-6 flex items-center gap-2 shadow-lg shadow-red-900/50"
                    >
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        LIVE EVENT
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-6xl md:text-7xl font-black mb-4 tracking-tight leading-[0.9]"
                    >
                        Phoenix <br /> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-200">Rises Again.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-zinc-200 max-w-lg mb-8 text-lg font-medium"
                    >
                        Join the 24/7 lo-fi coding stream. Experience the heat of development in real-time.
                    </motion.p>
                    <motion.button 
                        onClick={() => onVideoSelect(featured[0])}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,255,255,0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-black text-lg hover:bg-zinc-100 transition-colors group/btn"
                    >
                        <Play size={24} fill="black" /> 
                        <span>Watch Stream</span>
                        <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                    </motion.button>
                </div>
            </motion.div>
        )}

        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featured.map((video, index) => (
                <VideoCard key={video.id || index} video={video} onClick={() => handleVideoSelect(video)} itemVariants={itemVariants} />
            ))}
        </motion.div>
    </motion.div>
);
}

const ArcadeApp = () => (
    <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
    >
        <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-white tracking-tight">Arcade <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Legends</span></h2>
            <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-full font-bold transition-colors">View All Games</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {GAMES.map(game => <GameCard key={game.id} game={game} />)}
        </div>
        
        <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-zinc-900 to-black rounded-[48px] p-10 border border-white/5 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group"
        >
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
             
             <div className="w-full md:w-1/2 relative z-10 space-y-6">
                <span className="bg-blue-500/20 text-blue-300 font-bold px-4 py-2 rounded-full text-xs uppercase tracking-wider border border-blue-500/30">New Season</span>
                <h3 className="text-4xl md:text-5xl font-black leading-tight">Pro Tournaments <br/><span className="text-blue-500">Winter Clash</span></h3>
                <p className="text-zinc-400 text-lg font-medium">Compete in daily challenges, climb the leaderboard, and win exclusive animated skins.</p>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-black text-lg shadow-lg shadow-blue-600/30 transition-all flex items-center gap-3"
                >
                    <Trophy size={20} /> Join Tournament
                </motion.button>
             </div>
             
             <div className="w-full md:w-1/2 flex justify-center z-10">
                <motion.div 
                    animate={{ rotate: [0, 10, 0, -10, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Gamepad2 size={200} className="text-blue-500 drop-shadow-[0_0_50px_rgba(59,130,246,0.5)]" />
                </motion.div>
             </div>
        </motion.div>
    </motion.div>
);

const TunesApp = () => (
    <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row gap-8 h-[calc(100vh-140px)]"
    >
        <div className="flex-1 space-y-8 overflow-y-auto pr-2">
            <header className="flex items-center justify-between">
                <h2 className="text-4xl font-black text-white tracking-tight">Your <span className="text-orange-500">Mix</span></h2>
                <div className="flex gap-2">
                    <button className="p-3 bg-white/5 rounded-full hover:bg-white/10"><Settings size={20} /></button>
                </div>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ALBUMS.map(album => <AlbumCard key={album.id} album={album} />)}
                {ALBUMS.map(album => <AlbumCard key={`rep-${album.id}`} album={{...album, title: album.title + " (Remix)"}} />)}
            </div>
        </div>

        {/* Music Player Side Panel */}
        <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-full md:w-[380px] shrink-0 bg-[#121214]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
            
            <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-64 h-64 rounded-[32px] bg-gradient-to-br from-orange-500 to-red-600 mb-8 shadow-[0_20px_50px_rgba(234,88,12,0.3)] flex items-center justify-center relative z-10 group"
            >
                <Music2 size={80} className="text-white opacity-80" />
                <div className="absolute inset-0 bg-black/10 rounded-[32px]" />
                {/* Visualizer bars mock */}
                <div className="absolute bottom-6 flex gap-1 items-end h-12">
                    {[...Array(8)].map((_,i) => (
                        <motion.div 
                            key={i}
                            animate={{ height: [10, 30, 15, 40, 20] }}
                            transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, repeatType: "mirror" }}
                            className="w-1.5 bg-white/80 rounded-full"
                        />
                    ))}
                </div>
            </motion.div>

            <h3 className="text-2xl font-black text-white mb-2">Neon Nights</h3>
            <p className="text-zinc-400 font-medium text-lg mb-8">Synthwave Collective</p>
            
            <div className="w-full space-y-4 mb-10">
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden cursor-pointer group">
                    <motion.div 
                        layoutId="progBar" 
                        className="bg-orange-500 h-full w-2/3 relative"
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                </div>
                <div className="flex justify-between text-xs text-zinc-500 font-bold font-mono">
                    <span>2:14</span>
                    <span>3:45</span>
                </div>
            </div>

            <div className="flex items-center justify-between w-full px-4">
                 <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-zinc-400 hover:text-white"><Disc size={24} /></motion.button>
                 <div className="flex items-center gap-6">
                     <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-white"><Play size={28} className="rotate-180 fill-white" /></motion.button>
                     <motion.button 
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.95 }}
                        className="w-20 h-20 rounded-[28px] bg-white text-black flex items-center justify-center shadow-xl shadow-white/10"
                    >
                        <Play size={32} fill="black" className="ml-1" />
                     </motion.button>
                     <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-white"><Play size={28} className="fill-white" /></motion.button>
                 </div>
                 <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-zinc-400 hover:text-white"><Mic2 size={24} /></motion.button>
            </div>
        </motion.div>
    </motion.div>
);

// --- Main App Component ---

export default function AuroraApp() {
  const [currentApp, setCurrentApp] = useState('Stream');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className="min-h-screen min-wscreen bg-[#050202] text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
      
      {/* --- Ambient Background Glows --- */}
      <motion.div 
        animate={{ 
            background: currentApp === 'Arcade' 
                ? 'linear-gradient(to bottom, rgba(30,58,138,0.15), transparent)' 
                : currentApp === 'Tunes' 
                ? 'linear-gradient(to bottom, rgba(88,28,135,0.15), transparent)' 
                : 'linear-gradient(to bottom, rgba(124,45,18,0.15), transparent)'
        }}
        className="fixed top-0 left-0 w-full h-[600px] pointer-events-none z-0 transition-colors duration-1000" 
      />
      
      {/* Floating Blobs */}
      <div className={`fixed -top-40 right-0 w-[800px] h-[800px] ${currentApp === 'Arcade' ? 'bg-blue-600/10' : 'bg-red-600/10'} rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen transition-colors duration-1000`} />
      
      {/* --- Video Player Overlay --- */}
      <AnimatePresence>
        {selectedVideo && (
            <PhoenixPlayer 
                selectedVideo={selectedVideo}
                setSelectedVideo={setSelectedVideo}
                onNext={() => {}}
                onClose={() => setSelectedVideo(null)}
            />
        )}
      </AnimatePresence>
      

      <div className="flex relative z-10">
        
        <Sidebar setCurrentApp={setCurrentApp} currentApp={currentApp} isSidebarOpen={isSidebarOpen} />
        
        {/* <div className="top-0 end-0 h-screen z-[999] overflow-hidden">
            <Playlist setSelectedVideo={setSelectedVideo} />
        </div> */}

        {/* --- Main Content Area --- */}
        <main className="flex-1 p-6 md:p-10 overflow-x-hidden w-full relative min-h-[calc(100vh-84px)]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentApp}
                    initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                >
                    {currentApp === 'Stream' && (
                        <StreamApp 
                            category={activeCategory} 
                            setCategory={setActiveCategory} 
                            onVideoSelect={setSelectedVideo}
                        />
                    )}
                    {currentApp === 'Arcade' && <ArcadeApp />}
                    {currentApp === 'Tunes' && <TunesApp />}
                    {currentApp === 'Assets' && (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500">
                            <motion.div 
                                animate={{ y: [0, -20, 0] }} 
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <FolderOpen size={80} className="mb-6 opacity-30" />
                            </motion.div>
                            <h2 className="text-3xl font-black text-zinc-400 mb-2">Design Assets</h2>
                            <p className="text-lg font-medium">Connect your cloud storage to view files.</p>
                            <button className="mt-6 px-8 py-3 bg-zinc-800 rounded-full font-bold hover:bg-zinc-700 transition-colors">Connect Drive</button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </main>
      </div>
    </div>
  );
}