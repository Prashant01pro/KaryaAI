import React, { useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
    format, 
    subYears, 
    eachDayOfInterval, 
    isSameDay, 
    startOfWeek, 
    endOfWeek, 
    isFirstDayOfMonth, 
    startOfMonth 
} from 'date-fns';

const ContributionGraph = ({ tasks, onDateClick, selectedDate }) => {
    const scrollRef = useRef(null);
    const today = new Date();
    const oneYearAgo = subYears(today, 1);
    
    // Align to the start of the week (Monday)
    const startDate = startOfWeek(oneYearAgo, { weekStartsOn: 1 });
    const endDate = endOfWeek(today, { weekStartsOn: 1 });

    // Generate all days for the interval
    const days = useMemo(() => {
        return eachDayOfInterval({
            start: startDate,
            end: endDate,
        });
    }, [startDate, endDate]);

    // Group tasks by date
    const taskCounts = useMemo(() => {
        const counts = {};
        tasks.forEach(task => {
            const dateStr = format(new Date(task.createdAt), 'yyyy-MM-dd');
            counts[dateStr] = (counts[dateStr] || 0) + 1;
        });
        return counts;
    }, [tasks]);

    // Group days into weeks for the grid
    const weeks = useMemo(() => {
        const weeksArr = [];
        for (let i = 0; i < days.length; i += 7) {
            weeksArr.push(days.slice(i, i + 7));
        }
        return weeksArr;
    }, [days]);

    // Auto-scroll to the end (today) on mount
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, []);

    const getLevel = (count) => {
        if (!count) return 0;
        if (count <= 1) return 1;
        if (count <= 3) return 2;
        if (count <= 5) return 3;
        return 4;
    };

    const colors = [
        'bg-surface-container-high', // Level 0
        'bg-primary/30',            // Level 1
        'bg-primary/50',            // Level 2
        'bg-primary/80',            // Level 3
        'bg-primary',               // Level 4
    ];

    const BOX_SIZE = 11;
    const GAP = 3.5;
    const COLUMN_WIDTH = BOX_SIZE + GAP;

    return (
        <div className="bg-surface-container-low rounded-[3rem] p-8 border border-surface-variant/10 space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-xl font-black tracking-tight">
                    Activity Matrix
                </h4>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest">Less</span>
                    <div className="flex gap-1">
                        {colors.map((color, i) => (
                            <div key={i} className={`w-2.5 h-2.5 rounded-[2px] ${color}`} />
                        ))}
                    </div>
                    <span className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest">More</span>
                </div>
            </div>

            <div 
                ref={scrollRef}
                className="overflow-x-auto pb-4 custom-scrollbar scroll-smooth"
            >
                <div className="inline-block" style={{ minWidth: weeks.length * COLUMN_WIDTH + 40 }}>
                    {/* Month Labels */}
                    <div className="flex mb-2 ml-8 relative h-4">
                        {weeks.map((week, i) => {
                            const firstDay = week[0];
                            const isNewMonth = isFirstDayOfMonth(firstDay) || (i === 0) || (firstDay.getDate() <= 7 && isFirstDayOfMonth(startOfMonth(firstDay)));
                            
                            if (isNewMonth && firstDay.getDate() <= 7) {
                                return (
                                    <div 
                                        key={i} 
                                        className="absolute text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 whitespace-nowrap"
                                        style={{ left: `${i * COLUMN_WIDTH}px` }}
                                    >
                                        {format(firstDay, 'MMM')}
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>

                    <div className="flex gap-2">
                        {/* Day Labels */}
                        <div className="flex flex-col justify-between py-0.5 text-[9px] font-black uppercase tracking-widest text-on-surface-variant/30 w-6 shrink-0">
                            <span>Mon</span>
                            <span>Wed</span>
                            <span>Fri</span>
                            <span>Sun</span>
                        </div>

                        {/* The Grid */}
                        <div className="flex gap-[3.5px]">
                            {weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="flex flex-col gap-[3.5px]">
                                    {week.map((day, dayIndex) => {
                                        const dateStr = format(day, 'yyyy-MM-dd');
                                        const count = taskCounts[dateStr] || 0;
                                        const level = getLevel(count);
                                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                                        const isToday = isSameDay(day, new Date());
                                        
                                        return (
                                            <motion.div
                                                key={dateStr}
                                                whileHover={{ scale: 1.3, zIndex: 10 }}
                                                onClick={() => onDateClick(day)}
                                                className={`w-[11px] h-[11px] rounded-[2px] cursor-pointer transition-all ${colors[level]} ${
                                                    isSelected 
                                                        ? 'ring-2 ring-primary ring-offset-1 ring-offset-surface-container-low z-10 scale-110 shadow-lg shadow-primary/40' 
                                                        : isToday ? 'border border-primary/40' : ''
                                                }`}
                                                title={`${count} tasks on ${format(day, 'MMM d, yyyy')}`}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-surface-variant/5">
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40">
                    {tasks.length} total objectives tracked
                </p>
                <button 
                    onClick={() => onDateClick(new Date())}
                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:opacity-70 transition-opacity"
                >
                    Reset to Today
                </button>
            </div>
        </div>
    );
};

export default ContributionGraph;
