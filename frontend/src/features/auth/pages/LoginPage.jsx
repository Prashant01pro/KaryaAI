import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { RiGithubFill } from 'react-icons/ri';
import AuthLayout from '../../../layouts/AuthLayout';
import { useAuth } from '../../../hooks/useAuth';

const LoginPage = () => {
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(); // Mock login for now
    };

    return (
        <AuthLayout 
            title="Sign In" 
            subtitle="Please enter your credentials below."
        >
            <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant px-1" htmlFor="email">Email Address</label>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input
                            className="w-full bg-surface-container-high border-none rounded-2xl py-5 pl-14 pr-5 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            id="email"
                            placeholder="alex@taskflow.com"
                            type="email"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant" htmlFor="password">Password</label>
                        <a className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline" href="#">Forgot?</a>
                    </div>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            className="w-full bg-surface-container-high border-none rounded-2xl py-5 pl-14 pr-5 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            id="password"
                            placeholder="••••••••"
                            type="password"
                        />
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-5 rounded-full ai-gradient text-on-primary font-black text-xl hover:opacity-95 transition-all flex justify-center items-center gap-3 shadow-xl shadow-primary/20"
                    type="submit"
                >
                    Sign In
                    <ArrowRight className="w-6 h-6" />
                </motion.button>
            </form>

            <div className="flex items-center gap-6 py-2">
                <div className="h-[1px] flex-grow bg-surface-container-high"></div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-outline font-black">Or continue with</span>
                <div className="h-[1px] flex-grow bg-surface-container-high"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all active:scale-95 group border border-surface-variant/10">
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" />
                    <span className="text-sm font-black uppercase tracking-widest">Google</span>
                </button>
                <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all active:scale-95 group border border-surface-variant/10">
                    <RiGithubFill className="text-on-surface-variant group-hover:text-on-surface transition-colors" size={24} />
                    <span className="text-sm font-black uppercase tracking-widest">GitHub</span>
                </button>
            </div>

            <p className="text-center text-sm text-on-surface-variant font-medium mt-4">
                Don't have an account? <Link to="/signup" className="text-primary font-black hover:underline ml-1">Create Account</Link>
            </p>
        </AuthLayout>
    );
};

export default LoginPage;
