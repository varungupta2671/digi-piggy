import React from 'react';
import { usePiggy } from '../context/PiggyContext';

const MyPiggy = ({ minimal = false, className = '' }) => {
    const { transactions } = usePiggy();
    const totalSavings = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    const getLevel = (savings) => {
        if (savings < 100) return { name: 'Baby Piggy', level: 1, color: 'text-rose-300' };
        if (savings < 500) return { name: 'Teen Piggy', level: 2, color: 'text-indigo-400' };
        if (savings < 2000) return { name: 'Pro Piggy', level: 3, color: 'text-blue-500' };
        return { name: 'Tycoon Piggy', level: 4, color: 'text-emerald-500' };
    };

    const currentLevel = getLevel(totalSavings);

    // SVG Components for each level
    const BabyPiggy = () => (
        <svg viewBox="0 0 100 100" className={minimal ? "w-16 h-16 animate-bounce-slow" : "w-24 h-24 animate-bounce-slow"}>
            <circle cx="50" cy="55" r="30" className="fill-rose-300" />
            <circle cx="35" cy="45" r="4" className="fill-slate-800" />
            <circle cx="65" cy="45" r="4" className="fill-slate-800" />
            <ellipse cx="50" cy="60" rx="10" ry="8" className="fill-rose-400" />
            <circle cx="46" cy="60" r="2" className="fill-slate-900" />
            <circle cx="54" cy="60" r="2" className="fill-slate-900" />
            <polygon points="25,35 30,50 40,40" className="fill-rose-300" />
            <polygon points="75,35 70,50 60,40" className="fill-rose-300" />
        </svg>
    );

    const TeenPiggy = () => (
        <svg viewBox="0 0 100 100" className={minimal ? "w-20 h-20 animate-pulse-slow" : "w-28 h-28 animate-pulse-slow"}>
            <circle cx="50" cy="55" r="32" className="fill-indigo-400" />
            <path d="M20 55 Q 50 20 80 55" stroke="white" strokeWidth="4" fill="none" />
            <rect x="15" y="50" width="10" height="20" rx="5" className="fill-slate-700" />
            <rect x="75" y="50" width="10" height="20" rx="5" className="fill-slate-700" />
            <circle cx="40" cy="50" r="4" className="fill-white" />
            <circle cx="60" cy="50" r="4" className="fill-white" />
            <ellipse cx="50" cy="65" rx="10" ry="8" className="fill-indigo-500" />
            <circle cx="46" cy="65" r="2" className="fill-slate-900" />
            <circle cx="54" cy="65" r="2" className="fill-slate-900" />
            <path d="M35 80 Q 50 90 65 80" stroke="white" strokeWidth="3" fill="none" />
        </svg>
    );

    const ProPiggy = () => (
        <svg viewBox="0 0 100 100" className={minimal ? "w-24 h-24" : "w-32 h-32"}>
            <circle cx="50" cy="55" r="32" className="fill-blue-500" />
            <polygon points="50,85 40,100 60,100" className="fill-red-500" />
            <polygon points="50,85 45,75 55,75" className="fill-red-600" />
            <circle cx="40" cy="50" r="8" className="stroke-slate-900 stroke-2 fill-white/50" />
            <circle cx="60" cy="50" r="8" className="stroke-slate-900 stroke-2 fill-white/50" />
            <line x1="48" y1="50" x2="52" y2="50" className="stroke-slate-900 stroke-2" />
            <ellipse cx="50" cy="65" rx="10" ry="8" className="fill-blue-600" />
            <circle cx="46" cy="65" r="2" className="fill-slate-900" />
            <circle cx="54" cy="65" r="2" className="fill-slate-900" />
        </svg>
    );

    const TycoonPiggy = () => (
        <svg viewBox="0 0 100 100" className={minimal ? "w-28 h-28 drop-shadow-xl" : "w-36 h-36 drop-shadow-xl"}>
            <circle cx="50" cy="60" r="35" className="fill-emerald-500" />
            <polygon points="30,40 40,20 50,35 60,20 70,40" className="fill-yellow-400 stroke-yellow-600 stroke-2" />
            <circle cx="60" cy="55" r="8" className="stroke-yellow-400 stroke-2 fill-none" />
            <line x1="60" y1="63" x2="60" y2="100" className="stroke-yellow-400 stroke-1" />
            <circle cx="40" cy="55" r="4" className="fill-white" />
            <ellipse cx="50" cy="70" rx="10" ry="8" className="fill-emerald-600" />
            <circle cx="46" cy="70" r="2" className="fill-slate-900" />
            <circle cx="54" cy="70" r="2" className="fill-slate-900" />
            <path d="M35 75 Q 50 70 65 75" stroke="black" strokeWidth="2" fill="none" />
        </svg>
    );

    if (minimal) {
        return (
            <div className={`flex flex-col items-center justify-center ${className}`}>
                <div className="relative mb-2">
                    {currentLevel.level === 1 && <BabyPiggy />}
                    {currentLevel.level === 2 && <TeenPiggy />}
                    {currentLevel.level === 3 && <ProPiggy />}
                    {currentLevel.level === 4 && <TycoonPiggy />}
                </div>
                <h3 className={`text-sm font-bold ${currentLevel.color} dark:text-white`}>
                    {currentLevel.name}
                </h3>
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center transform transition-all duration-300 hover:scale-105 border border-slate-100 dark:border-slate-700 ${className}`}>
            <div className="relative mb-4">
                {/* Glow effect based on level */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 animate-[shimmer_2s_infinite] ${currentLevel.level > 2 ? 'block' : 'hidden'}`}></div>

                {currentLevel.level === 1 && <BabyPiggy />}
                {currentLevel.level === 2 && <TeenPiggy />}
                {currentLevel.level === 3 && <ProPiggy />}
                {currentLevel.level === 4 && <TycoonPiggy />}
            </div>

            <h3 className={`text-xl font-bold mb-1 ${currentLevel.color} dark:text-white transition-colors`}>
                {currentLevel.name}
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-3">
                Level {currentLevel.level}
                {currentLevel.level < 4 && <span className="text-xs ml-1 opacity-75">(Next: ${
                    currentLevel.level === 1 ? 100 :
                        currentLevel.level === 2 ? 500 :
                            2000
                })</span>}
            </p>

            {/* Progress Bar to next level */}
            {currentLevel.level < 4 && (
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r 
               ${currentLevel.level === 1 ? 'from-rose-300 to-rose-400' :
                                currentLevel.level === 2 ? 'from-indigo-300 to-indigo-500' :
                                    'from-blue-400 to-blue-600'
                            }`}
                        style={{
                            width: `${currentLevel.level === 1 ? (totalSavings / 100) * 100 :
                                currentLevel.level === 2 ? ((totalSavings - 100) / 400) * 100 :
                                    ((totalSavings - 500) / 1500) * 100
                                }%`
                        }}
                    ></div>
                </div>
            )}

            {currentLevel.level === 4 && (
                <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full font-medium">
                    Max Level Reached! 👑
                </span>
            )}
        </div>
    );
};

export default MyPiggy;
