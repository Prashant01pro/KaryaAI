import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Plus,
    Wand2,
    Trash2,
    Filter,
    ChevronLeft,
    Sparkles,
    Search,
    Inbox,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Download,
    Pencil,
    Check,
    Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useTasks } from '../../../context/TaskContext';
import { aiService } from '../../tasks/services/aiService';
import TaskModal from '../../tasks/components/TaskModal';
import StrategyModal from '../../tasks/components/StrategyModal';
import TaskDetailModal from '../../tasks/components/TaskDetailModal';
import { isSameDay, differenceInDays } from 'date-fns';

const TasksListPage = ({ type = 'all' }) => {
    const navigate = useNavigate();
    const {
        tasks,
        loading,
        deleteTask,
        isModalOpen,
        openModal,
        closeModal,
        updateTask,
        fetchTasks
    } = useTasks();

    const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
    const [activeStrategy, setActiveStrategy] = useState(null);
    const [activeStrategyTitle, setActiveStrategyTitle] = useState('');
    const [isStrategizing, setIsStrategizing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [detailTask, setDetailTask] = useState(null);

    // Filter tasks based on the page type
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const daysDiff = differenceInDays(new Date(), new Date(task.createdAt));
        const isLast5Days = daysDiff >= 0 && daysDiff <= 5;

        if (type === 'high-priority') {
            return task.priority === 'High' && matchesSearch;
        }
        if (type === 'ai-assistant') {
            const isToday = isSameDay(new Date(task.createdAt), new Date());
            return task.aiStrategy && matchesSearch && isToday;
        }
        return matchesSearch && isLast5Days;
    });

    const toggleExpand = (taskId) => {
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    };

    const getPageTitle = () => {
        switch (type) {
            case 'high-priority': return 'High Orbit Targets';
            case 'ai-assistant': return 'AI Intelligence Hub';
            default: return 'Active Matrix';
        }
    };

    const getPageIcon = () => {
        switch (type) {
            case 'high-priority': return <AlertCircle className="w-8 h-8 text-error" />;
            case 'ai-assistant': return <Sparkles className="w-8 h-8 text-primary" />;
            default: return <Inbox className="w-8 h-8 text-secondary" />;
        }
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
        } finally {
            setIsStrategizing(false);
        }
    };

    const showSavedStrategy = (task) => {
        setActiveStrategy(task.aiStrategy);
        setActiveStrategyTitle(task.title);
        setIsStrategyModalOpen(true);
    };

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-3 bg-surface-container-low hover:bg-surface-container rounded-2xl transition-all"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                {getPageIcon()}
                                <h1 className="text-4xl font-black tracking-tight">{getPageTitle()}</h1>
                            </div>
                            <p className="text-on-surface-variant font-medium ml-1">
                                {filteredTasks.length} objectives identified in this sector.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 sm:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search sector..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-[240px] pl-12 pr-6 py-3 bg-surface-container-low border border-surface-variant/10 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm transition-all"
                            />
                        </div>
                        {type !== 'ai-assistant' && (
                            <button
                                onClick={() => openModal()}
                                className="ai-gradient text-on-primary p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                            >
                                <Plus className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>

                {/* List */}
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pt-12 pr-2 custom-scrollbar">
                    {loading && filteredTasks.length === 0 ? (
                        <div className="flex justify-center py-20">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="text-center py-32 bg-surface-container-lowest rounded-[3rem] border border-dashed border-surface-variant/20">
                            <p className="text-on-surface-variant font-bold text-xl">No objectives found in this sector.</p>
                            <button onClick={() => navigate('/dashboard')} className="mt-4 text-primary font-black text-xs uppercase tracking-widest hover:underline">Return to Dashboard</button>
                        </div>
                    ) : type === 'ai-assistant' ? (
                        filteredTasks.map((task, i) => (
                            <motion.div
                                key={task._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-surface-container-lowest rounded-[2rem] border border-surface-variant/5 shadow-sm hover:shadow-md transition-all overflow-hidden"
                            >
                                <div
                                    onClick={() => toggleExpand(task._id)}
                                    className="p-8 cursor-pointer flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 ai-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tight text-on-surface group-hover:text-primary transition-colors">{task.title}</h3>
                                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">AI Strategy Ready</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                showSavedStrategy(task);
                                            }}
                                            className="p-3 bg-primary/5 text-primary rounded-xl hover:bg-primary/10 transition-all"
                                        >
                                            <Search className="w-5 h-5" />
                                        </button>
                                        <div className="p-3 bg-surface-container-low rounded-xl">
                                            {expandedTaskId === task._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedTaskId === task._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-surface-container-high bg-surface-container-lowest/50"
                                        >
                                            <div className="p-8 sm:p-12 prose prose-on-surface max-w-none">
                                                <ReactMarkdown
                                                    components={{
                                                        h1: ({ node, ...props }) => <h1 className="text-3xl font-black mb-6 mt-8" {...props} />,
                                                        h2: ({ node, ...props }) => <h2 className="text-xl font-black mb-4 mt-6 border-b border-surface-container-high pb-2" {...props} />,
                                                        p: ({ node, ...props }) => <p className="text-on-surface-variant leading-relaxed mb-4 font-medium" {...props} />,
                                                        ul: ({ node, ...props }) => <ul className="space-y-2 mb-6 list-none p-0" {...props} />,
                                                        li: ({ node, ...props }) => (
                                                            <li className="flex items-start gap-3">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                                                <span className="text-on-surface-variant font-medium">{props.children}</span>
                                                            </li>
                                                        ),
                                                        strong: ({ node, ...props }) => <strong className="font-bold text-on-surface" {...props} />
                                                    }}
                                                >
                                                    {task.aiStrategy}
                                                </ReactMarkdown>

                                                <div className="mt-8 flex justify-end">
                                                    <button
                                                        onClick={() => showSavedStrategy(task)}
                                                        className="flex items-center gap-2 px-6 py-3 bg-on-surface text-surface rounded-full font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Download PDF
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))
                    ) : (
                        filteredTasks.map((task, i) => (
                            <motion.div
                                key={task._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-surface-container-lowest rounded-3xl p-6 group hover:shadow-xl hover:shadow-on-surface/5 border border-surface-variant/5 transition-all flex flex-col sm:flex-row items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-6 flex-1 w-full">
                                    <div
                                        onClick={() => handleToggleComplete(task)}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 cursor-pointer transition-all ${task.status === 'Completed'
                                                ? 'bg-primary/20 text-primary shadow-sm shadow-primary/20'
                                                : task.priority === 'High' ? 'bg-error/10 text-error' :
                                                    task.priority === 'Moderate' ? 'bg-secondary/10 text-secondary' :
                                                        'bg-surface-container-high/50 text-outline'
                                            }`}
                                    >
                                        {task.status === 'Completed' ? (
                                            <Check className="w-6 h-6" />
                                        ) : (
                                            <div className="w-3 h-3 rounded-full bg-current" />
                                        )}
                                    </div>
                                    <div className="space-y-1 flex-1 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <h3 className={`text-xl font-black tracking-tight transition-all duration-300 truncate ${task.status === 'Completed' ? 'text-on-surface-variant/40 line-through' : 'text-on-surface'
                                                }`}>
                                                {task.title}
                                            </h3>
                                            {task.aiStrategy && (
                                                <div className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-md flex items-center gap-1 shrink-0">
                                                    <Sparkles className="w-2 h-2" />
                                                    AI Strategy Ready
                                                </div>
                                            )}
                                        </div>
                                        <div className={`flex items-center gap-6 text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${task.status === 'Completed' ? 'opacity-40' : 'text-on-surface-variant/60'
                                            }`}>
                                            <span className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3" />
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Deadline'}
                                            </span>
                                            <span>{task.category}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => setDetailTask(task)}
                                        className="p-3 bg-surface-container-low text-on-surface-variant rounded-xl hover:bg-surface-container-high hover:text-primary transition-all relative group/info"
                                    >
                                        <Info className="w-5 h-5" />
                                        <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-3 py-1.5 rounded-lg font-black opacity-0 group-hover/info:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-30 shadow-xl border border-white/10 uppercase tracking-widest">View Details</span>
                                    </button>
                                    <button
                                        onClick={() => handleEditTask(task)}
                                        className="p-3 bg-surface-container-low text-on-surface-variant rounded-xl hover:bg-surface-container-high hover:text-primary transition-all relative group/edit"
                                    >
                                        <Pencil className="w-5 h-5" />
                                        <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-3 py-1.5 rounded-lg font-black opacity-0 group-hover/edit:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-30 shadow-xl border border-white/10 uppercase tracking-widest">Edit Item</span>
                                    </button>
                                    {task.aiStrategy ? (
                                        <button
                                            onClick={() => showSavedStrategy(task)}
                                            className="flex-1 sm:flex-none px-6 py-3 bg-primary/10 text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2 relative group/view"
                                        >
                                            <Wand2 className="w-4 h-4" />
                                            View Insight
                                            <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-3 py-1.5 rounded-lg font-black opacity-0 group-hover/view:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-30 shadow-xl border border-white/10 uppercase tracking-widest">Open Strategy</span>
                                        </button>
                                    ) : (
                                        <button
                                            disabled={isStrategizing || task.status === 'Completed'}
                                            onClick={() => handleStrategize(task)}
                                            className="flex-1 sm:flex-none p-3 bg-surface-container-low text-primary rounded-xl hover:bg-primary/10 transition-all group/ai relative disabled:opacity-30 disabled:grayscale"
                                        >
                                            <Wand2 className="w-5 h-5" />
                                            <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-3 py-1.5 rounded-lg font-black opacity-0 group-hover/ai:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-30 shadow-xl border border-white/10 uppercase tracking-widest">Get AI Strategy</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteTask(task._id)}
                                        className="p-3 bg-surface-container-low text-on-surface-variant rounded-xl hover:bg-error/10 hover:text-error transition-all relative group/delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-error text-white text-[10px] px-3 py-1.5 rounded-lg font-black opacity-0 group-hover/delete:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-30 shadow-xl uppercase tracking-widest">Remove Task</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Shared Task Modals */}
            <TaskModal isOpen={isModalOpen} onClose={closeModal} taskToEdit={null} />
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

            {/* AI Loading Overlay */}
            <AnimatePresence>
                {isStrategizing && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-inverse-surface/40 backdrop-blur-xl flex flex-col items-center justify-center text-white"
                    >
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-16 h-16 ai-gradient rounded-2xl flex items-center justify-center shadow-2xl mb-4">
                            <Wand2 className="w-8 h-8" />
                        </motion.div>
                        <p className="text-sm font-black tracking-widest uppercase">Consulting AI Strategist...</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default TasksListPage;
