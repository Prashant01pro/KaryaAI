import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { RiGithubFill } from 'react-icons/ri';
import AuthLayout from '../../../layouts/AuthLayout';

const SignupPage = () => {
    return (
        <AuthLayout 
            title="Create your account" 
            subtitle="Start your journey with monolithic grace."
        >
            <form className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="name">Full Name</label>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                            <User className="w-5 h-5" />
                        </div>
                        <input className="w-full pl-14 pr-5 py-4 bg-surface-container-high rounded-2xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-outline font-medium" id="name" placeholder="John Doe" type="text"/>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input className="w-full pl-14 pr-5 py-4 bg-surface-container-high rounded-2xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-outline font-medium" id="email" placeholder="name@example.com" type="email"/>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="password">Password</label>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input className="w-full pl-14 pr-5 py-4 bg-surface-container-high rounded-2xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-outline font-medium" id="password" placeholder="••••••••" type="password"/>
                    </div>
                </div>

                <div className="flex items-center gap-3 px-1">
                    <input className="w-5 h-5 rounded-lg text-primary focus:ring-primary/20 border-surface-variant bg-surface-container-high cursor-pointer" id="terms" type="checkbox"/>
                    <label className="text-sm font-medium text-on-surface-variant" htmlFor="terms">I agree to the <a className="text-primary font-black hover:underline" href="#">Terms of Service</a></label>
                </div>

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full ai-gradient text-on-primary py-5 rounded-full font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all" 
                    type="submit"
                >
                    Sign Up
                    <ArrowRight className="w-6 h-6" />
                </motion.button>
            </form>

            <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 py-4 bg-surface-container-lowest rounded-2xl font-black text-[10px] uppercase tracking-widest text-on-surface-variant hover:bg-white transition-all duration-200 border border-surface-variant/20 shadow-sm active:scale-95 group">
                    <img alt="Google" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" src="https://www.google.com/favicon.ico"/>
                    <span>Google</span>
                </button>
                <button className="flex items-center justify-center gap-3 py-4 bg-surface-container-lowest rounded-2xl font-black text-[10px] uppercase tracking-widest text-on-surface-variant hover:bg-white transition-all duration-200 border border-surface-variant/20 shadow-sm active:scale-95 group">
                    <RiGithubFill className="text-on-surface-variant group-hover:text-on-surface transition-colors" size={20} />
                    <span>GitHub</span>
                </button>
            </div>

            <p className="text-center text-on-surface-variant text-sm font-medium mt-4">
                Already have an account? <Link to="/login" className="text-primary font-black hover:underline ml-1">Log in</Link>
            </p>
        </AuthLayout>
    );
};

export default SignupPage;
