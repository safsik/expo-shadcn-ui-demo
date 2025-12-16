import { motion } from "framer-motion"
import { Flame, Menu } from "lucide-react"

export default function Header({ setIsMobileMenuOpen, isSidebarOpen, setIsSidebarOpen, currentApp }) {
    return (
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#050202]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-6">
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
      </header>
    )
}