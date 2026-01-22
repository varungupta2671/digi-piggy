import { useState } from 'react';
import { Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCategoryById } from '../utils/categories';
import { cn } from '../utils/cn';

export default function GoalDeck({ goals }) {
    const navigate = useNavigate();
    const [hoveredId, setHoveredId] = useState(null);

    if (!goals || goals.length === 0) return null;

    return (
        <div className="relative h-[220px] w-full mt-8 mb-12">
            {goals.map((goal, index) => {
                const isHovered = hoveredId === goal.id;
                
                // Calculate stacking positions
                // We want them to stack visibly. 
                // Let's stack them vertically with a slight offset, 
                // or horizontally if on desktop? 
                // The reference image showed a vertical stack.
                // Let's do a vertical stack where top cards cover bottom ones partially.
                
                const topOffset = index * 55; // 60px down per card
                const scale = isHovered ? 1.05 : 1 - (index * 0.02); // Slight scale down for cards in back
                const zIndex = isHovered ? 50 : goals.length - index;
                
                return (
                    <div
                        key={goal.id}
                        className={cn(
                            "absolute top-0 left-0 right-0 mx-auto w-full transition-all duration-300 ease-out cursor-pointer",
                            "shadow-xl rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden",
                            "bg-white dark:bg-slate-800"
                        )}
                        style={{
                            transform: `translateY(${isHovered ? topOffset - 10 : topOffset}px) scale(${scale})`,
                            zIndex: zIndex,
                            maxWidth: '100%',
                            opacity: isHovered ? 1 : 1 - (index * 0.05) // Fade old ones slightly? Maybe not needed.
                        }}
                        onMouseEnter={() => setHoveredId(goal.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => navigate(`/goal/${goal.id}`)}
                    >
                        {/* Card Content - Compact version of the original list item */}
                        <div className="p-5 flex justify-between items-center bg-gradient-to-r from-transparent to-slate-50/50 dark:to-slate-800/50">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm",
                                    "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500" // Default fallback
                                )}>
                                    {getCategoryById(goal.category).icon}
                                </div>
                                
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{goal.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                         <div className="h-1.5 w-16 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-emerald-500 rounded-full"
                                                style={{ width: `${Math.min(((goal.savingsPlan?.filter(b=>b.status==='paid').reduce((s,b)=>s+b.amount,0)||0) / goal.targetAmount) * 100, 100)}%` }}
                                            />
                                         </div>
                                         <span className="text-[10px] text-slate-400 font-medium">
                                            {Math.round(Math.min(((goal.savingsPlan?.filter(b=>b.status==='paid').reduce((s,b)=>s+b.amount,0)||0) / goal.targetAmount) * 100, 100))}%
                                         </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-end">
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                    ₹{(goal.savingsPlan?.filter(b=>b.status==='paid').reduce((s,b)=>s+b.amount,0)||0).toLocaleString()}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                    of ₹{goal.targetAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
            
             {/* Spacer to push content down based on number of cards */}
             {/* Height = base height + (num_cards-1) * offset */}
            <div style={{ height: `${220 + (goals.length > 0 ? (goals.length - 1) * 55 : 0)}px` }} pointerEvents="none" />
        </div>
    );
}
