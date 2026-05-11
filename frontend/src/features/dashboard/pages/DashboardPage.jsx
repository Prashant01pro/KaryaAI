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
    Check,
    Info
} from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useTasks } from '../../../context/TaskContext';
import { useAuth } from '../../../hooks/useAuth';
import { aiService } from '../../tasks/services/aiService';
import TaskModal from '../../tasks/components/TaskModal';
import StrategyModal from '../../tasks/components/StrategyModal';
import TaskDetailModal from '../../tasks/components/TaskDetailModal';
import ContributionGraph from '../components/ContributionGraph';
import { isSameDay, format } from 'date-fns';

const DashboardPage = () => {
    const {
        tasks,
        loading,
        deleteTask,
        isModalOpen,
        taskToEdit,
        openModal,
        closeModal,
        updateTask,
        fetchTasks
    } = useTasks();
    const { user } = useAuth();
    const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
    const [activeStrategy, setActiveStrategy] = useState(null);
    const [activeStrategyTitle, setActiveStrategyTitle] = useState('');
    const [isStrategizing, setIsStrategizing] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [detailTask, setDetailTask] = useState(null);

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
            fetchTasks();
        } catch (error) {
            console.error('Failed to generate strategy:', error);
            alert('AI Quota might be exceeded or server error. Please try again later.');
        } finally {
            setIsStrategizing(false);
        }
    };

    const filteredTasks = tasks.filter(task => isSameDay(new Date(task.createdAt), selectedDate));
    const isToday = isSameDay(selectedDate, new Date());

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
                <div className="flex flex-col w-full lg:flex-row lg:items-end justify-between gap-8">
                    <div className="space-y-6 w-full lg:w-3/4">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-black tracking-tight"
                        >
                            What to focus on : {user?.name || 'Execute.'}
                        </motion.h2>
                        <p className="text-on-surface-variant text-lg md:text-xl w-full lg:w-3/4 font-medium">
                            You have <span className="text-primary font-black">{tasks.filter(t => t.priority === 'High').length} high-priority</span> tasks.
                            Add Tasks to get AI-powered personalized suggestions on how to complete it efficiently.
                        </p>
                    </div>
                    <button
                        onClick={handleAddTask}
                        className="ai-gradient text-on-primary px-8 py-4 sm:px-10 sm:py-5 rounded-full font-black text-base sm:text-lg flex flex-row items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
                        New Task
                    </button>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Tasks Panel */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-surface-container-high/50 gap-4">
                            <div className="space-y-1">
                                <h4 className="text-3xl font-black tracking-tight">Active Tasks</h4>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary break-words whitespace-normal leading-relaxed max-w-xs">
                                    {isToday ? "Showing Tasks for Today" : `Tasks for ${format(selectedDate, 'MMMM d, yyyy')}`}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                                {!isToday && (
                                    <button
                                        onClick={() => setSelectedDate(new Date())}
                                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                                    >
                                        Back to Today
                                    </button>
                                )}
                                <button className="bg-surface-container-low p-3 rounded-2xl text-on-surface-variant hover:text-primary transition-all border border-surface-variant/10">
                                    <Settings className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6 max-h-[60vh] overflow-y-auto pt-12 pr-2 custom-scrollbar">
                            {filteredTasks.length === 0 ? (
                                <div className="text-center py-20 bg-surface-container-lowest rounded-[3rem] border border-dashed border-surface-variant/20">
                                    <p className="text-on-surface-variant font-bold text-xl">
                                        No Tasks found for {format(selectedDate, 'MMM d')}.
                                    </p>
                                    <button
                                        onClick={handleAddTask}
                                        className="mt-4 text-primary font-black uppercase tracking-widest text-xs hover:underline"
                                    >
                                        + Initialize New Tasks
                                    </button>
                                </div>
                            ) : (
                                filteredTasks.map((task, i) => (
                                    <motion.div
                                        key={task._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-surface-container-lowest rounded-[2rem] p-6 sm:p-8 group hover:shadow-[0px_20px_40px_rgba(44,47,49,0.06)] border border-surface-variant/5 transition-all relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                                    >
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-16 w-1 ai-gradient rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex items-center gap-6 flex-1">
                                            <div
                                                onClick={() => handleToggleComplete(task)}
                                                className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all group/check translate-y-1 shrink-0 ${task.status === 'Completed'
                                                    ? 'border-primary bg-primary/10 shadow-sm shadow-primary/20'
                                                    : 'border-outline/20 hover:border-primary'
                                                    }`}
                                            >
                                                <div className={`w-4 h-4 rounded-md ai-gradient transition-all ${task.status === 'Completed' ? 'opacity-100' : 'opacity-0 group-hover/check:opacity-60'
                                                    }`}>
                                                    {task.status === 'Completed' && <Check className="w-4 h-4 text-on-primary p-0.5" />}
                                                </div>
                                            </div>
                                            <div className="space-y-1 min-w-0">
                                                <h5 className={`text-xl sm:text-2xl font-black tracking-tight transition-all duration-300 break-words line-clamp-2 ${task.status === 'Completed'
                                                    ? 'text-on-surface-variant/40 line-through'
                                                    : 'text-on-surface'
                                                    }`}>
                                                    {task.title}
                                                </h5>
                                                <div className={`flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-y-2 gap-x-4 text-[10px] font-black uppercase tracking-widest pt-1 transition-all duration-300 ${task.status === 'Completed' ? 'opacity-40' : 'opacity-100'
                                                    }`}>
                                                    <span className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-primary" />
                                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-md ${task.priority === 'High' ? 'bg-error/10 text-error' :
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

                                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-surface-container-high/50 mt-4 sm:mt-0 justify-between sm:justify-start">
                                            <button
                                                onClick={() => setDetailTask(task)}
                                                className="flex-1 sm:flex-none p-3 sm:p-4 bg-surface-container-low text-on-surface-variant rounded-2xl hover:bg-surface-container-high hover:text-primary transition-all relative group/info flex justify-center items-center"
                                            >
                                                <Info className="w-5 h-5" />
                                                <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-3 py-1.5 rounded-lg font-black opacity-0 group-hover/info:opacity-100 transition-all duration-200 whitespace-nowrap uppercase tracking-widest pointer-events-none z-30 shadow-xl border border-white/10">View Details</span>
                                            </button>
                                            <button
                                                onClick={() => handleEditTask(task)}
                                                className="flex-1 sm:flex-none p-3 sm:p-4 bg-surface-container-low text-on-surface-variant rounded-2xl hover:bg-surface-container-high hover:text-primary transition-all relative group/edit flex justify-center items-center"
                                            >
                                                <Pencil className="w-5 h-5" />
                                                <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-3 py-1.5 rounded-lg font-black opacity-0 group-hover/edit:opacity-100 transition-all duration-200 whitespace-nowrap uppercase tracking-widest pointer-events-none z-30 shadow-xl border border-white/10">Edit Item</span>
                                            </button>
                                            <button
                                                disabled={isStrategizing || task.status === 'Completed'}
                                                onClick={() => handleStrategize(task)}
                                                className="flex-1 sm:flex-none p-3 sm:p-4 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all group/ai relative disabled:opacity-30 disabled:grayscale flex justify-center items-center"
                                            >
                                                <Wand2 className="w-5 h-5" />
                                                <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-3 py-1.5 rounded-lg font-black opacity-0 group-hover/ai:opacity-100 transition-all duration-200 whitespace-nowrap uppercase tracking-widest pointer-events-none z-30 shadow-xl border border-white/10">Strategize</span>
                                            </button>
                                            <button
                                                onClick={() => deleteTask(task._id)}
                                                className="flex-1 sm:flex-none p-3 sm:p-4 bg-surface-container-high text-on-surface-variant rounded-2xl hover:bg-error/10 hover:text-error transition-all flex justify-center items-center relative group/delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                                <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-error text-white text-[10px] px-3 py-1.5 rounded-lg font-black opacity-0 group-hover/delete:opacity-100 transition-all duration-200 whitespace-nowrap uppercase tracking-widest pointer-events-none z-30 shadow-xl">Remove Task</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Side Panel (Static Mock for Layout) */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* Stats Card */}
                        <div className="bg-on-surface p-6 rounded-[3rem] relative overflow-hidden text-surface shadow-2xl">
                            <div className="relative z-10 space-y">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Total Tasks</p>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-6xl font-black">{tasks.length}</span>
                                    <span className="text-lg font-black text-primary">Tasks</span>
                                </div>
                                <TrendingUp className="w-8 h-8 text-primary" />
                            </div>
                            <div className="absolute -right-12 -bottom-12 opacity-5">
                                <Search className="w-64 h-64" />
                            </div>
                        </div>

                        <ContributionGraph
                            tasks={tasks}
                            onDateClick={setSelectedDate}
                            selectedDate={selectedDate}
                        />
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

            <TaskDetailModal 
                isOpen={!!detailTask} 
                onClose={() => setDetailTask(null)} 
                task={detailTask} 
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
