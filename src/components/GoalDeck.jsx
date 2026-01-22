import { useState, useMemo } from 'react';
import { Target, ArrowRight, MousePointerClick } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCategoryById } from '../utils/categories';
import { cn } from '../utils/cn';

const CARD_VARIANTS = [
    "bg-gradient-to-br from-violet-100 to-indigo-50 dark:from-violet-900/90 dark:to-indigo-900/90 border-violet-200 dark:border-violet-700",
    "bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/90 dark:to-teal-900/90 border-emerald-200 dark:border-emerald-700",
    "bg-gradient-to-br from-amber-100 to-orange-50 dark:from-amber-900/90 dark:to-orange-900/90 border-amber-200 dark:border-amber-700",
    "bg-gradient-to-br from-rose-100 to-pink-50 dark:from-rose-900/90 dark:to-pink-900/90 border-rose-200 dark:border-rose-700",
    "bg-gradient-to-br from-blue-100 to-cyan-50 dark:from-blue-900/90 dark:to-cyan-900/90 border-blue-200 dark:border-blue-700",
];

export default function GoalDeck({ goals }) {
    const navigate = useNavigate();
    const [focusedId, setFocusedId] = useState(null); // For click/tap interaction

    // Generate stable random styles for each goal
    const cardStyles = useMemo(() => {
        return goals.map((goal, index) => {
            return {
                variant: CARD_VARIANTS[index % CARD_VARIANTS.length]
            };
        });
    }, [goals]);

    if (!goals || goals.length === 0) return null;

    const handleCardClick = (id, e) => {
        // Stop propagation so it doesn't trigger the background click
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }

        if (focusedId === id) {
            // If already focused, navigate
            navigate(`/goal/${id}`);
        } else {
            // Bring to front first
            setFocusedId(id);
        }
    };

    return (
        <div className="relative h-[250px] w-full mt-10 mb-20 mx-auto max-w-[95%]">
            {/* Click outside to reset - Transparent Backdrop */}
            {focusedId && (
                <div
                    className="fixed inset-0 z-20"
                    onClick={() => setFocusedId(null)}
                    aria-label="Close focused view"
                />
            )}

            {/* Instructions for mobile if needed, or just let UI guide */}

            {goals.map((goal, index) => {
                const isFocused = focusedId === goal.id;
                const style = cardStyles[index];

                // Stack vertically - Aligned
                const baseTopOffset = index * 60;
                const topOffset = isFocused ? baseTopOffset - 20 : baseTopOffset;

                const scale = isFocused ? 1.05 : 1 - (index * 0.03); // Slight scale effect for depth
                // Lower Z-Index to avoid covering the menu (Menu is z-50, Header z-40)
                const zIndex = isFocused ? 30 : goals.length - index;
                // Stronger dimming for background cards to improve readability of composed card
                const opacity = (focusedId && !isFocused) ? 0.2 : 1;

                return (
                    <div
                        key={goal.id}
                        className={cn(
                            "absolute left-0 right-0 mx-auto w-full transition-all duration-300 cubic-bezier(0.25, 0.8, 0.25, 1) cursor-pointer",
                            "shadow-lg dark:shadow-black/50 backdrop-blur-xl border rounded-[2rem]",
                            style.variant
                        )}
                        style={{
                            top: `${topOffset}px`,
                            transform: `scale(${scale})`,
                            zIndex: zIndex,
                            opacity: opacity,
                        }}
                        onClick={(e) => handleCardClick(goal.id, e)}
                    >
                        <div className="p-5 flex justify-between items-center relative overflow-hidden">
                            {/* Decorative highlight line */}
                            <div className="absolute top-0 right-0 w-[60px] h-[60px] bg-white/20 -mr-[30px] -mt-[30px] rounded-full blur-xl pointer-events-none"></div>

                            <div className="flex items-center gap-4 relative z-10 w-full">
                                <div className="w-12 h-12 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-xl shadow-sm border border-white/20">
                                    {getCategoryById(goal.category).icon}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight truncate">{goal.name}</h3>
                                        {isFocused && (
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider bg-white/50 px-2 py-0.5 rounded-full">
                                                Tap to open
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-slate-800 dark:text-white font-mono">
                                                ₹{(goal.savingsPlan?.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0) || 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                            {Math.round(Math.min(((goal.savingsPlan?.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0) || 0) / goal.targetAmount) * 100, 100))}%
                                        </span>
                                    </div>

                                    {/* Rounded Progress Bar */}
                                    <div className="w-full h-2 bg-white/40 dark:bg-black/20 mt-2 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-slate-800 dark:bg-white/90 rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${Math.min(((goal.savingsPlan?.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0) || 0) / goal.targetAmount) * 100, 100)}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Spacer */}
            <div style={{ height: `${250 + (goals.length > 0 ? (goals.length - 1) * 60 : 0)}px` }} className="pointer-events-none" />
        </div>
    );
}
