import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Menu,
    Search,
    Bell,
    Plus
} from 'lucide-react';
import Sidebar from '../features/dashboard/components/Sidebar';
import UserProfileSidebar from '../features/dashboard/components/UserProfileSidebar';
import EditProfileModal from '../features/dashboard/components/EditProfileModal';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../context/TaskContext';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const { user } = useAuth();
    const { openModal } = useTasks();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleUserSidebar = () => setIsUserSidebarOpen(!isUserSidebarOpen);
    const openEditProfile = () => {
        setIsUserSidebarOpen(false);
        setIsEditProfileOpen(true);
    };

    return (
        <div className="min-h-screen bg-background text-on-surface flex flex-col font-manrope">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Top Navbar */}
            <header className="fixed top-0 right-0 left-0 h-20 px-4 sm:px-8 flex justify-between items-center bg-surface-container-lowest/80 backdrop-blur-xl border-b border-surface-container-high/50 z-40 transition-all gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-6 shrink-0">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleSidebar}
                        className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container hover:text-primary transition-all shadow-sm shrink-0"
                    >
                        <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.button>

                    <div className="flex items-center gap-5">
                        <div className="w-8 h-8 ai-gradient rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-sm"><img className='rounded-lg scale-120' src="https://play-lh.googleusercontent.com/x-A_RKLUz6tmGrwQRZhDajcESjwGNlk4niGr2tOk_SwX6vBcRYU21iIba9eHQLCXrYU" alt="logo" /></span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-black tracking-tight leading-none">KaryaAI</h1>
                            <p className="text-[10px] uppercase tracking-[0.2em] pt-2 text-on-surface-variant font-black">AI Productivity</p>
                        </div>
                    </div>
                </div>

                <div className="flex-grow hidden md:flex justify-center max-w-xl px-8">
                    <div className="flex items-center bg-surface-container-low rounded-2xl px-5 py-3 w-full focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-surface-variant/10">
                        <Search className="w-5 h-5 text-outline mr-3" />
                        <input
                            className="bg-transparent border-none focus:ring-0 w-full text-on-surface font-medium placeholder:text-outline/50"
                            placeholder="Search tasks, projects, or AI insights..."
                            type="text"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-6 shrink-0">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModal()}
                        className="hidden md:flex ai-gradient text-on-primary px-6 py-3 rounded-full font-black text-sm items-center gap-2 shadow-xl shadow-primary/20"
                    >
                        <Plus className="w-4 h-4" />
                        Add Task
                    </motion.button>

                    <div className="flex items-center gap-2">
                        <button className="p-3 text-on-surface-variant bg-surface-container-low hover:bg-surface-container rounded-2xl transition-all relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-surface-container-lowest"></span>
                        </button>
                    </div>


                    <div className="hidden sm:block h-8 w-[1px] bg-surface-container-high/50 mx-2"></div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={toggleUserSidebar}
                        className="flex items-center gap-2 sm:gap-4 group cursor-pointer bg-surface-container-low sm:px-4 sm:py-2 p-1 rounded-2xl hover:bg-surface-container transition-all"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="font-black text-on-surface text-sm leading-none">{user?.name || 'Guest User'}</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">View Identity</p>
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 ai-gradient rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary/10 shrink-0">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    </motion.div>
                </div>
            </header>

            <main className="pt-28 pb-12 px-8 md:px-12">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            <UserProfileSidebar
                isOpen={isUserSidebarOpen}
                onClose={() => setIsUserSidebarOpen(false)}
                onEditProfile={openEditProfile}
            />

            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
            />
        </div>
    );
};

export default DashboardLayout;
