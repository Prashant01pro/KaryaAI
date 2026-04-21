import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Settings, 
    ChevronRight, 
    Calendar,
    Users,
    TrendingUp,
    Lightbulb,
    ArrowRight,
    Sparkles,
    Plus,
    Wand2,
    Trash2,
    Pencil,
    Check
} from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useTasks } from '../../../context/TaskContext';
import { useAuth } from '../../../hooks/useAuth';
import { aiService } from '../../tasks/services/aiService';
import TaskModal from '../../tasks/components/TaskModal';
import StrategyModal from '../../tasks/components/StrategyModal';

const DashboardPage = () => {
    const { 
        tasks, 
        loading, 
        deleteTask, 
        isModalOpen, 
        taskToEdit, 
        openModal, 
        closeModal,
        updateTask 
    } = useTasks();
    const { user } = useAuth();
    const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
    const [activeStrategy, setActiveStrategy] = useState(null);
    const [activeStrategyTitle, setActiveStrategyTitle] = useState('');
    const [isStrategizing, setIsStrategizing] = useState(false);

    const handleAddTask = () => {
        openModal(null);
    };

    const handleEditTask = (task) => {
        openModal(task);
    };

    const handleToggleComplete = async (task) => {
        try {
            await updateTask(task._id, { 
                status: task.status === 'Completed' ? 'Pending' : 'Completed' 
            });
        } catch (error) {
            console.error('Failed to toggle task status:', error);
        }
    };

    const handleStrategize = async (task) => {
        setIsStrategizing(true);
        setActiveStrategyTitle(task.title);
        try {
            const response = await aiService.generateTaskStrategy(task._id);
            setActiveStrategy(response.data.strategy);
            setIsStrategyModalOpen(true);
        } catch (error) {
            console.error('Failed to generate strategy:', error);
            alert('AI Quota might be exceeded or server error. Please try again later.');
        } finally {
            setIsStrategizing(false);
        }
    };

    if (loading && tasks.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-12">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <motion.h2 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-black tracking-tight"
                        >
                            Focus suggest: {user?.name || 'Execute.'}
                        </motion.h2>
                        <p className="text-on-surface-variant text-xl font-medium">
                            You have <span className="text-primary font-black">{tasks.filter(t => t.priority === 'High').length} high-priority</span> targets in orbit.
                        </p>
                    </div>
                    <button 
                        onClick={handleAddTask}
                        className="ai-gradient text-on-primary px-10 py-5 rounded-full font-black text-lg flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                    >
                        <Plus className="w-6 h-6" />
                        New Objective
                    </button>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Tasks Panel */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between pb-4 border-b border-surface-container-high/50">
                            <h4 className="text-3xl font-black tracking-tight">Active Matrix</h4>
                            <div className="flex gap-4">
                                <button className="bg-surface-container-low p-3 rounded-2xl text-on-surface-variant hover:text-primary transition-all border border-surface-variant/10">
                                    <Settings className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {tasks.length === 0 ? (
                                <div className="text-center py-20 bg-surface-container-lowest rounded-[3rem] border border-dashed border-surface-variant/20">
                                    <p className="text-on-surface-variant font-bold text-xl">The matrix is empty. Initialize a task to begin.</p>
                                </div>
                            ) : (
                                tasks.map((task, i) => (
                                    <motion.div 
                                        key={task._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-surface-container-lowest rounded-[2rem] p-8 group hover:shadow-[0px_20px_40px_rgba(44,47,49,0.06)] border border-surface-variant/5 transition-all relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                                    >
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-16 w-1 ai-gradient rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        
                                        <div className="flex items-center gap-6 flex-1">
                                            <div 
                                                onClick={() => handleToggleComplete(task)}
                                                className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all group/check translate-y-1 shrink-0 ${
                                                    task.status === 'Completed' 
                                                        ? 'border-primary bg-primary/10 shadow-sm shadow-primary/20' 
                                                        : 'border-outline/20 hover:border-primary'
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded-md ai-gradient transition-all ${
                                                    task.status === 'Completed' ? 'opacity-100' : 'opacity-0 group-hover/check:opacity-60'
                                                }`}>
                                                    {task.status === 'Completed' && <Check className="w-4 h-4 text-on-primary p-0.5" />}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <h5 className={`text-2xl font-black tracking-tight transition-all duration-300 line-clamp-1 ${
                                                    task.status === 'Completed' 
                                                        ? 'text-on-surface-variant/40 line-through' 
                                                        : 'text-on-surface'
                                                }`}>
                                                    {task.title}
                                                </h5>
                                                <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest pt-1 transition-all duration-300 ${
                                                    task.status === 'Completed' ? 'opacity-40' : 'opacity-100'
                                                }`}>
                                                    <span className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-primary" />
                                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-md ${
                                                        task.priority === 'High' ? 'bg-error/10 text-error' : 
                                                        task.priority === 'Moderate' ? 'bg-secondary/10 text-secondary' : 
                                                        'bg-surface-container-high/50 text-outline'
                                                    }`}>
                                                        {task.priority} Priority
                                                    </span>
                                                    <span className="text-on-surface-variant/60">
                                                        {task.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                                            <button 
                                                onClick={() => handleEditTask(task)}
                                                className="flex-1 sm:flex-none p-4 bg-surface-container-low text-on-surface-variant rounded-2xl hover:bg-surface-container-high hover:text-primary transition-all relative group/edit"
                                            >
                                                <Pencil className="w-5 h-5 mx-auto" />
                                                <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-3 py-1 rounded font-black opacity-0 group-hover/edit:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest pointer-events-none">Edit Matrix</span>
                                            </button>
                                            <button 
                                                disabled={isStrategizing || task.status === 'Completed'}
                                                onClick={() => handleStrategize(task)}
                                                className="flex-1 sm:flex-none p-4 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all group/ai relative disabled:opacity-30 disabled:grayscale"
                                            >
                                                <Wand2 className="w-5 h-5 mx-auto" />
                                                <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-3 py-1 rounded font-black opacity-0 group-hover/ai:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest pointer-events-none">Strategize</span>
                                            </button>
                                            <button 
                                                onClick={() => deleteTask(task._id)}
                                                className="flex-1 sm:flex-none p-4 bg-surface-container-high text-on-surface-variant rounded-2xl hover:bg-error/10 hover:text-error transition-all"
                                            >
                                                <Trash2 className="w-5 h-5 mx-auto" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Side Panel (Static Mock for Layout) */}
                    <div className="lg:col-span-4 space-y-10">
                         {/* Stats Card */}
                         <div className="bg-on-surface p-10 rounded-[3rem] relative overflow-hidden text-surface shadow-2xl">
                            <div className="relative z-10 space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Matrix Saturation</p>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-6xl font-black">{tasks.length}</span>
                                    <span className="text-lg font-black text-primary">OBJECTIVES</span>
                                </div>
                                <TrendingUp className="w-8 h-8 text-primary" />
                            </div>
                            <div className="absolute -right-12 -bottom-12 opacity-5">
                                <Search className="w-64 h-64" />
                            </div>
                        </div>

                        <div className="bg-surface-container-low rounded-[3rem] p-10 border border-surface-variant/10 space-y-6">
                            <h4 className="text-xl font-black tracking-tight flex items-center gap-3">
                                <Lightbulb className="w-6 h-6 text-primary" />
                                AI Focus
                            </h4>
                            <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
                                {tasks.length > 0 
                                    ? `Based on your ${tasks.length} active objectives, prioritizing "${tasks[0].title}" would optimize your focus today. Use the AI Strategist for a full plan.`
                                    : "Initialize your first objective to receive AI-driven focus suggestions."
                                }
                            </p>
                            <button className="w-full py-4 bg-primary/10 text-primary rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary/20 transition-all">
                                Analyze Performance
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <TaskModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                taskToEdit={taskToEdit} 
            />
            
            <StrategyModal 
                isOpen={isStrategyModalOpen} 
                onClose={() => setIsStrategyModalOpen(false)} 
                strategy={activeStrategy}
                taskTitle={activeStrategyTitle} 
            />

            {/* Loading Overlay for AI Generation */}
            <AnimatePresence>
                {isStrategizing && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-inverse-surface/40 backdrop-blur-xl flex flex-col items-center justify-center text-white"
                    >
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-24 h-24 ai-gradient rounded-3xl flex items-center justify-center shadow-2xl mb-8"
                        >
                            <Wand2 className="w-12 h-12" />
                        </motion.div>
                        <p className="text-2xl font-black tracking-widest uppercase">Consulting AI Strategist...</p>
                        <div className="mt-4 flex gap-1">
                            {[0, 1, 2].map(i => (
                                <motion.div 
                                    key={i}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                    className="w-2 h-2 rounded-full bg-white"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default DashboardPage;
