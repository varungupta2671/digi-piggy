import { usePiggy, ACHIEVEMENT_DEFINITIONS } from '../context/PiggyContext';
import { Lock } from 'lucide-react';

export default function Achievements() {
    const { unlockedAchievements } = usePiggy();

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-[#0F0502] text-[#FFF8E7] font-['Courier_Prime'] p-4 md:p-8 animate-fade-in">
            <div className="max-w-6xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-['Righteous'] text-[#FFD700] mb-4">
                        TROPHY CASE
                    </h1>
                    <p className="text-[#A1887F] text-lg">
                        Unlock badges by hitting savings milestones!
                    </p>
                    <div className="mt-4 inline-block bg-[#1A0B08] px-6 py-2 rounded-full border border-[#5D4037]">
                        <span className="text-[#FFD700] font-bold text-xl">{unlockedAchievements.length}</span>
                        <span className="text-[#A1887F] mx-2">/</span>
                        <span className="text-[#A1887F] text-sm">{ACHIEVEMENT_DEFINITIONS.length} UNLOCKED</span>
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
                                className={`
                                    relative p-6 rounded-2xl border-4 transition-all duration-300 overflow-hidden group
                                    ${isUnlocked
                                        ? 'bg-[#1A0B08] border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.1)] scale-100 opacity-100'
                                        : 'bg-[#0F0502] border-[#2C1810] opacity-60 grayscale scale-95'
                                    }
                                `}
                            >
                                {/* Background Texture */}
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay pointer-events-none"></div>

                                {/* Shine Effect for Unlocked */}
                                {isUnlocked && (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                )}

                                <div className="relative z-10 flex items-start gap-4">
                                    {/* Icon Container */}
                                    <div className={`
                                        w-16 h-16 rounded-xl flex items-center justify-center shrink-0 border-2
                                        ${isUnlocked
                                            ? `bg-[#2C1810] border-[#FFD700] ${achievement.color}`
                                            : 'bg-[#1A0B08] border-[#2C1810] text-[#5D4037]'
                                        }
                                    `}>
                                        {isUnlocked ? <Icon className="w-8 h-8" /> : <Lock className="w-6 h-6" />}
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <h3 className={`font-['Righteous'] text-xl mb-1 ${isUnlocked ? 'text-[#FFD700]' : 'text-[#5D4037]'}`}>
                                            {achievement.title}
                                        </h3>
                                        <p className="text-[#A1887F] text-sm leading-tight mb-2">
                                            {achievement.description}
                                        </p>

                                        {/* Status Tag */}
                                        <div className="flex items-center gap-2">
                                            <span className={`
                                                text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md
                                                ${isUnlocked
                                                    ? 'bg-[#FFD700] text-[#2C1810]'
                                                    : 'bg-[#2C1810] text-[#5D4037]'
                                                }
                                            `}>
                                                {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
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
