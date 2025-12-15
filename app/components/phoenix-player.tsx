
import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';
import { List, Maximize, Minimize, Pause, Play, Settings, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { HLS_STREAMS } from '../data/videos';

// --- Custom HLS Player Component ---
const PhoenixPlayer = ({ onClose, onNext, selectedVideo, setSelectedVideo }) => {
    const [playing, setPlaying] = useState(true);
    const [volume, setVolume] = useState(1.0);
    const [muted, setMuted] = useState(false);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const playerRef = useRef(null); // Explicitly type as ReactPlayer | null
    const containerRef = useRef(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const formatTime = (seconds: number) => {
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, '0');
        if (hh) {
            return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
        }
        return `${mm}:${ss}`;
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen?.().catch(err => console.error("Error attempting to enable fullscreen:", err));
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex gap-3 items-center justify-center p-4 md:p-10"
        >
            <div 
                ref={containerRef}
                className="w-full max-w-6xl aspect-video bg-black rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(234,88,12,0.3)] ring-1 ring-white/10 group"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setShowControls(false)}
            >
                <ReactPlayer
                    ref={playerRef}
                    src={selectedVideo.url}
                    width="100%"
                    height="100%"
                    playing={playing}
                    volume={muted ? 0 : volume}
                    muted={muted} // This prop is correctly placed
                    // The 'config' prop is for configuring the underlying player,
                    // but 'file' is not a direct property of the top-level config.
                    // For HLS, you typically configure it within the 'hls' property if needed,
                    // or ReactPlayer handles it automatically if the URL ends with .m3u8.
                    // If forceHLS is truly needed, it's usually a top-level prop or within a specific player config.
                    // Assuming ReactPlayer handles HLS automatically for .m3u8 URLs,
                    // or if a specific HLS config is needed, it would look like:
                    // config={{ hls: { /* HLS.js config options */ } }}
                    // Removing the incorrect 'file' property.
                />

                {/* Overlay Controls */}
                <motion.div 
                    animate={{ opacity: showControls ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-6 pointer-events-none"
                >
                    {/* Top Bar */}
                    <div className="flex justify-between items-start pointer-events-auto">
                        <div className="flex items-center gap-3">
                             <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors">
                                <X size={24} className="text-white" />
                             </button>
                             <div>
                                <h3 className="text-white font-bold text-lg drop-shadow-md">{selectedVideo.title}</h3>
                                <span className="text-xs text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/> Live HLS
                                </span>
                             </div>
                        </div>
                        <div className="flex gap-2">
                             <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors">
                                <Settings size={20} />
                             </button>
                        </div>
                    </div>

                    {/* Center Play Button (Only when paused) */}
                    {!playing && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                            <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setPlaying(true)}
                                className="w-20 h-20 rounded-full bg-orange-600/90 backdrop-blur-xl flex items-center justify-center shadow-[0_0_40px_rgba(234,88,12,0.5)] border border-white/20"
                            >
                                <Play size={32} fill="white" className="ml-1" />
                            </motion.button>
                        </div>
                    )}

                    {/* Bottom Controls */}
                    <div className="space-y-4 pointer-events-auto">
                        {/* Progress Bar */}
                        <div className="flex items-center gap-3 group/progress cursor-pointer" 
                             onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const width = rect.width;
                                const newTime = (x / width);
                                playerRef.current.seekTo(newTime);
                             }}>
                             <span className="text-xs font-mono font-medium text-white/80 w-10 text-right">{formatTime(played * duration)}</span>
                             <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden relative">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-orange-500 to-red-600 relative"
                                    style={{ width: `${played * 100}%` }}
                                >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform" />
                                </motion.div>
                             </div>
                             <span className="text-xs font-mono font-medium text-white/80 w-10">{formatTime(duration)}</span>
                        </div>

                        {/* Control Buttons */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setPlaying(!playing)} className="hover:text-orange-400 transition-colors">
                                    {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                                </button>
                                <button onClick={onNext} className="hover:text-orange-400 transition-colors">
                                    <SkipForward size={24} fill="currentColor" />
                                </button>
                                
                                <div className="flex items-center gap-2 group/vol">
                                    <button onClick={() => setMuted(!muted)} className="hover:text-orange-400 transition-colors">
                                        {muted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                    </button>
                                    <input 
                                        type="range" 
                                        min={0} 
                                        max={1} 
                                        step={0.1} 
                                        value={muted ? 0 : volume} 
                                        onChange={(e) => {
                                            setVolume(parseFloat(e.target.value));
                                            setMuted(false);
                                        }}
                                        className="w-0 overflow-hidden group-hover/vol:w-24 transition-all h-1 bg-white/50 rounded-lg appearance-none cursor-pointer hover:bg-orange-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded border border-white/10">HD</span>
                                <button onClick={toggleFullscreen} className="hover:text-orange-400 transition-colors">
                                    {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>


            <Playlist setSelectedVideo={setSelectedVideo} />
        </motion.div>
    );
};

const Playlist = ({ setSelectedVideo } : { setSelectedVideo: (video: any) => void }) => {

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, video: any) => {
        setSelectedVideo(video);
        e.preventDefault();
    };


    return (
        <div className="w-140 max-h-[78%] overflow-y-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 hidden xl:block shadow-2xl">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2 sticky top-0 bg-black/0 backdrop-blur-xl pb-2 border-b border-white/5">
            <List size={18} /> Next Up
            </h4>
            <div className="space-y-3">
            {HLS_STREAMS.map((video, idx) => (
                <a key={idx} onClick={(e) => handleClick(e, video)} className="flex gap-3 items-center group cursor-pointer p-2 hover:bg-white/5 rounded-xl transition-colors">
                    <div className={`w-16 h-10 rounded-lg shrink-0 relative overflow-hidden`}>
                        <div className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-black" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate group-hover:text-orange-400 transition-colors">{video.title}</p>
                        {/* <p className="text-xs text-zinc-500 truncate">{video.title}</p> */}
                    </div>
                </a>
            ))}
            </div>
        </div>
    )
}

export { PhoenixPlayer };