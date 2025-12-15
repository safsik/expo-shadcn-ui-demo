import { motion } from "framer-motion"
import { Bell, Flame, Search, Menu } from "lucide-react"

const SBHeader = ({ currentApp, isSidebarOpen, setIsSidebarOpen, searchQuery, setSearchQuery, isMobileMenuOpen, setIsMobileMenuOpen }) => {
    return (
    // {/* --- Header --- */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#050202]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-6">
          {/* The original code had `Option.button` which is not defined.
              Assuming it was meant to be `motion.button` for animation. */}
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.innerWidth < 768 ? setIsMobileMenuOpen(true) : setIsSidebarOpen(!isSidebarOpen)}
            className="p-3 rounded-full transition-colors text-zinc-300 hover:text-white"
          >
            <Menu size={24} /> 
          </motion.button>
          
          <div className="flex items-center gap-4 cursor-pointer group">
            <motion.div 
                whileHover={{ rotate: 180 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all duration-300 bg-gradient-to-br ${
                    currentApp === 'Arcade' ? 'from-blue-500 to-purple-600' : 
                    currentApp === 'Tunes' ? 'from-purple-500 to-pink-600' :
                    'from-orange-500 to-red-600'
                }`}
            >
              <Flame size={24} className="text-white fill-white" />
            </motion.div>
            <span className="text-2xl font-black tracking-tighter hidden md:block">
              Phoenix<span className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  currentApp === 'Arcade' ? 'from-blue-400 to-purple-400' : 
                  currentApp === 'Tunes' ? 'from-purple-400 to-pink-400' :
                  'from-orange-400 to-red-500'
              }`}>{currentApp}</span>
            </span>
          </div>
        </div>

        {/* Universal Search */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-12 relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search size={20} className="text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder={`Search ${currentApp}...`} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121214] border-2 border-white/5 hover:border-white/10 rounded-full py-3.5 pl-14 pr-12 text-base font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 transition-all placeholder:text-zinc-600 text-white shadow-inner"
          />
        </div>

        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-3.5 rounded-full bg-white/5 hover:bg-white/10 relative transition-colors text-zinc-300 hover:text-white">
            <Bell size={22} />
            <span className="absolute top-3 right-3.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#050202]" />
          </motion.button>
          <motion.div whileHover={{ scale: 1.05 }} className="w-12 h-12 ml-2 rounded-full bg-gradient-to-r from-zinc-700 to-zinc-600 ring-4 ring-white/5 cursor-pointer hover:ring-orange-500/50 transition-all shadow-lg" />
        </div>
      </header>
    )
}
export { SBHeader }
