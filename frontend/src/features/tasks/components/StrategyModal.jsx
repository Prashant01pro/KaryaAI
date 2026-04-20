import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Wand2, Download, Copy, Check, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const StrategyModal = ({ isOpen, onClose, strategy, taskTitle }) => {
    const [copied, setCopied] = React.useState(false);
    const [isDownloading, setIsDownloading] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(strategy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            const element = document.getElementById('strategy-content');
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${taskTitle.replace(/\s+/g, '_')}_Strategy.pdf`);
        } catch (error) {
            console.error('PDF Export failed:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsDownloading(false);
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
                        className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-xl"
                    />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40 }}
                        className="relative w-full max-w-4xl bg-surface-container-lowest rounded-[3rem] shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="ai-gradient p-10 text-white relative shrink-0">
                            <div className="absolute top-0 right-0 w-64 h-full bg-white/10 blur-[60px] rounded-full -mr-20 -mt-10" />
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                            <Wand2 className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">AI Strategy Core</span>
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tight">{taskTitle}</h3>
                                </div>
                                <button onClick={onClose} className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-10 sm:p-14 custom-scrollbar bg-white" id="strategy-content">
                            <div className="prose prose-on-surface max-w-none">
                                <ReactMarkdown 
                                    components={{
                                        h1: ({node, ...props}) => <h1 className="text-4xl font-black tracking-tight mb-8 mt-12 first:mt-0" {...props} />,
                                        h2: ({node, ...props}) => <h2 className="text-2xl font-black tracking-tight mb-6 mt-10 border-b border-surface-container-high pb-4" {...props} />,
                                        h3: ({node, ...props}) => <h3 className="text-xl font-bold mb-4 mt-8" {...props} />,
                                        p: ({node, ...props}) => <p className="text-on-surface-variant leading-relaxed mb-6 font-medium text-lg" {...props} />,
                                        ul: ({node, ...props}) => <ul className="space-y-4 mb-8 list-none p-0" {...props} />,
                                        li: ({node, ...props}) => (
                                            <li className="flex items-start gap-4">
                                                <div className="w-2 h-2 rounded-full bg-primary mt-2.5 shrink-0" />
                                                <span className="text-on-surface-variant font-medium text-lg">{props.children}</span>
                                            </li>
                                        ),
                                        strong: ({node, ...props}) => <strong className="font-black text-on-surface" {...props} />,
                                        hr: () => <hr className="my-12 border-surface-container-high" />
                                    }}
                                >
                                    {strategy}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-8 border-t border-surface-container flex items-center justify-between bg-surface-container-lowest shrink-0">
                            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
                                <Sparkles className="w-4 h-4" />
                                Optimized by Gemini 1.5
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 px-6 py-3 bg-surface-container-high rounded-full font-black text-sm hover:bg-surface-variant transition-all active:scale-95"
                                >
                                    {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied' : 'Copy Plan'}
                                </button>
                                <button 
                                    onClick={handleDownloadPDF}
                                    disabled={isDownloading}
                                    className="flex items-center gap-2 px-8 py-3 bg-on-surface text-surface rounded-full font-black text-sm hover:opacity-90 transition-all active:scale-95 shadow-xl disabled:opacity-50"
                                >
                                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                    {isDownloading ? 'Exporting...' : 'Export PDF'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default StrategyModal;
