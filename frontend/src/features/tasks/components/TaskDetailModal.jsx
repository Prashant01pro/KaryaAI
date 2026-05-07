import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, Clock, AlignLeft, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const TaskDetailModal = ({ isOpen, onClose, task }) => {
    if (!task) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-xl bg-surface-container-lowest rounded-[3rem] shadow-2xl overflow-hidden border border-surface-variant/20"
                    >
                        <div className="p-8 sm:p-12 space-y-8">
                            <div className="flex items-start justify-between border-b border-surface-container-high/50 pb-6 gap-4">
                                <h3 className="text-3xl font-black tracking-tight break-words flex-1 mt-1">
                                    {task.title}
                                </h3>
                                <button onClick={onClose} className="p-3 hover:bg-surface-container rounded-2xl transition-all shrink-0">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                        <AlignLeft className="w-3 h-3" /> Description
                                    </h4>
                                    <p className="text-on-surface-variant font-medium leading-relaxed bg-surface-container-low p-6 rounded-3xl min-h-[100px] break-words whitespace-pre-wrap shadow-inner">
                                        {task.description || 'No description provided.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 bg-surface-container-low p-6 rounded-3xl border border-surface-variant/5">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 flex items-center gap-2">
                                            <Tag className="w-3 h-3" /> Category
                                        </h4>
                                        <p className="text-on-surface font-bold text-lg">{task.category}</p>
                                    </div>
                                    <div className="space-y-2 bg-surface-container-low p-6 rounded-3xl border border-surface-variant/5">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 flex items-center gap-2">
                                            <AlertCircle className="w-3 h-3" /> Priority
                                        </h4>
                                        <p className={`text-lg font-bold ${task.priority === 'High' ? 'text-error' : task.priority === 'Moderate' ? 'text-secondary' : 'text-on-surface'}`}>{task.priority}</p>
                                    </div>
                                    <div className="space-y-2 bg-surface-container-low p-6 rounded-3xl border border-surface-variant/5">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 flex items-center gap-2">
                                            <Clock className="w-3 h-3" /> Status
                                        </h4>
                                        <p className={`text-lg font-bold ${task.status === 'Completed' ? 'text-primary' : 'text-on-surface'}`}>{task.status}</p>
                                    </div>
                                    <div className="space-y-2 bg-surface-container-low p-6 rounded-3xl border border-surface-variant/5">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 flex items-center gap-2">
                                            <Calendar className="w-3 h-3" /> Due Date
                                        </h4>
                                        <p className="text-on-surface font-bold text-lg">
                                            {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'None'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="text-center pt-4">
                                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                                         Created on {format(new Date(task.createdAt), 'MMM d, yyyy h:mm a')}
                                     </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TaskDetailModal;
