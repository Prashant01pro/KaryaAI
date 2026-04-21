import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { RiGithubFill } from 'react-icons/ri';
import AuthLayout from '../../../layouts/AuthLayout';
import { useAuth } from '../../../hooks/useAuth';

import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [formData, setFormData] = React.useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout 
            title="Sign In" 
            subtitle="Enter your credentials to continue."
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-error/10 border border-error/20 rounded-xl text-error text-[10px] font-bold"
                    >
                        {error}
                    </motion.div>
                )}
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant px-1" htmlFor="email">Email Address</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            required
                            className="w-full bg-surface-container-high border-none rounded-xl py-3.5 pl-12 pr-4 text-on-surface text-sm placeholder:text-outline/40 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            id="email"
                            placeholder="alex@taskflow.com"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant" htmlFor="password">Password</label>
                        <a className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline" href="#">Forgot?</a>
                    </div>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            required
                            className="w-full bg-surface-container-high border-none rounded-xl py-3.5 pl-12 pr-4 text-on-surface text-sm placeholder:text-outline/40 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            id="password"
                            placeholder="••••••••"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                </div>

                <motion.button
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-4 rounded-full ai-gradient text-on-primary font-black text-sm hover:opacity-95 transition-all flex justify-center items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                    type="submit"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Sign In
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </motion.button>
            </form>

            <div className="flex items-center gap-4 py-1">
                <div className="h-[1px] flex-grow bg-surface-container-high"></div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-outline/60 font-black">Or continue with</span>
                <div className="h-[1px] flex-grow bg-surface-container-high"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all active:scale-95 group border border-surface-variant/10">
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all active:scale-95 group border border-surface-variant/10">
                    <RiGithubFill className="text-on-surface-variant group-hover:text-on-surface transition-colors" size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">GitHub</span>
                </button>
            </div>

            <p className="text-center text-[11px] text-on-surface-variant font-medium mt-1">
                Don't have an account? <Link to="/signup" className="text-primary font-black hover:underline ml-1">Create Account</Link>
            </p>
        </AuthLayout>
    );
};

export default LoginPage;
