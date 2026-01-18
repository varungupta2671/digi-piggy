import { usePiggy } from '../context/PiggyContext';
import { useTheme } from '../context/ThemeContext';
import { Wallet, Settings, Pencil, X, Plus, ChevronRight, Trophy, Palette } from 'lucide-react';
import PlanList from './PlanList';
import AccountSetup from './AccountSetup';
import { useState } from 'react';
import { cn } from '../utils/cn';

export default function Dashboard() {
    const { goal, goals, savingsPlan, deleteGoal, startEditing, switchGoal } = usePiggy();
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('plan');
    const [showGoalMenu, setShowGoalMenu] = useState(false);
    const [showThemeMenu, setShowThemeMenu] = useState(false);

    const totalSaved = savingsPlan
        .filter(bit => bit.status === 'paid')
        .reduce((sum, bit) => sum + bit.amount, 0);

    const progress = Math.min((totalSaved / goal.targetAmount) * 100, 100);

    const getTimeLeft = () => {
        const created = new Date(goal.createdAt);
        let endDate = new Date(created);
        const val = parseInt(goal.durationValue || 0);
        const unit = goal.durationUnit || 'months';

        if (unit === 'days') endDate.setDate(endDate.getDate() + val);
        if (unit === 'weeks') endDate.setDate(endDate.getDate() + (val * 7));
        if (unit === 'months') endDate.setMonth(endDate.getMonth() + val);
        if (unit === 'years') endDate.setFullYear(endDate.getFullYear() + val);

        const now = new Date();
        const diffTime = endDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "FINISHED";
        if (diffDays > 365) return `${Math.floor(diffDays / 365)}Y LEFT`;
        if (diffDays > 30) return `${Math.floor(diffDays / 30)}M LEFT`;
        return `${diffDays}D LEFT`;
    };

    const handleCreateNew = () => {
        setShowGoalMenu(false);
        setTimeout(() => switchGoal(null), 100);
    }

    const handleSwitch = (id) => {
        setShowGoalMenu(false);
        setTimeout(() => switchGoal(id), 100);
    }

    return (
        <div className="font-['Courier_Prime'] bg-[#0F0502] h-screen text-[#FFF8E7] flex flex-col">
            {/* Layout Container */}
            <div className="md:grid md:grid-cols-[1fr_1.5fr] md:gap-4 md:p-4 md:h-full md:overflow-hidden portrait:flex portrait:flex-col portrait:h-full">
                {/* Header Card */}
                <div className="p-4 md:p-6 bg-[#1A0B08] rounded-b-3xl md:rounded-3xl shadow-lg border-b-4 md:border-4 border-[#FFD700] relative overflow-hidden md:overflow-hidden portrait:flex-shrink-0">
                    {/* Texture Overlay */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay pointer-events-none"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="relative">
                            <button
                                onClick={() => setShowGoalMenu(true)}
                                className="flex items-center gap-2 text-2xl text-[#FFF8E7] mb-1 hover:text-[#FFD700] transition-colors font-['Righteous'] tracking-wide group"
                            >
                                <Trophy className="w-6 h-6 text-[#FFD700]" />
                                {goal.name || 'MY GOAL'}
                                <div className="bg-[#2C1810] p-1 rounded-md border border-[#5D4037] group-hover:border-[#FFD700] transition-colors">
                                    <ChevronRight className="w-4 h-4 text-[#FFD700]" />
                                </div>
                            </button>
                            <p className="text-[#A1887F] text-xs font-bold uppercase tracking-widest pl-1">Piggy Bank OS v2.0</p>
                        </div>

                        <div className="flex gap-2 relative">
                            {/* Theme Switcher */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowThemeMenu(!showThemeMenu)}
                                    className="bg-[#2C1810] text-[#FFD700] p-2 rounded-lg border border-[#5D4037] hover:bg-[#3E2723] hover:border-[#FFD700] transition-all shadow-lg active:scale-95"
                                    title="Change Theme"
                                >
                                    <Palette className="w-4 h-4" />
                                </button>


                                {/* Theme Dropdown */}
                                {showThemeMenu && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-[998]"
                                            onClick={() => setShowThemeMenu(false)}
                                        />

                                        <div className="absolute top-full right-0 mt-2 bg-[#1A0B08] border-2 border-[#FFD700] rounded-lg shadow-2xl overflow-hidden z-[999] min-w-[150px] animate-slide-in-down">
                                            <button
                                                onClick={() => { setTheme('retro'); setShowThemeMenu(false); }}
                                                className={cn(
                                                    "w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest transition-colors border-b border-[#5D4037]",
                                                    theme === 'retro' ? "bg-[#FFD700] text-[#2C1810]" : "text-[#FFF8E7] hover:bg-[#2C1810]"
                                                )}
                                            >
                                                🎮 Retro
                                            </button>
                                            <button
                                                onClick={() => { setTheme('cyber'); setShowThemeMenu(false); }}
                                                className={cn(
                                                    "w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest transition-colors border-b border-[#5D4037]",
                                                    theme === 'cyber' ? "bg-[#FFD700] text-[#2C1810]" : "text-[#FFF8E7] hover:bg-[#2C1810]"
                                                )}
                                            >
                                                ⚡ Cyber
                                            </button>
                                            <button
                                                onClick={() => { setTheme('minimal'); setShowThemeMenu(false); }}
                                                className={cn(
                                                    "w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest transition-colors",
                                                    theme === 'minimal' ? "bg-[#FFD700] text-[#2C1810]" : "text-[#FFF8E7] hover:bg-[#2C1810]"
                                                )}
                                            >
                                                ✨ Minimal
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() => setShowGoalMenu(true)}
                                className="bg-[#2C1810] text-[#FFD700] px-3 py-2 rounded-lg border border-[#5D4037] text-[10px] font-bold uppercase tracking-widest hover:bg-[#3E2723] hover:border-[#FFD700] transition-all shadow-lg active:scale-95"
                            >
                                My Goals
                            </button>
                        </div>
                    </div>

                    {/* Digital Counter Display */}
                    <div className="text-center mb-3 landscape:mb-4 relative bg-[#0F0502] p-3 landscape:p-4 rounded-xl border-2 border-[#5D4037] shadow-inner">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50"></div>

                        <p className="text-[#A1887F] text-[8px] landscape:text-[10px] mb-1 uppercase tracking-widest font-bold font-sans">TARGET STATUS</p>
                        <div className="text-3xl landscape:text-4xl text-[#00FF41] font-['VT323'] tracking-widest drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]">
                            ₹{goal.targetAmount.toLocaleString()}
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full mt-2 landscape:mt-3 h-2 landscape:h-3 bg-[#1A0B08] rounded-full border border-[#5D4037] p-[1px]">
                            <div
                                className="h-full bg-gradient-to-r from-[#FFD700] via-[#FFF8E7] to-[#FFD700] rounded-full shadow-[0_0_10px_rgba(255,215,0,0.5)] relative overflow-hidden transition-all duration-1000 ease-out"
                                style={{ width: '0%', animation: 'fill-progress 1s ease-out forwards 0.3s' }}
                            >
                                <style>{`@keyframes fill-progress { from { width: 0% } to { width: ${progress}% } }`}</style>
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-30"></div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-2 px-1">
                            <span className="text-[#FFD700] text-xs font-['VT323'] text-xl">0%</span>
                            <span className="text-[#FFD700] text-xs font-['VT323'] text-xl">{progress.toFixed(0)}% DONE</span>
                        </div>
                    </div>

                    {/* Info Tickets */}
                    <div className="grid grid-cols-2 gap-2 landscape:gap-3 relative z-10 mb-2 landscape:mb-3 font-['VT323']">
                        <div className="bg-[#FFFDE7] text-[#1A0B08] p-2 landscape:p-3 rounded-lg shadow-lg border-2 border-[#5D4037] relative transform transition-transform hover:scale-105 animate-scale-in delay-100">
                            <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0F0502] rounded-full"></div>
                            <p className="text-[8px] landscape:text-[10px] uppercase font-sans font-bold tracking-widest opacity-60">Saved So Far</p>
                            <p className="text-lg landscape:text-2xl font-bold">₹{totalSaved.toLocaleString()}</p>
                        </div>
                        <div className="bg-[#FFFDE7] text-[#1A0B08] p-3 rounded-lg shadow-lg border-2 border-[#5D4037] relative transform transition-transform hover:scale-105 animate-scale-in delay-200">
                            <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0F0502] rounded-full"></div>
                            <p className="text-[8px] landscape:text-[10px] uppercase font-sans font-bold tracking-widest opacity-60">Time Left</p>
                            <p className="text-lg landscape:text-2xl font-bold">{getTimeLeft()}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 relative z-10 mt-2">
                        <button
                            onClick={() => setActiveTab('plan')}
                            className={cn(
                                "flex-1 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border-b-4 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2",
                                activeTab === 'plan'
                                    ? "bg-[#FFD700] text-[#2C1810] border-[#8D6E63] shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                                    : "bg-[#1A0B08] text-[#A1887F] border-[#5D4037] hover:bg-[#2C1810]"
                            )}
                        >
                            <Wallet className="w-4 h-4" />
                            Board
                        </button>
                        <button
                            onClick={() => setActiveTab('accounts')}
                            className={cn(
                                "flex-1 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border-b-4 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2",
                                activeTab === 'accounts'
                                    ? "bg-[#FFD700] text-[#2C1810] border-[#8D6E63] shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                                    : "bg-[#1A0B08] text-[#A1887F] border-[#5D4037] hover:bg-[#2C1810]"
                            )}
                        >
                            <Settings className="w-4 h-4" />
                            Setup
                        </button>
                        <button
                            onClick={startEditing}
                            className="p-3 bg-[#1A0B08] text-[#FFD700] rounded-lg border-b-4 border-[#5D4037] hover:bg-[#2C1810] active:border-b-0 active:translate-y-1 transition-all"
                            title="Edit Goal"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            onClick={deleteGoal}
                            className="p-3 bg-[#1A0B08] text-[#FF5252] rounded-lg border-b-4 border-[#5D4037] hover:bg-[#2C1810] active:border-b-0 active:translate-y-1 transition-all text-xs font-bold"
                            title="Delete Goal"
                        >
                            DELETE
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="portrait:flex-1 portrait:overflow-y-auto md:p-0 md:overflow-y-auto md:h-full">
                    {activeTab === 'plan' ? <PlanList /> : <AccountSetup />}
                </div>
            </div>

            {/* FULL SCREEN MENU OVERLAY */}
            {showGoalMenu && (
                <div className="fixed inset-0 z-[100] bg-[#0F0502]/95 backdrop-blur-md flex flex-col p-6 animate-fade-in font-['Courier_Prime']">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl text-[#FFD700] font-['Righteous']">SELECT SAVE FILE</h2>
                        <button
                            onClick={() => setShowGoalMenu(false)}
                            className="p-2 bg-[#1A0B08] text-[#FFF8E7] rounded-full hover:bg-[#2C1810] transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3">
                        {goals.map(g => (
                            <button
                                key={g.id}
                                onClick={() => handleSwitch(g.id)}
                                className={cn(
                                    "w-full text-left p-4 rounded-xl border-2 transition-all group flex items-center justify-between",
                                    g.id === goal.id
                                        ? "bg-[#FFD700] border-[#FFD700] text-[#2C1810] shadow-[0_0_10px_rgba(255,215,0,0.5)] transform scale-[1.02]"
                                        : "bg-[#1A0B08] border-[#5D4037] text-[#FFF8E7] hover:border-[#FFD700] hover:bg-[#2C1810]"
                                )}
                            >
                                <div>
                                    <div className="font-bold text-lg mb-1">{g.name}</div>
                                    <div className="text-xs opacity-70 font-['VT323']">
                                        ₹{g.targetAmount.toLocaleString()} • {g.frequency}
                                    </div>
                                </div>
                                {g.id === goal.id && <Trophy className="w-6 h-6 animate-pulse" />}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-[#5D4037]">
                        <button
                            onClick={handleCreateNew}
                            className="w-full py-4 bg-transparent border-2 border-dashed border-[#FFD700] text-[#FFD700] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#FFD700]/10 transition-all active:scale-[0.98]"
                        >
                            <Plus className="w-5 h-5" />
                            START NEW SAVE FILE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
