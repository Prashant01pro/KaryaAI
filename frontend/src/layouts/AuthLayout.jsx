import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-on-surface">
            {/* Header */}
            <header className="bg-surface/70 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center px-12 py-6 border-b border-surface-container/30">
                <Link to="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">TaskFlow</Link>
                <div className="flex items-center gap-8">
                    <a className="text-on-surface-variant font-medium hover:text-primary transition-all active:scale-95" href="#">Support</a>
                    <Link 
                        to={title === 'Sign In' ? '/signup' : '/login'} 
                        className="ai-gradient text-on-primary px-6 py-2.5 rounded-full font-bold tracking-tight hover:opacity-90 active:scale-95 transition-all"
                    >
                        {title === 'Sign In' ? 'Create Account' : 'Login'}
                    </Link>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center relative px-6 py-12 lg:py-0 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-40">
                    <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary-container/20 blur-[120px] rounded-full"></div>
                    <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-secondary-container/30 blur-[100px] rounded-full"></div>
                </div>

                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
                    {/* Editorial Branding */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hidden lg:flex flex-col gap-8 pr-12"
                    >
                        <h1 className="text-7xl font-black tracking-tight leading-none">
                            Welcome Back to Your <span className="ai-gradient-text">Workspace</span>.
                        </h1>
                        <p className="text-on-surface-variant text-xl max-w-md leading-relaxed">
                            Step back into a world of monolithic grace and ethereal productivity.
                        </p>
                        <div className="mt-8 relative w-full h-[450px] rounded-[3rem] overflow-hidden bg-surface-container-high group border border-surface-variant/20 shadow-2xl">
                            <img
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000"
                                alt="Modern workspace"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60"></div>
                        </div>
                    </motion.div>

                    {/* Form Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex justify-center lg:justify-end"
                    >
                        <div className="bg-surface-container-lowest p-10 lg:p-14 rounded-[3rem] w-full max-w-lg shadow-[0px_30px_60px_rgba(44,47,49,0.08)] flex flex-col gap-10 relative overflow-hidden border border-surface-variant/10">
                            <div className="absolute top-0 left-0 w-2 h-20 ai-gradient"></div>
                            <div className="space-y-3">
                                <h2 className="text-4xl font-black tracking-tight">{title}</h2>
                                <p className="text-on-surface-variant text-lg font-medium">{subtitle}</p>
                            </div>
                            {children}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default AuthLayout;
