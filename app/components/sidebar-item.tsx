import { motion } from "framer-motion";

const SidebarItem = ({ icon: Icon, label, isActive, isCollapsed, onClick }) => (
  <motion.button 
    onClick={onClick}
    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center gap-4 w-full p-4 rounded-3xl transition-all group relative overflow-hidden mb-1 ${
      isActive 
        ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.1)]" 
        : "text-zinc-400 hover:text-white"
    }`}
  >
    {isActive && (
        <motion.div 
            layoutId="activeGlow"
            className="absolute inset-0 bg-orange-500/10 blur-xl"
            transition={{ duration: 0.3 }}
        />
    )}
    <Icon size={24} className={`shrink-0 relative z-10 transition-colors ${isActive ? 'text-orange-500' : 'group-hover:text-white'}`} />
    {!isCollapsed && (
        <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-base font-bold relative z-10 whitespace-nowrap"
        >
            {label}
        </motion.span>
    )}
    {isActive && !isCollapsed && (
        <motion.div layoutId="activeDot" className="absolute right-4 w-1.5 h-1.5 rounded-full bg-orange-500" />
    )}
  </motion.button>
);

export { SidebarItem };