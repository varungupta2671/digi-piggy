import { useState } from 'react';
import { X, Trophy, TrendingUp, Target, Sparkles } from 'lucide-react';

export default function MilestoneCelebration({ milestone, goalName, currentAmount, targetAmount, onClose }) {
    const [showConfetti, setShowConfetti] = useState(true);

    const milestones = {
        25: {
            title: "Quarter Way There! 🎯",
            emoji: "🎯",
            color: "from-blue-500 to-indigo-600",
            message: "You've saved 25% of your goal!"
        },
        50: {
            title: "Halfway Hero! 🌟",
            emoji: "⭐",
            color: "from-purple-500 to-pink-600",
            message: "You're at the halfway point!"
        },
        75: {
            title: "Almost There! 🚀",
            emoji: "🚀",
            color: "from-orange-500 to-red-600",
            message: "You've saved 75% of your goal!"
        },
        100: {
            title: "Goal Achieved! 🎉",
            emoji: "🎉",
            color: "from-green-500 to-emerald-600",
            message: "You've completed your savings goal!"
        }
    };

    const info = milestones[milestone] || milestones[100];
    const remaining = targetAmount - currentAmount;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Confetti Effect */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-fall"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-20px`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        >
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][Math.floor(Math.random() * 5)]
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-8 relative shadow-2xl animate-slide-in-up">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Gradient Header */}
                <div className={`bg-gradient-to-r ${info.color} rounded-2xl p-6 mb-6 text-white text-center`}>
                    <div className="text-6xl mb-3">{info.emoji}</div>
                    <h2 className="text-2xl font-bold mb-2">{info.title}</h2>
                    <p className="text-white/90">{info.message}</p>
                </div>

                {/* Goal Info */}
                <div className="space-y-4 mb-6">
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{goalName}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Your Savings Goal</p>
                    </div>

                    {/* Progress Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Saved</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">₹{currentAmount.toLocaleString()}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Progress</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{milestone}%</p>
                        </div>
                    </div>

                    {milestone < 100 && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                                        Just ₹{remaining.toLocaleString()} more to go!
                                    </p>
                                    <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                                        Keep up the amazing work! You're doing great! 💪
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {milestone === 100 && (
                        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Trophy className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                        Congratulations! 🎊
                                    </p>
                                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                        You've successfully reached your savings goal! Time to celebrate! 🎉
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
                >
                    Continue Saving! 🚀
                </button>
            </div>

            <style jsx>{`
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
                .animate-fall {
                    animation: fall linear forwards;
                }
            `}</style>
        </div>
    );
}
