import { Disc, Play, Trophy, Users } from "lucide-react";
import { motion } from "framer-motion";

// --- Sub-Components ---
const AlbumCard = ({ album, itemVariants }: { album: any, itemVariants?: any }) => (
    <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-5 p-5 rounded-[32px] bg-white/5 transition-all cursor-pointer group border border-white/5 hover:border-white/20"
    >
        <div className={`w-20 h-20 rounded-2xl ${album.cover} shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-500 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/20" />
            <Disc size={32} className="text-white/70 animate-spin-slow relative z-10" />
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xl text-white group-hover:text-orange-400 transition-colors truncate">{album.title}</h4>
            <p className="text-base text-zinc-500 font-medium truncate">{album.artist}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-zinc-600 font-bold uppercase tracking-wider">
                <span>{album.tracks} Tracks</span>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span>Hi-Res</span>
            </div>
        </div>
        <motion.button 
            whileHover={{ scale: 1.2, rotate: 90 }}
            className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all shadow-lg shadow-orange-500/20"
        >
            <Play size={20} fill="white" className="ml-1" />
        </motion.button>
    </motion.div>
);

const VideoCard = ({ video, onClick, itemVariants, thumbnail }: { video: any, onClick: any, itemVariants?: any }) => (
    <motion.div 
      onClick={onClick}
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group flex flex-col gap-4 cursor-pointer p-3 rounded-[32px] hover:bg-white/5 transition-colors duration-300"
    >
      <div className="relative aspect-video rounded-[24px] overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/5 group-hover:ring-orange-500/50 transition-all duration-300">
        <div className={`w-full h-full ${thumbnail} transform group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]`} />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/40 shadow-[0_0_30px_rgba(251,146,60,0.4)]"
            >
                <Play size={28} className="fill-white text-white ml-1" />
            </motion.div>
        </div>

        <div className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-black text-white border border-white/10 flex items-center gap-1.5 ${video.isLive ? 'bg-red-600/90 border-red-500 shadow-lg shadow-red-900/50' : 'bg-black/60 backdrop-blur-md'}`}>
          {video.isLive && (
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          )}
          {video.duration}
        </div>
      </div>

      <div className="flex gap-4 items-start px-2">
        <div className={`w-12 h-12 rounded-2xl ${video.avatar} shrink-0 ring-2 ring-black flex items-center justify-center text-[10px] font-bold text-white/50 shadow-lg`} />
        <div className="flex flex-col gap-1 w-full">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-orange-400 transition-colors">{video.title}</h3>
          <div className="text-sm text-zinc-400 flex flex-col font-medium">
            <span className="hover:text-white transition-colors">{video.author}</span>
            <span className="text-xs text-zinc-500 mt-1">{video.views} • {video.time}</span>
          </div>
        </div>
      </div>
    </motion.div>
);

const GameCard = ({ game, itemVariants }: { game: any, itemVariants?: any }) => (
    <motion.div
        variants={itemVariants}
        whileHover={{ y: -10, scale: 1.02 }}
        className="relative group rounded-[40px] overflow-hidden aspect-[3/4] cursor-pointer shadow-2xl shadow-black/50"
    >
        <div className={`absolute inset-0 ${game.thumbnail} transition-transform duration-700 group-hover:scale-110`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
             <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {game.genre}
             </span>
             <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 text-yellow-300 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                <Trophy size={12} fill="currentColor" /> {game.rating}
             </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-3xl font-black text-white leading-none drop-shadow-lg">{game.title}</h3>
            <div className="flex items-center gap-2 text-zinc-300 text-sm font-medium">
                <Users size={14} /> {game.players}
            </div>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-2 w-full bg-white text-black font-black py-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2"
            >
                <Play size={18} fill="black" /> Play Now
            </motion.button>
        </div>
    </motion.div>
);

export { VideoCard, GameCard, AlbumCard };