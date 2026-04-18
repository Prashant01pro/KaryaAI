import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Menu, 
    Search, 
    Bell, 
    Plus, 
    Sparkles, 
    Settings
} from 'lucide-react';
import Sidebar from '../features/dashboard/components/Sidebar';
import { useAuth } from '../hooks/useAuth';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth();
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-background text-on-surface flex flex-col font-manrope">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Top Navbar */}
            <header className="fixed top-0 right-0 left-0 h-20 px-8 flex justify-between items-center bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 z-40 transition-all">
                <div className="flex items-center gap-6">
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleSidebar}
                        className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container hover:text-primary transition-all shadow-sm"
                    >
                        <Menu className="w-6 h-6" />
                    </motion.button>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 ai-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-black tracking-tight leading-none">TaskFlow</h1>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black">AI Productivity</p>
                        </div>
                    </div>
                </div>

                <div className="flex-grow flex justify-center max-w-xl px-8">
                    <div className="flex items-center bg-surface-container-low rounded-2xl px-5 py-3 w-full focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-surface-variant/10">
                        <Search className="w-5 h-5 text-outline mr-3" />
                        <input 
                            className="bg-transparent border-none focus:ring-0 w-full text-on-surface font-medium placeholder:text-outline/50" 
                            placeholder="Search tasks, projects, or AI insights..." 
                            type="text"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden md:flex ai-gradient text-on-primary px-6 py-3 rounded-full font-black text-sm items-center gap-2 shadow-xl shadow-primary/20"
                    >
                        <Plus className="w-4 h-4" />
                        Add Task
                    </motion.button>

                    <div className="flex items-center gap-2">
                         <button className="p-3 text-on-surface-variant bg-surface-container-low hover:bg-surface-container rounded-2xl transition-all relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                        </button>
                    </div>

                    <div className="h-8 w-[1px] bg-surface-container-high/50 mx-2"></div>

                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="text-right hidden sm:block">
                            <p className="font-black text-on-surface text-sm leading-none">{user?.name || 'Guest User'}</p>
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">{user?.plan || 'Free'} Plan</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl ring-2 ring-primary/10 overflow-hidden group-hover:ring-primary/30 transition-all shadow-md">
                            <img 
                                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200" 
                                alt="Profile" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="pt-28 pb-12 px-8 md:px-12">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
