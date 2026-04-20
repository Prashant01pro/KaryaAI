import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertCircle } from 'lucide-react';
import { useTasks } from '../../../context/TaskContext';

const TaskModal = ({ isOpen, onClose, taskToEdit = null }) => {
    const { addTask, updateTask } = useTasks();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Moderate',
        category: 'Work',
        status: 'Pending',
        dueDate: ''
    });

    useEffect(() => {
        if (taskToEdit) {
            setFormData({
                title: taskToEdit.title || '',
                description: taskToEdit.description || '',
                priority: taskToEdit.priority || 'Moderate',
                category: taskToEdit.category || 'Work',
                status: taskToEdit.status || 'Pending',
                dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'Moderate',
                category: 'Work',
                status: 'Pending',
                dueDate: ''
            });
        }
    }, [taskToEdit, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (taskToEdit) {
                await updateTask(taskToEdit._id, formData);
            } else {
                await addTask(formData);
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

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
                            <div className="flex items-center justify-between">
                                <h3 className="text-3xl font-black tracking-tight">
                                    {taskToEdit ? 'Refine Task' : 'New Objective'}
                                </h3>
                                <button onClick={onClose} className="p-3 hover:bg-surface-container rounded-2xl transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-error/10 border border-error/20 rounded-2xl flex items-center gap-3 text-error text-sm font-bold"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                    {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Title</label>
                                    <input 
                                        required
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="What needs to be done?"
                                        className="w-full bg-surface-container-low border border-surface-variant/10 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Description</label>
                                    <textarea 
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Add more details..."
                                        className="w-full bg-surface-container-low border border-surface-variant/10 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Priority</label>
                                        <select 
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                            className="w-full bg-surface-container-low border border-surface-variant/10 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        >
                                            <option value="High">High</option>
                                            <option value="Moderate">Moderate</option>
                                            <option value="Low">Low</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Category</label>
                                        <select 
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-surface-container-low border border-surface-variant/10 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        >
                                            <option value="Work">Work</option>
                                            <option value="Personal">Personal</option>
                                            <option value="Study">Study</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                     <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Status</label>
                                        <select 
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-surface-container-low border border-surface-variant/10 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Due Date</label>
                                        <input 
                                            type="date"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                            className="w-full bg-surface-container-low border border-surface-variant/10 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <button 
                                    disabled={loading}
                                    type="submit"
                                    className="w-full ai-gradient text-on-primary py-5 rounded-full font-black text-xl flex items-center justify-center gap-3 hover:opacity-95 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-6 h-6" />
                                            {taskToEdit ? 'Update Task' : 'Initialize Task'}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TaskModal;
