import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    LayoutDashboard,
    CheckSquare,
    Folder,
    Sparkles,
    Settings
} from 'lucide-react';

import { Link } from 'react-router-dom';

const SidebarLink = ({ icon, label, to = "#", active = false }) => (
    <Link
        to={to}
        className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all group ${active
            ? 'ai-gradient text-on-primary shadow-xl shadow-primary/20'
            : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
    >
        <span className={`transition-transform group-hover:scale-110`}>{icon}</span>
        <span className="tracking-widest uppercase text-[10px]">{label}</span>
    </Link>
);

import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-inverse-surface/20 backdrop-blur-sm z-50 lg:hidden"
                    />
                    <motion.aside
                        initial={{ x: -320 }}
                        animate={{ x: 0 }}
                        exit={{ x: -320 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 h-screen w-80 bg-surface-container-lowest border-r border-surface-container-high/50 z-[60] flex flex-col py-10 px-6 shadow-2xl shadow-on-surface/5"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 ai-gradient rounded-lg flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-sm"><img className='rounded-lg scale-120' src="https://play-lh.googleusercontent.com/x-A_RKLUz6tmGrwQRZhDajcESjwGNlk4niGr2tOk_SwX6vBcRYU21iIba9eHQLCXrYU" alt="logo" /></span>
                                </div>
                                <span className="text-xl font-black tracking-tighter">KaryaAI</span>
                            </div>
                            <button onClick={toggleSidebar} className="p-2 hover:bg-surface-container rounded-xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex-1 space-y-2">
                            <SidebarLink icon={<LayoutDashboard size={20} />} label="Overview" to="/dashboard" active={location.pathname === '/dashboard'} />
                            <SidebarLink icon={<CheckSquare size={20} />} label="My Tasks" to="/dashboard/tasks" active={location.pathname === '/dashboard/tasks'} />
                            <SidebarLink icon={<Folder size={20} />} label="High Priority" to="/dashboard/high-priority" active={location.pathname === '/dashboard/high-priority'} />
                            <SidebarLink icon={<Sparkles size={20} />} label="AI Assistant Content" to="/dashboard/ai-assistant" active={location.pathname === '/dashboard/ai-assistant'} />
                        </nav>

                        <div className="mt-auto space-y-6">
                            {/* Theme Settings */}
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-3 ml-2">Theme Preferences</p>
                                <div className="flex bg-surface-container-low rounded-2xl p-1 border border-surface-variant/10">
                                    <button
                                        onClick={() => setTheme('light')}
                                        title="Light Theme"
                                        className={`flex-1 flex justify-center py-2.5 rounded-xl transition-all ${theme === 'light' ? 'bg-surface-container-lowest shadow-sm text-primary font-black' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'}`}
                                    >
                                        <Sun size={18} />
                                    </button>
                                    <button
                                        onClick={() => setTheme('dark')}
                                        title="Dark Theme"
                                        className={`flex-1 flex justify-center py-2.5 rounded-xl transition-all ${theme === 'dark' ? 'bg-surface-container-lowest shadow-sm text-primary font-black' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'}`}
                                    >
                                        <Moon size={18} />
                                    </button>
                                    <button
                                        onClick={() => setTheme('system')}
                                        title="System Default"
                                        className={`flex-1 flex justify-center py-2.5 rounded-xl transition-all ${theme === 'system' ? 'bg-surface-container-lowest shadow-sm text-primary font-black' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'}`}
                                    >
                                        <Monitor size={18} />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full py-4 bg-error/10 text-error rounded-full font-black text-sm hover:bg-error/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};

export default Sidebar;
