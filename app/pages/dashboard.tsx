'use client'

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Flame, Heart, Search, Bell, Menu, TrendingUp, 
  Layout, Zap, MessageSquare, Send, Bot, User, Sparkles, X, ChevronRight, LucideIcon,
  Settings, BarChart3, Globe, Shield, Terminal
} from 'lucide-react';

// --- CONFIGURATION ---
const AGENT_ID = "I8vLs74Re5v3bJDVm7-Mes9IPQYqhkA-";

// --- TYPES ---
interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

// --- ATOMS ---

// 1. Magma Button
interface MagmaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  icon?: LucideIcon | React.ElementType;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon' | 'sidebar';
  active?: boolean;
}

const MagmaButton: React.FC<MagmaButtonProps> = ({ 
  children, 
  icon: Icon, 
  variant = 'primary', 
  active = false,
  className = '', 
  ...props 
}) => {
  const baseStyle = "relative group overflow-hidden font-bold transition-all duration-300 ease-out active:scale-95 flex items-center gap-3";
  
  const variants = {
    primary: "rounded-full px-6 py-3 bg-[linear-gradient(135deg,#f97316_0%,#dc2626_100%)] text-white shadow-[0_0_20px_-5px_rgba(249,115,22,0.6)] hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.8)] justify-center",
    secondary: "rounded-full px-6 py-3 bg-[#1f1f1f]/50 backdrop-blur-md border border-white/10 text-white hover:bg-[#1f1f1f] hover:border-orange-500/50 justify-center",
    ghost: "rounded-full p-2 hover:bg-white/10 text-gray-400 hover:text-white justify-center",
    icon: "rounded-full w-10 h-10 bg-[#1f1f1f] border border-white/10 text-white hover:border-orange-500 hover:text-orange-500 shadow-lg justify-center",
    sidebar: `w-full rounded-xl px-4 py-3 text-sm transition-all ${active ? 'bg-gradient-to-r from-orange-500/20 to-red-500/10 text-white border-l-2 border-orange-500' : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}`
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
      )}
      {Icon && <Icon size={variant === 'sidebar' ? 20 : (variant === 'icon' ? 20 : 18)} strokeWidth={active ? 2.5 : 2} className={active ? 'text-orange-500' : ''} />}
      <span className="relative z-20">{children}</span>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </button>
  );
};

// 2. Glass Card
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', noPadding = false }) => (
  <div className={`relative rounded-3xl bg-[linear-gradient(145deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_100%)] backdrop-blur-xl border border-white/5 shadow-xl overflow-hidden ${className} ${noPadding ? '' : 'p-6'}`}>
    {children}
  </div>
);

// --- CHAT COMPONENTS ---

interface ChatMessageBubbleProps {
  message: Message;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isAgent = message.role === 'agent';
  
  return (
    <div className={`flex w-full mb-6 ${isAgent ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[70%] gap-4 ${isAgent ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${isAgent ? 'bg-[#1f1f1f] border border-white/10' : 'bg-gradient-to-br from-orange-500 to-red-600'}`}>
          {isAgent ? <Bot size={20} className="text-orange-500" /> : <User size={20} className="text-white" />}
        </div>

        {/* Bubble */}
        <div className={`
          relative p-5 rounded-3xl border backdrop-blur-md shadow-sm
          ${isAgent 
            ? 'bg-[#1f1f1f]/90 border-white/5 rounded-tl-sm text-gray-200' 
            : 'bg-gradient-to-br from-orange-600/20 to-red-900/40 border-orange-500/20 rounded-tr-sm text-white'}
        `}>
          <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
          <span className="text-[11px] opacity-40 mt-2 block text-right font-medium tracking-wide">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'agent',
      content: "Phoenix Core Online.\n\nI have full access to your cluster topology. How can I assist with your infrastructure today?",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Mock Response
    setTimeout(() => {
      const agentResponse = `Processing command: "${userMsg.content}"...\n\n[ACCESSING NODE CLUSTER...]\n\nI've analyzed the request against the current topology. In a production environment, I would now execute this against Agent ID: ${AGENT_ID.substring(0,8)}...`;
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: agentResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#080505]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#080505]/50 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-orange-500" size={20} />
            Phoenix AI Agent
          </h2>
          <p className="text-xs text-gray-500 mt-1">Connected to DigitalOcean GenAI Platform</p>
        </div>
        <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-xs font-bold flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               ONLINE
             </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-hide">
        <div className="max-w-3xl mx-auto">
          {messages.map(msg => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-3 mb-4 px-2 opacity-70">
              <div className="w-8 h-8 rounded-full bg-[#1f1f1f] border border-white/10 flex items-center justify-center">
                 <Bot size={16} className="text-orange-500 animate-pulse" />
              </div>
              <span className="text-sm text-gray-400">Phoenix is processing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-6 pb-8">
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center gap-4 bg-[#121212] rounded-2xl p-2 pl-6 border border-white/10 focus-within:border-orange-500/50 transition-all shadow-2xl">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Phoenix to deploy droplets, check logs, or scale resources..."
              className="flex-1 bg-transparent text-white text-base placeholder-gray-500 focus:outline-none py-3"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white disabled:opacity-50 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-shadow"
            >
              <Send size={20} fill="white" />
            </button>
          </div>
          <div className="text-center mt-3 flex justify-center gap-6 text-[10px] text-gray-500 uppercase tracking-widest font-medium">
             <span className="hover:text-gray-300 cursor-pointer transition-colors">cmd + k to clear</span>
             <span className="hover:text-gray-300 cursor-pointer transition-colors">/deploy to start</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- DASHBOARD COMPONENTS ---

interface StatItem {
  title: string;
  val: string;
  icon: LucideIcon;
  trend?: string;
}

interface NodeItem {
  title: string;
  status: string;
  region: string;
  type: string;
}

const DashboardView: React.FC = () => (
  <div className="p-8 h-full overflow-y-auto scrollbar-hide">
    {/* Header */}
    <div className="flex items-end justify-between mb-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Mission Control</h1>
        <p className="text-gray-400">Overview of your Magma Infrastructure</p>
      </div>
      <div className="flex gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="bg-[#1f1f1f] border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50 w-64"
          />
        </div>
        <MagmaButton variant="icon" icon={Bell} />
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/10 overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Phoenix" alt="User" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>

    {/* Top Grid: Hero + Quick Stats */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Hero */}
      <GlassCard className="lg:col-span-2 min-h-[300px] flex flex-col justify-end relative group" noPadding>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-700 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050202] via-[#050202]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050202]/80 to-transparent" />
        
        <div className="relative z-10 p-8 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 mb-4 backdrop-blur-md">
            <Flame size={12} className="text-orange-500 fill-orange-500" />
            <span className="text-xs font-bold text-orange-400 tracking-wide uppercase">Magma UI v2.0</span>
          </div>
          
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            System Performance <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Optimized</span>
          </h2>
          
          <div className="flex gap-4 mt-2">
            <MagmaButton variant="primary" icon={Zap}>Deploy Node</MagmaButton>
            <MagmaButton variant="secondary" icon={Layout}>View Map</MagmaButton>
          </div>
        </div>
      </GlassCard>

      {/* Quick Stats Column */}
      <div className="flex flex-col gap-4">
        {[
          { title: "Total CPU Load", val: "42%", icon: Zap, trend: "+2.4%" },
          { title: "Memory Usage", val: "12.4 GB", icon: Layout, trend: "-0.5%" },
          { title: "Network I/O", val: "840 MB/s", icon: Globe, trend: "+12%" },
        ].map((item, i) => (
          <GlassCard key={i} className="flex-1 flex items-center justify-between group hover:border-orange-500/30 transition-colors" noPadding>
            <div className="flex items-center gap-4 p-5 w-full">
              <div className="w-12 h-12 rounded-xl bg-[#1f1f1f] flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                <item.icon size={20} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-400">{item.title}</div>
                <div className="text-2xl font-bold text-white">{item.val}</div>
              </div>
              <div className={`ml-auto text-xs font-bold px-2 py-1 rounded-lg ${item.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {item.trend}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>

    {/* Active Nodes Grid */}
    <div className="flex items-center justify-between mb-6">
       <h3 className="text-xl font-bold text-white flex items-center gap-2">
         <Shield size={20} className="text-orange-500"/>
         Active Nodes
       </h3>
       <button className="text-sm text-gray-500 hover:text-white flex items-center gap-1">
         View All <ChevronRight size={14} />
       </button>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
       {[
         { title: "Production DB", status: "Healthy", region: "NYC3", type: "Database" },
         { title: "AI Worker 01", status: "Processing", region: "SFO2", type: "Droplet" },
         { title: "Load Balancer", status: "Stable", region: "LON1", type: "Network" },
         { title: "Redis Cache", status: "Warming", region: "FRA1", type: "Cache" },
       ].map((item: NodeItem, i: number) => (
         <GlassCard key={i} className="group hover:border-orange-500/40 transition-all cursor-pointer" noPadding>
           <div className="p-5">
             <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-[#050202] border border-white/10 flex items-center justify-center group-hover:border-orange-500/50 transition-colors">
                  <Flame size={16} className="text-orange-500" />
                </div>
                <div className="px-2 py-1 rounded bg-[#1f1f1f] border border-white/5 text-[10px] text-gray-400 uppercase font-bold">
                  {item.region}
                </div>
             </div>
             
             <h4 className="font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">{item.title}</h4>
             <p className="text-xs text-gray-500 mb-3">{item.type}</p>
             
             <div className="flex items-center gap-2">
               <span className={`w-2 h-2 rounded-full ${item.status === 'Healthy' || item.status === 'Stable' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
               <span className="text-xs font-medium text-gray-300">{item.status}</span>
             </div>
           </div>
         </GlassCard>
       ))}
    </div>
  </div>
);

// --- MAIN LAYOUT ---

export default function PhoenixTabletApp() {
  const [activeTab, setActiveTab] = useState<string>('Dashboard');

  return (
    // Tablet Wrapper centered on screen
    <div className="h-full bg-[#1a1a1a] flex items-center justify-center font-sans">
      
      {/* Tablet Frame Simulator */}
      <div className="w-full h-full aspect-[4/3] bg-[#050202] border-[#2a2a2a] overflow-hidden relative shadow-2xl flex shadow-black/50">
        
        {/* Ambient Backgrounds */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-600 rounded-full filter blur-[150px] opacity-15 animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-700 rounded-full filter blur-[150px] opacity-15 pointer-events-none" />

        {/* SIDEBAR NAVIGATION */}
        <aside className="w-64 bg-[#080505]/80 backdrop-blur-xl border-r border-white/5 flex flex-col p-2 z-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mt-5 mb-10 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Flame size={22} className="text-white fill-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide leading-none">PHOENIX</h1>
              <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">Console</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 space-y-2">
            <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Main Menu</p>
            <MagmaButton variant="sidebar" icon={Layout} active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')}>
              Dashboard
            </MagmaButton>
            <MagmaButton variant="sidebar" icon={Sparkles} active={activeTab === 'Phoenix AI'} onClick={() => setActiveTab('Phoenix AI')}>
              Phoenix AI
            </MagmaButton>
            <MagmaButton variant="sidebar" icon={BarChart3} active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')}>
              Analytics
            </MagmaButton>
            <MagmaButton variant="sidebar" icon={Globe} active={activeTab === 'Network'} onClick={() => setActiveTab('Network')}>
              Network Map
            </MagmaButton>

            <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-8 mb-2">System</p>
            <MagmaButton variant="sidebar" icon={Terminal} onClick={() => {}}>
              Logs
            </MagmaButton>
            <MagmaButton variant="sidebar" icon={Shield} onClick={() => {}}>
              Security
            </MagmaButton>
            <MagmaButton variant="sidebar" icon={Settings} onClick={() => {}}>
              Settings
            </MagmaButton>
          </nav>

          {/* Bottom Card */}
          <div className="mt-auto pt-6 border-t border-white/5">
             <div className="bg-[#1f1f1f] rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-xs text-white font-bold">Cluster Healthy</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                   <div className="w-[75%] h-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-gray-500">
                   <span>CPU Usage</span>
                   <span>75%</span>
                </div>
             </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-[#080505]">
          {activeTab === 'Dashboard' && <DashboardView />}
          {activeTab === 'Phoenix AI' && <ChatInterface />}
          
          {(activeTab !== 'Dashboard' && activeTab !== 'Phoenix AI') && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50 space-y-4">
               <div className="w-24 h-24 rounded-full bg-[#1f1f1f] flex items-center justify-center">
                  <Layout size={48} className="text-gray-600" />
               </div>
               <p className="font-medium text-lg">Module under construction</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}