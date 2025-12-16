import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize, Minimize, Pause, Play, Settings, SkipForward, Volume2, VolumeX, X, AlertCircle } from 'lucide-react';

const PhoenixPlayer = ({ onClose, onNext, video }) => {
    // --- State ---
    const [playing, setPlaying] = useState(true);
    const [volume, setVolume] = useState(1.0);
    const [muted, setMuted] = useState(false);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    // Data & Status States
    const [error, setError] = useState(null);
    
    // Loading Logic: Tracks if we are fetching JSON OR if the video is buffering
    const [isFetching, setIsFetching] = useState(false);
    const [isBuffering, setIsBuffering] = useState(true);

    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    // --- Helpers ---
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return "00:00";
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, '0');
        return hh ? `${hh}:${mm.toString().padStart(2, '0')}:${ss}` : `${mm}:${ss}`;
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (playing) setShowControls(false);
        }, 3000);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen?.().catch(console.error);
            setIsFullscreen(true);
        } else {
            document.exitFullscreen?.();
            setIsFullscreen(false);
        }
    };

    const handleSeek = (e) => {
        if (!duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const seekFraction = x / width;
        setPlayed(seekFraction);
        playerRef.current?.seekTo(seekFraction);
    };

    // Combined Loading State
    const isLoading = isFetching || isBuffering;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
            >
                <div 
                    ref={containerRef}
                    className="relative w-full max-w-6xl aspect-video bg-black rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(234,88,12,0.3)] ring-1 ring-white/10 group"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => playing && setShowControls(false)}
                >
                    {/* --- ERROR STATE --- */}
                    {error && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 text-white">
                            <AlertCircle size={48} className="text-red-500 mb-4" />
                            <h3 className="text-xl font-bold">Unable to play stream</h3>
                            <p className="text-gray-400 mt-2">{error}</p>
                            <button onClick={onClose} className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full">
                                Close Player
                            </button>
                        </div>
                    )}

                    {/* --- LOADING SPINNER --- */}
                    {isLoading && !error && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    <ReactPlayer
                        ref={playerRef}
                        url={video.url}
                        width="100%"
                        height="100%"
                        playing={playing}
                        volume={muted ? 0 : volume}
                        muted={muted}
                        
                        // Handlers for Buffering/Ready States
                        onReady={() => setIsBuffering(false)}
                        onBuffer={() => setIsBuffering(true)}
                        onBufferEnd={() => setIsBuffering(false)}
                        onError={(e) => {
                            console.error("Player Error:", e);
                            setError("Stream source is unavailable");
                            setIsBuffering(false);
                        }}
                        
                        // Progress Tracking
                        onProgress={({ played }) => {
                            // Only update if not seeking (prevents jumping)
                            setPlayed(played);
                        }}
                        onDuration={setDuration}
                        
                        config={{
                            file: { forceHLS: video?.url?.includes('.m3u8') }
                        }}
                    />

                    {/* --- CONTROLS OVERLAY --- */}
                    <motion.div 
                        animate={{ opacity: (showControls && !isLoading) ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 flex flex-col justify-between p-6"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors">
                                    <X size={24} className="text-white" />
                                </button>
                                <div>
                                    <h3 className="text-white font-bold text-lg drop-shadow-md line-clamp-1">
                                        {video?.title || "Loading..."}
                                    </h3>
                                    {video?.isLive && (
                                        <span className="text-xs text-red-500 font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/> Live
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Center Play/Pause (Hidden when loading) */}
                        {!playing && !isLoading && !error && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <button 
                                    onClick={() => setPlaying(true)}
                                    className="pointer-events-auto w-20 h-20 rounded-full bg-orange-600/90 backdrop-blur-xl flex items-center justify-center shadow-[0_0_40px_rgba(234,88,12,0.5)] border border-white/20 hover:scale-110 transition-transform"
                                >
                                    <Play size={32} fill="white" className="ml-1 text-white" />
                                </button>
                            </div>
                        )}

                        {/* Bottom Controls */}
                        <div className="space-y-4">
                            {/* Seek Bar */}
                            <div className="flex items-center gap-3 group/progress cursor-pointer select-none" onClick={handleSeek}>
                                <span className="text-xs font-mono font-medium text-white/80 w-12 text-right">
                                    {formatTime(played * duration)}
                                </span>
                                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden relative group-hover/progress:h-2 transition-all">
                                    <motion.div 
                                        className="h-full bg-gradient-to-r from-orange-500 to-red-600 relative"
                                        style={{ width: `${played * 100}%` }}
                                    >
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                                    </motion.div>
                                </div>
                                <span className="text-xs font-mono font-medium text-white/80 w-12">
                                    {formatTime(duration)}
                                </span>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <button onClick={() => setPlaying(!playing)} className="text-white hover:text-orange-400 transition-colors">
                                        {playing ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                                    </button>
                                    <button onClick={onNext} className="text-white hover:text-orange-400 transition-colors">
                                        <SkipForward size={28} fill="currentColor" />
                                    </button>
                                    
                                    {/* Volume */}
                                    <div className="flex items-center gap-3 group/vol">
                                        <button onClick={() => setMuted(!muted)} className="text-white hover:text-orange-400 transition-colors">
                                            {muted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                        </button>
                                        <input 
                                            type="range" min={0} max={1} step={0.1} 
                                            value={muted ? 0 : volume} 
                                            onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
                                            className="w-0 group-hover/vol:w-24 transition-all h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button onClick={toggleFullscreen} className="text-white hover:text-orange-400 transition-colors">
                                        {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export { PhoenixPlayer };