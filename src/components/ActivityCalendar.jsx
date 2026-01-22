import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

export default function ActivityCalendar({ transactions = [] }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Helper to get days in month
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    // Helper to get day of week for first day (0 = Sun, 1 = Mon...)
    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // Adjust firstDay to make Monday start (optional, but standard in many apps)
    // Let's stick to Sunday start for standard, or Monday if requested? 
    // Image shows Mon, Tue, Wed... so Monday start.
    const startDayOffset = (firstDay === 0 ? 6 : firstDay - 1); // shift so Mon=0, Sun=6

    const monthData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Map transactions to days
        const activityMap = {}; // day -> { count, total }

        transactions.forEach(tx => {
            const date = new Date(tx.date);
            if (date.getFullYear() === year && date.getMonth() === month) {
                const day = date.getDate();
                if (!activityMap[day]) activityMap[day] = { count: 0, total: 0 };
                activityMap[day].count += 1;
                activityMap[day].total += tx.amount;
            }
        });

        return activityMap;
    }, [currentDate, transactions]);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Activity</h3>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-full p-1 border border-slate-100 dark:border-slate-600">
                    <button onClick={prevMonth} className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded-full transition-colors">
                        <ChevronLeft className="w-4 h-4 text-slate-500" />
                    </button>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2 min-w-[80px] text-center">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={nextMonth} className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded-full transition-colors">
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
                {/* Weekdays */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                    <div key={d} className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                        {d}
                    </div>
                ))}

                {/* Empty Cells */}
                {Array.from({ length: startDayOffset }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const activity = monthData[day];
                    const isToday =
                        new Date().getDate() === day &&
                        new Date().getFullYear() === currentDate.getFullYear() &&
                        new Date().getMonth() === currentDate.getMonth();

                    // Determine intensity color
                    let bgClass = "bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-400";
                    if (activity) {
                        if (activity.total > 5000) bgClass = "bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20";
                        else if (activity.total > 1000) bgClass = "bg-emerald-400 text-white";
                        else if (activity.total > 0) bgClass = "bg-emerald-300 text-white";
                    } else if (isToday) {
                        bgClass = "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800";
                    }

                    return (
                        <div
                            key={`day-${day}`}
                            className="aspect-square flex flex-col items-center justify-center relative group"
                        >
                            <div className={cn(
                                "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                                bgClass,
                                activity && "hover:scale-110 cursor-pointer"
                            )}>
                                {day}
                            </div>

                            {/* Tooltip for activity */}
                            {activity && (
                                <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-1 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap z-10 pointer-events-none transition-opacity">
                                    ₹{activity.total.toLocaleString()}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend / Summary */}
            <div className="flex items-center justify-center gap-4 mt-6 text-[10px] text-slate-400">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
                    <span>Saved</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span>High Impact</span>
                </div>
            </div>
        </div>
    );
}
