import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Save, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const EditProfileModal = ({ isOpen, onClose }) => {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await updateProfile({ name, email });
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-surface-container-lowest rounded-[3rem] shadow-2xl overflow-hidden border border-surface-variant/10"
                    >
                        {/* Header */}
                        <div className="p-10 pb-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 ai-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black tracking-tight">Identity Hub</h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Update your matrix credentials</p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-3 hover:bg-surface-container-low rounded-2xl transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 pt-0 space-y-8">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-error/10 text-error rounded-2xl text-xs font-bold border border-error/20"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {success && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-primary/10 text-primary rounded-2xl text-xs font-bold border border-primary/20 flex items-center gap-3"
                                >
                                    <Save className="w-4 h-4" />
                                    Identity updated successfully!
                                </motion.div>
                            )}

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Public Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
                                        <input 
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-16 pr-8 py-5 bg-surface-container-low border border-surface-variant/10 rounded-[1.5rem] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-on-surface outline-none"
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
                                        <input 
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-16 pr-8 py-5 bg-surface-container-low border border-surface-variant/10 rounded-[1.5rem] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-on-surface outline-none"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading || success}
                                className="w-full ai-gradient text-on-primary py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                {loading ? 'Syncing...' : success ? 'Updated' : 'Commit Changes'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditProfileModal;
