import { usePiggy, ACHIEVEMENT_DEFINITIONS } from '../context/PiggyContext';
import { Lock, Trophy } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Achievements() {
    const { unlockedAchievements } = usePiggy();

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-fade-in pb-24">
            <div className="max-w-6xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                        <Trophy className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                        Trophy Case
                    </h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">
                        Unlock badges by hitting savings milestones! Keep saving to earn them all.
                    </p>

                    <div className="mt-8 inline-flex items-center bg-white px-6 py-3 rounded-full shadow-sm border border-slate-200">
                        <span className="text-emerald-600 font-bold text-xl">{unlockedAchievements.length}</span>
                        <span className="text-slate-300 mx-2">/</span>
                        <span className="text-slate-500 text-sm font-medium">{ACHIEVEMENT_DEFINITIONS.length} Unlocked</span>
                    </div>
                </div>

                {/* Achievements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ACHIEVEMENT_DEFINITIONS.map((achievement) => {
                        const isUnlocked = unlockedAchievements.includes(achievement.id);
                        const Icon = achievement.icon;

                        return (
                            <div
                                key={achievement.id}
                                className={cn(
                                    "relative p-6 rounded-3xl border transition-all duration-300 overflow-hidden group",
                                    isUnlocked
                                        ? "bg-white border-emerald-100 shadow-lg shadow-emerald-500/5 hover:-translate-y-1 hover:shadow-xl"
                                        : "bg-slate-50 border-slate-200 opacity-70 grayscale hover:opacity-100 transition-opacity"
                                )}
                            >
                                {/* Shine Effect for Unlocked */}
                                {isUnlocked && (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
                                )}

                                <div className="relative z-10 flex items-start gap-4">
                                    {/* Icon Container */}
                                    <div className={cn(
                                        "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors",
                                        isUnlocked
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "bg-slate-200 text-slate-400"
                                    )}>
                                        {isUnlocked ? <Icon className="w-8 h-8" /> : <Lock className="w-6 h-6" />}
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <h3 className={cn(
                                            "font-bold text-lg mb-1 transition-colors",
                                            isUnlocked ? "text-slate-900" : "text-slate-500"
                                        )}>
                                            {achievement.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-snug mb-3">
                                            {achievement.description}
                                        </p>

                                        {/* Status Tag */}
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
                                                isUnlocked
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-slate-200 text-slate-500"
                                            )}>
                                                {isUnlocked ? 'Unlocked' : 'Locked'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
