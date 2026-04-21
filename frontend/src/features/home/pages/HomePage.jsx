import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { APP_NAME } from '../../../constants';

const HomePage = () => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            {/* Top Bar for Landing Page */}
            <header className="fixed top-0 left-0 w-full z-50 glass-panel border-b border-surface-container/50 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 ai-gradient rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-sm"><img className='rounded-lg scale-120' src="https://play-lh.googleusercontent.com/x-A_RKLUz6tmGrwQRZhDajcESjwGNlk4niGr2tOk_SwX6vBcRYU21iIba9eHQLCXrYU" alt="logo" /></span>
                    </div>
                    <span className="text-xl font-extrabold tracking-tight">{APP_NAME}</span>
                </div>

                <div className="flex items-center gap-6">
                    <Link to="/login" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Log In</Link>
                    <Link to="/signup" className="ai-gradient text-on-primary px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 active:scale-95 transition-all">
                        Get Started
                    </Link>
                </div>
            </header>

            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 45, 0],
                        x: [0, 100, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-primary-container/10 blur-[150px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -30, 0],
                        x: [0, -150, 0],
                        y: [0, -100, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-secondary-container/20 blur-[120px] rounded-full"
                />
            </div>

            <main className="relative pt-32 pb-20 px-6 container mx-auto flex flex-col items-center">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low border border-surface-variant/20 mb-8 pointer-events-none">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">The Future of Productivity</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none mb-8 text-on-surface">
                        Orchestrate Your Tasks with <span className="ai-gradient-text">Monolithic Grace</span>
                    </h1>

                    <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-2xl mx-auto mb-12">
                        KaryaAI transcends ordinary task management. Experience a sanctuary where AI intelligence meets editorial design to create the ultimate workspace.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/signup" className="group ai-gradient text-on-primary px-10 py-5 rounded-full font-black text-xl flex items-center gap-3 hover:opacity-95 transform transition-all active:scale-95 shadow-xl shadow-primary/20">
                            Create Your Sanctuary
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="px-10 py-5 rounded-full bg-surface-container-high text-on-surface font-bold text-xl hover:bg-surface-variant transition-all">
                            Explore Features
                        </button>
                    </div>
                </motion.div>

                {/* Feature Preview Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full"
                >
                    <div className="bg-surface-container-lowest/50 backdrop-blur-sm p-10 rounded-[2.5rem] border border-surface-variant/10 hover:border-primary/20 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">AI Synthesis</h3>
                        <p className="text-on-surface-variant leading-relaxed">Let our ethereal logic handle task prioritization and workflow optimization automatically.</p>
                    </div>

                    <div className="bg-surface-container-lowest/50 backdrop-blur-sm p-10 rounded-[2.5rem] border border-surface-variant/10 hover:border-secondary/20 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-8 group-hover:scale-110 transition-transform">
                            <Layers className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Tonal Layering</h3>
                        <p className="text-on-surface-variant leading-relaxed">Clean, editorial layouts designed for maximum focus and minimal cognitive load.</p>
                    </div>

                    <div className="bg-surface-container-lowest/50 backdrop-blur-sm p-10 rounded-[2.5rem] border border-surface-variant/10 hover:border-tertiary/20 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary mb-8 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Ethereal Security</h3>
                        <p className="text-on-surface-variant leading-relaxed">Enterprise-grade security wrapped in an interface that feels light as air.</p>
                    </div>
                </motion.div>

                {/* Visual Showcase (Mockup) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="mt-32 w-full max-w-6xl relative"
                >
                    <div className="absolute inset-0 ai-gradient opacity-20 blur-[100px] rounded-full scale-75 -z-10" />
                    <div className="bg-surface-container-lowest p-4 rounded-[3rem] shadow-2xl border border-surface-variant/20 overflow-hidden">
                        <div className="bg-background rounded-[2rem] h-[500px] overflow-hidden relative">
                            {/* Mockup Content */}
                            <div className="absolute inset-x-0 top-0 h-16 border-b border-surface-container flex items-center px-10">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-error/40" />
                                    <div className="w-3 h-3 rounded-full bg-tertiary/40" />
                                    <div className="w-3 h-3 rounded-full bg-primary/40" />
                                </div>
                            </div>
                            <div className="p-10 pt-24 grid grid-cols-12 gap-6 h-full">
                                <div className="col-span-3 space-y-4">
                                    <div className="h-10 bg-surface-container-high rounded-lg w-full" />
                                    <div className="h-6 bg-surface-container-low rounded-lg w-[80%]" />
                                    <div className="h-6 bg-surface-container-low rounded-lg w-[90%]" />
                                    <div className="h-6 bg-surface-container-low rounded-lg w-[70%]" />
                                </div>
                                <div className="col-span-9 space-y-6">
                                    <div className="h-32 ai-gradient rounded-2xl w-full opacity-40 animate-pulse" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-40 bg-surface-container-lowest rounded-2xl w-full border border-surface-container-high shadow-sm" />
                                        <div className="h-40 bg-surface-container-lowest rounded-2xl w-full border border-surface-container-high shadow-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="relative mt-20 border-t border-surface-container/50 py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                    © 2024 TaskFlow. Designed with Monolithic Grace.
                </div>
                <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                    <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms</a>
                    <a href="#" className="hover:text-primary transition-colors">Security</a>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
