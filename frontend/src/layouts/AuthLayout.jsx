import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen w-screen flex flex-col bg-background text-on-surface relative overflow-x-hidden">
            {/* Header */}
            {/* Header - Made absolute to allow full-screen main content */}
            <header className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-6 sm:px-10 py-6 bg-transparent">
                <Link to="/" className="text-2xl sm:text-3xl font-extrabold tracking-tighter hover:opacity-80 transition-opacity flex items-center gap-3">
                    <div className="w-8 h-8 ai-gradient rounded-lg flex items-center justify-center text-white shrink-0">
                        <span className="material-symbols-outlined text-sm"><img className='rounded-lg scale-120' src="https://play-lh.googleusercontent.com/x-A_RKLUz6tmGrwQRZhDajcESjwGNlk4niGr2tOk_SwX6vBcRYU21iIba9eHQLCXrYU" alt="logo" /></span>
                    </div>
                    <span className="hidden xs:inline">KaryaAI</span>
                </Link>
                <div className="flex items-center gap-4 sm:gap-8">
                    <a className="hidden sm:inline text-on-surface-variant font-medium hover:text-primary transition-all active:scale-95" href="#">Support</a>
                    <Link
                        to={title === 'Sign In' ? '/signup' : '/login'}
                        className="ai-gradient text-on-primary px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-tight hover:opacity-90 active:scale-95 transition-all"
                    >
                        {title === 'Sign In' ? 'Create Account' : 'Login'}
                    </Link>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center relative px-6 lg:px-12 py-24 lg:py-0 min-h-screen">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-primary-container/30 blur-[150px] rounded-full opacity-60"></div>
                    <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-secondary-container/40 blur-[120px] rounded-full opacity-70"></div>
                    <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-tertiary-container/20 blur-[100px] rounded-full opacity-40"></div>
                </div>

                <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center z-10">
                    {/* Editorial Branding */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hidden lg:flex flex-col gap-6 pr-8"
                    >
                        <h1 className="text-6xl font-black tracking-tight leading-none">
                            Your <span className="ai-gradient-text">Workspace</span>.
                        </h1>
                        <p className="text-on-surface-variant text-lg max-w-sm leading-relaxed font-medium">
                            Step back into a world of monolithic grace and ethereal productivity.
                        </p>
                        <div className="mt-4 relative w-full h-[380px] rounded-[2.5rem] overflow-hidden bg-surface-container-high group border border-surface-variant/20 shadow-xl">
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
                        <div className="bg-surface-container-lowest/80 backdrop-blur-2xl p-8 lg:p-10 rounded-[2.5rem] w-full max-w-md shadow-[0px_30px_60px_rgba(44,47,49,0.1)] flex flex-col gap-8 relative overflow-y-auto max-h-[85vh] custom-scrollbar border border-white/40">
                            <div className="absolute top-0 left-0 w-2 h-16 ai-gradient"></div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black tracking-tight">{title}</h2>
                                <p className="text-on-surface-variant text-base font-medium">{subtitle}</p>
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
