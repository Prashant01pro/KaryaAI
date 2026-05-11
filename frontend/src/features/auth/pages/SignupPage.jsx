import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, AtSign } from 'lucide-react';
import { RiGithubFill } from 'react-icons/ri';
import AuthLayout from '../../../layouts/AuthLayout';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const SignupPage = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [formData, setFormData] = React.useState({ 
        name: '', 
        username: '', 
        email: '', 
        password: '' 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signup(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout 
            title="Create account" 
            subtitle="Start your journey with TaskFlow."
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-error/10 border border-error/20 rounded-2xl text-error text-[10px] font-bold"
                    >
                        {error}
                    </motion.div>
                )}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface ml-1" htmlFor="name">Full Name</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                            <User className="w-4 h-4" />
                        </div>
                        <input 
                            required
                            className="w-full pl-12 pr-4 py-3 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all duration-300 placeholder:text-outline/60 font-medium text-sm text-on-surface" 
                            id="name" 
                            placeholder="John Doe" 
                            type="text"
                            autoComplete="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface ml-1" htmlFor="username">Username</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                            <AtSign className="w-4 h-4" />
                        </div>
                        <input 
                            required
                            className="w-full pl-12 pr-4 py-3 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all duration-300 placeholder:text-outline/60 font-medium text-sm text-on-surface" 
                            id="username" 
                            placeholder="johndoe" 
                            type="text"
                            autoComplete="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface ml-1" htmlFor="email">Email Address</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input 
                            required
                            className="w-full pl-12 pr-4 py-3 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all duration-300 placeholder:text-outline/60 font-medium text-sm text-on-surface" 
                            id="email" 
                            placeholder="name@example.com" 
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface ml-1" htmlFor="password">Password</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input 
                            required
                            className="w-full pl-12 pr-4 py-3 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all duration-300 placeholder:text-outline/60 font-medium text-sm text-on-surface" 
                            id="password" 
                            placeholder="••••••••" 
                            type="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 px-1">
                    <input required className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-surface-variant bg-surface-container-high cursor-pointer" id="terms" type="checkbox"/>
                    <label className="text-[10px] font-medium text-on-surface-variant" htmlFor="terms">I agree to the <a className="text-primary font-black hover:underline" href="#">Terms</a></label>
                </div>

                <motion.button 
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full ai-gradient text-on-primary py-3.5 rounded-full font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all disabled:opacity-50" 
                    type="submit"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Sign Up
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </motion.button>
            </form>

            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google`}
                    className="flex items-center justify-center gap-2 py-3 bg-surface-container-lowest rounded-xl font-black text-[9px] uppercase tracking-widest text-on-surface-variant hover:bg-white transition-all duration-200 border border-surface-variant/20 shadow-sm active:scale-95 group"
                >
                    <img alt="Google" className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" src="https://www.google.com/favicon.ico"/>
                    <span>Google</span>
                </button>
                <button 
                    onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/github`}
                    className="flex items-center justify-center gap-2 py-3 bg-surface-container-lowest rounded-xl font-black text-[9px] uppercase tracking-widest text-on-surface-variant hover:bg-white transition-all duration-200 border border-surface-variant/20 shadow-sm active:scale-95 group"
                >
                    <RiGithubFill className="text-on-surface-variant group-hover:text-on-surface transition-colors" size={16} />
                    <span>GitHub</span>
                </button>
            </div>

            <p className="text-center text-on-surface-variant text-[11px] font-medium mt-1">
                Already have an account? <Link to="/login" className="text-primary font-black hover:underline ml-1">Log in</Link>
            </p>
        </AuthLayout>
    );
};

export default SignupPage;
