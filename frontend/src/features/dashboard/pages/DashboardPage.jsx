import React from 'react';
import { motion } from 'framer-motion';
import { 
    Search, 
    Settings, 
    ChevronRight, 
    Calendar,
    Users,
    TrendingUp,
    Lightbulb,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useDashboardData } from '../hooks/useDashboardData';

const DashboardPage = () => {
    const { tasks, projects, loading } = useDashboardData();

    if (loading) {
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
                <div className="space-y-2">
                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black tracking-tight"
                    >
                        Good morning, Alex.
                    </motion.h2>
                    <p className="text-on-surface-variant text-xl font-medium">
                        You have <span className="text-primary font-black">{tasks.filter(t => t.priority === 'High').length} high-priority</span> tasks to tackle today.
                    </p>
                </div>

                {/* AI Hero Section */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ai-gradient rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-primary/20"
                >
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                            transition={{ duration: 10, repeat: Infinity }}
                            className="w-full h-full bg-white/20 blur-[100px] rounded-full"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="max-w-2xl space-y-6">
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full w-fit border border-white/20">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Workspace Intelligence</span>
                            </div>
                            <h3 className="text-4xl font-black leading-tight">Focus Suggestion: Finalize the Q4 Brand Strategy</h3>
                            <p className="text-on-primary/80 text-xl leading-relaxed">Based on your recent activity and upcoming deadlines, completing this task now will free up 4 hours of focus time tomorrow.</p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <button className="bg-white text-primary font-black px-8 py-4 rounded-full flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10">
                                    Start Focused Work
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                <button className="bg-white/10 backdrop-blur-md text-white font-black px-8 py-4 rounded-full border border-white/20 hover:bg-white/20 transition-all active:scale-95">
                                    Reschedule for later
                                </button>
                            </div>
                        </div>
                        
                        <div className="hidden lg:block w-72 h-72 bg-white/10 backdrop-blur-2xl rounded-[3rem] border border-white/20 p-8 shadow-2xl">
                            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-6">Workload Impact</p>
                            <div className="flex items-end gap-3 h-32 mb-4">
                                {[40, 60, 90, 30].map((h, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className={`w-full bg-white/${i === 2 ? '100' : '40'} rounded-t-xl`}
                                    />
                                ))}
                            </div>
                            <p className="text-xl font-black text-center">-22% Today</p>
                        </div>
                    </div>
                </motion.section>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Tasks Panel */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between pb-4 border-b border-surface-container-high/50">
                            <h4 className="text-3xl font-black tracking-tight">Your Tasks</h4>
                            <div className="flex gap-4">
                                <button className="bg-surface-container-low p-3 rounded-2xl text-on-surface-variant hover:text-primary transition-all border border-surface-variant/10">
                                    <Settings className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {tasks.map((task, i) => (
                                <motion.div 
                                    key={task.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-surface-container-lowest rounded-[2rem] p-8 group hover:shadow-[0px_20px_40px_rgba(44,47,49,0.06)] border border-surface-variant/5 transition-all relative"
                                >
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-16 w-1 ai-gradient rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-8 h-8 rounded-xl border-2 border-outline/20 flex items-center justify-center cursor-pointer hover:border-primary transition-all group/check translate-y-1">
                                                <div className="w-4 h-4 rounded-md ai-gradient opacity-0 group-hover/check:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="space-y-1">
                                                <h5 className="text-2xl font-black tracking-tight text-on-surface">{task.title}</h5>
                                                <div className="flex items-center gap-6 text-on-surface-variant text-xs font-black uppercase tracking-widest pt-1">
                                                    <span className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-primary" />
                                                        Due {task.due}
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-secondary" />
                                                        {task.team}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                                            task.priority === 'High' ? 'bg-error/10 text-error' : 
                                            task.priority === 'Medium' ? 'bg-secondary/10 text-secondary' : 
                                            'bg-surface-container-high/50 text-outline'
                                        }`}>
                                            {task.priority} Priority
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Side Panel */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="space-y-8">
                            <h4 className="text-3xl font-black tracking-tight pb-4 border-b border-surface-container-high/50">Active Projects</h4>
                            <div className="space-y-6">
                                {projects.map((project, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                        className="bg-surface-container-low rounded-3xl p-8 border border-surface-variant/5 space-y-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h6 className="text-xl font-black tracking-tight">{project.name}</h6>
                                            <span className={`text-sm font-black text-primary`}>{project.progress}%</span>
                                        </div>
                                        <div className="w-full bg-surface-container-high rounded-full h-2">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${project.progress}%` }}
                                                transition={{ duration: 1.5, delay: 0.5 }}
                                                className={`bg-primary h-full rounded-full`} 
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{project.tasksLeft} Tasks left</p>
                                            <button className={`flex items-center text-primary hover:underline text-sm font-black group`}>
                                                View Details
                                                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-on-surface p-10 rounded-[3rem] relative overflow-hidden text-surface shadow-2xl">
                            <div className="relative z-10 space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Weekly Completion</p>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-6xl font-black">128</span>
                                    <span className="text-lg font-black text-primary">+12.5%</span>
                                </div>
                                <TrendingUp className="w-8 h-8 text-primary" />
                            </div>
                            <div className="absolute -right-12 -bottom-12 opacity-5">
                                <Search className="w-64 h-64" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;
