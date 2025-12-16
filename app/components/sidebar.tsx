import { SidebarItem } from "./sidebar-item"
import { 
  Compass, 
  History, 
  Clock, 
  Gamepad2,
  MonitorPlay,
  FolderOpen,
  Mic2,
  Trophy,
  Users,
  Settings,
  Disc,
  Headphones,
  X,
} from 'lucide-react';
import { motion } from "framer-motion";

// --- Types ---
interface SidebarProps {
    setCurrentApp: (app: string) => void;
    currentApp: string;
    isSidebarOpen: boolean;
}

const Sidebar = ({ setCurrentApp, currentApp, isSidebarOpen } : SidebarProps) => {
    // The following code block seems to be a copy-paste error from phoenix-player.tsx
 return (
    <>
        <aside
            className={`hidden md:flex flex-col sticky top-[84px] h-[calc(100vh-84px)] bg-[#050202]/50 backdrop-blur-lg border-r border-white/5 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] z-40 ${isSidebarOpen ? 'w-80 px-4' : 'w-24 px-2'}`}
        >
            
            <div className="py-6 space-y-2 overflow-y-auto no-scrollbar">
            {/* App Switcher */}
            <div className={`px-4 py-2 text-xs font-black text-zinc-600 uppercase tracking-widest mb-2 ${!isSidebarOpen && 'hidden'}`}>Apps</div>
                <SidebarItem onClick={() => setCurrentApp('Stream')} icon={MonitorPlay} label="Stream" isActive={currentApp === 'Stream'} isCollapsed={!isSidebarOpen} />
                <SidebarItem onClick={() => setCurrentApp('Tunes')} icon={Headphones} label="Tunes" isActive={currentApp === 'Tunes'} isCollapsed={!isSidebarOpen} />
                <SidebarItem onClick={() => setCurrentApp('Arcade')} icon={Gamepad2} label="Arcade" isActive={currentApp === 'Arcade'} isCollapsed={!isSidebarOpen} />
                <SidebarItem onClick={() => setCurrentApp('Assets')} icon={FolderOpen} label="Assets" isActive={currentApp === 'Assets'} isCollapsed={!isSidebarOpen} />

            <div className="fixed left-0 top-0 h-full my-6 border-t border-white/5 mx-2" />

                {/* Context Menu */}
                <div className={`px-4 py-2 text-xs font-black text-zinc-600 uppercase tracking-widest mb-2 ${!isSidebarOpen && 'hidden'}`}>Menu</div>
                
                {currentApp === 'Stream' && (
                    <>
                        <SidebarItem icon={Compass} label="Discover" isCollapsed={!isSidebarOpen} isActive={undefined} onClick={undefined} />
                        <SidebarItem icon={Users} label="Community" isCollapsed={!isSidebarOpen} isActive={undefined} onClick={undefined} />
                        <SidebarItem icon={Clock} label="Recent" isCollapsed={!isSidebarOpen} isActive={undefined} onClick={undefined} />
                    </>
                )}
                {currentApp === 'Arcade' && (
                    <>
                        <SidebarItem icon={Trophy} label="Tournaments" isCollapsed={!isSidebarOpen} isActive={undefined} onClick={undefined} />
                        <SidebarItem icon={Users} label="Friends" isCollapsed={!isSidebarOpen} isActive={undefined} onClick={undefined} />
                        <SidebarItem icon={Gamepad2} label="Library" isCollapsed={!isSidebarOpen} isActive={undefined} onClick={undefined} />
                    </>
                )}
                {currentApp === 'Tunes' && (
                    <>
                        <SidebarItem icon={Disc} label="Albums" isCollapsed={!isSidebarOpen} isActive={undefined} onClick={undefined} />
                        <SidebarItem icon={Mic2} label="Artists" isCollapsed={!isSidebarOpen} isActive={undefined} onClick={undefined} />
                        <SidebarItem icon={History} label="History" isCollapsed={!isSidebarOpen} isActive={undefined} onClick={undefined} />
                    </>
                )}
            </div>
            
            {/* Bottom Settings */}
            <div className="mt-auto py-6 border-t border-white/5">
                <SidebarItem icon={Settings} label="Settings" isCollapsed={!isSidebarOpen} isActive={undefined} onClick={undefined} />
            </div>
        </aside>
 </>
 );
};

export { Sidebar };