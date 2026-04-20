import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    User, 
    Mail, 
    CheckSquare, 
    Settings, 
    LogOut, 
    BarChart3,
    Edit3
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useTasks } from '../../../context/TaskContext';

const UserProfileSidebar = ({ isOpen, onClose, onEditProfile }) => {
    const { user, logout } = useAuth();
    const { tasks } = useTasks();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-inverse-surface/20 backdrop-blur-sm z-[100]"
                    />
                    
                    {/* Sidebar */}
                    <motion.aside
                        initial={{ x: 400 }}
                        animate={{ x: 0 }}
                        exit={{ x: 400 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-screen w-96 bg-surface-container-lowest border-l border-surface-container-high/50 z-[110] flex flex-col shadow-2xl shadow-on-surface/10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-8 border-b border-surface-container-high/50">
                            <h3 className="text-2xl font-black tracking-tight">Identity</h3>
                            <button 
                                onClick={onClose}
                                className="p-3 hover:bg-surface-container-low rounded-2xl transition-all group"
                            >
                                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 ai-gradient rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-primary/20">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xl font-black tracking-tight leading-none">{user?.name || 'User'}</h4>
                                        <p className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
                                            <Mail className="w-3 h-3" />
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>

                                <button 
                                    onClick={onEditProfile}
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-surface-container-low hover:bg-surface-container rounded-2xl font-black text-sm transition-all border border-surface-variant/10"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Update Identity
                                </button>
                            </div>

                            <hr className="border-surface-container-high/50" />

                            {/* Analytics Brief */}
                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Matrix Saturation</h5>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
                                        <p className="text-3xl font-black text-primary">{tasks.length}</p>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-primary/60 mt-1">Objectives</p>
                                    </div>
                                    <div className="bg-secondary/5 p-6 rounded-[2rem] border border-secondary/10">
                                        <p className="text-3xl font-black text-secondary">
                                            {tasks.filter(t => t.priority === 'High').length}
                                        </p>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-secondary/60 mt-1">High Orbit</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="space-y-3 pt-4">
                                <Link 
                                    to="/dashboard/tasks" 
                                    onClick={onClose}
                                    className="flex items-center justify-between p-5 bg-surface-container-lowest hover:bg-surface-container-low rounded-3xl transition-all border border-surface-variant/5 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <CheckSquare className="w-5 h-5" />
                                        </div>
                                        <span className="font-black text-xs uppercase tracking-widest">My Analytics</span>
                                    </div>
                                    <BarChart3 className="w-4 h-4 text-outline/30 group-hover:text-primary transition-colors" />
                                </Link>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-surface-container-high/50">
                            <button
                                onClick={handleLogout}
                                className="w-full py-5 bg-error/10 text-error rounded-[2rem] font-black text-sm uppercase tracking-[0.1em] hover:bg-error/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                <LogOut className="w-5 h-5" />
                                Terminate Session
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};

export default UserProfileSidebar;
