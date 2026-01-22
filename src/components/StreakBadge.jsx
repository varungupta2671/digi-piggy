import { Flame, TrendingUp } from 'lucide-react';
import { cn } from '../utils/cn';

export default function StreakBadge({ currentStreak, longestStreak = 0, className }) {
    const getStreakColor = (streak) => {
        if (streak >= 30) return 'from-red-500 to-orange-600';
        if (streak >= 14) return 'from-orange-500 to-yellow-500';
        if (streak >= 7) return 'from-yellow-500 to-amber-500';
        if (streak >= 3) return 'from-emerald-500 to-teal-500';
        return 'from-blue-500 to-indigo-500';
    };

    const getFlameIntensity = (streak) => {
        if (streak >= 30) return 'animate-pulse';
        if (streak >= 14) return 'animate-bounce-slow';
        return '';
    };

    if (currentStreak === 0) return null;

    return (
        <div className={cn(
            "relative inline-flex items-center gap-2 px-4 py-2",
            "bg-gradient-to-r", getStreakColor(currentStreak),
            "rounded-xl shadow-lg text-white font-bold",
            className
        )}>
            {/* Flame Icon */}
            <Flame className={cn("w-5 h-5", getFlameIntensity(currentStreak))} />

            {/* Streak Count */}
            <div className="flex flex-col">
                <span className="text-xl leading-none">{currentStreak}</span>
                <span className="text-[10px] opacity-90 uppercase tracking-wide">Day Streak</span>
            </div>

            {/* Longest Streak Indicator */}
            {longestStreak > currentStreak && (
                <div className="absolute -top-2 -right-2 bg-white text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Best: {longestStreak}</span>
                </div>
            )}

            {/* Achievement Markers */}
            {currentStreak >= 100 && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-600 rounded-full border-2 border-white" />}
            {currentStreak >= 30 && <div className="absolute -bottom-1 -right-3 w-3 h-3 bg-red-600 rounded-full border-2 border-white" />}
            {currentStreak >= 7 && <div className="absolute -bottom-1 -right-5 w-3 h-3 bg-orange-500 rounded-full border-2 border-white" />}
        </div>
    );
}
