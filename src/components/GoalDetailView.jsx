import { usePiggy } from '../context/PiggyContext';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ArrowLeft, MoreVertical, Calendar, TrendingUp, History, Wallet, Target, Rocket, Dices, Settings, Trash2, PiggyBank, Sparkles } from 'lucide-react';
import PlanList from './PlanList';
import AccountSetup from './AccountSetup';
import RandomSaver from './RandomSaver';
import { cn } from '../utils/cn';
import MyPiggy from './MyPiggy';

export default function GoalDetailView() {
    const { goal, goals, transactions, savingsPlan, deleteGoal } = usePiggy();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('plan'); // 'plan', 'history', 'settings'
    const [showRandomSaver, setShowRandomSaver] = useState(false);

    if (!goal) return null;

    // --- Derived State ---
    const totalSaved = savingsPlan
        .filter(bit => bit.status === 'paid')
        .reduce((sum, bit) => sum + bit.amount, 0);

    const progress = Math.min((totalSaved / goal.targetAmount) * 100, 100);
    const remaining = goal.targetAmount - totalSaved;

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

        if (diffDays < 0) return "Done";
        return diffDays;
    };

    const daysLeft = getTimeLeft();

    // Filter transactions for this goal
    const goalTransactions = useMemo(() => {
        return transactions.filter(tx => {
            // Robust matching: Look for goal name in description or ID if we tracked it (we rely on description currently)
            return tx.description?.includes(goal.name);
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [transactions, goal.name]);


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 md:pb-0 font-sans">

            {/* --- Sticky Header --- */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-3 flex items-center justify-between">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate max-w-[50%]">
                    {goal.name}
                </h1>
                <div className="flex gap-1">
                    <button
                        onClick={() => navigate('/time-travel')}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 transition-colors"
                        title="Time Machine"
                    >
                        <Rocket className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setShowRandomSaver(true)}
                        className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 transition-colors"
                        title="Random Saver"
                    >
                        <Dices className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={cn(
                            "p-2 -mr-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors",
                            activeTab === 'settings' ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800" : "text-slate-600 dark:text-slate-300"
                        )}
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto md:p-6 lg:p-8">

                <div className="grid md:grid-cols-[1.5fr_1fr] gap-6 p-4 md:p-0">

                    <div className="space-y-6">
                        {/* Mobile: Dynamic Layout Shuffle */}
                        <div className="md:hidden flex flex-col gap-6">

                            {/* 1. My Piggy World (Dominant) */}
                            <div className="relative w-full aspect-square max-h-[350px] mx-auto bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-[3rem] shadow-inner border border-white/50 dark:border-slate-700/50 flex items-center justify-center overflow-hidden">
                                {/* Atmospheric Glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_60%)] pointer-events-none"></div>
                                <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-white dark:from-slate-900 to-transparent opacity-50"></div>

                                {/* The Piggy Itself - Larger */}
                                <div className="relative z-10 scale-125 transform transition-transform duration-500 hover:scale-[1.35]">
                                    <MyPiggy minimal={true} className="!bg-transparent !shadow-none !border-none !p-0" />
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute top-6 right-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white/20 dark:border-slate-700">
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                        <Sparkles className="w-3 h-3 text-amber-500" />
                                        Level {Math.floor(progress / 20) + 1}
                                    </span>
                                </div>
                            </div>

                            {/* 2. Key Stats & Progress (Compact) */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2 bg-slate-900 dark:bg-slate-800 rounded-3xl p-6 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                                    <div className="relative z-10 flex justify-between items-end">
                                        <div>
                                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Goal Progress</p>
                                            <div className="text-4xl font-black tracking-tight font-display">
                                                {progress.toFixed(0)}%
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Saved</p>
                                            <p className="text-2xl font-bold">₹{totalSaved.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    {/* Mini Bar */}
                                    <div className="mt-4 w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>

                                {/* Quick Stats Tiles */}
                                <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1 border border-orange-100 dark:border-orange-900/20">
                                    <span className="text-orange-500 font-bold text-lg">{daysLeft}</span>
                                    <span className="text-[10px] text-orange-400 uppercase font-bold tracking-wider">Days Left</span>
                                </div>
                                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1 border border-emerald-100 dark:border-emerald-900/20">
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">₹{remaining.toLocaleString()}</span>
                                    <span className="text-[10px] text-emerald-500/80 uppercase font-bold tracking-wider">To Go</span>
                                </div>
                            </div>

                            {/* 3. Action Buttons (Grid) */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => navigate('/time-travel')}
                                    className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl flex flex-col items-center gap-2 active:scale-95 transition-all shadow-sm"
                                >
                                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                        <Rocket className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Time Machine</span>
                                </button>
                                <button
                                    onClick={() => setShowRandomSaver(true)}
                                    className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl flex flex-col items-center gap-2 active:scale-95 transition-all shadow-sm"
                                >
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <Dices className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Fate's Choice</span>
                                </button>
                            </div>
                        </div>

                        {/* Desktop: Standard Layout (Hidden on Mobile) */}
                        <div className="hidden md:block bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 dark:from-indigo-900 dark:via-purple-900 dark:to-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden group">

                            {/* Decorative Elements */}
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] opacity-50"></div>

                            <div className="relative z-10 flex flex-col items-center justify-center text-center">
                                {/* Top Badge */}
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-indigo-100 mb-4 shadow-sm">
                                    <Sparkles className="w-3 h-3 text-yellow-300" />
                                    <span>Statistics</span>
                                </div>

                                {/* Percentage */}
                                <div className="text-6xl font-black tracking-tighter mb-4 font-display flex items-baseline gap-1" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                                    {progress.toFixed(0)}<span className="text-3xl opacity-60">%</span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full max-w-[280px] h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-lg mb-6 shadow-inner ring-1 ring-white/10">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.6)] relative overflow-hidden"
                                        style={{ width: `${progress}%`, transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                                    >
                                        <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12"></div>
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-2 gap-8 w-full max-w-sm mt-2">
                                    <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                        <div className="flex items-center justify-center gap-1 text-indigo-200 text-[10px] uppercase font-bold tracking-wider mb-1">
                                            <Wallet className="w-3 h-3" />
                                            Saved
                                        </div>
                                        <p className="text-xl font-bold tracking-tight">₹{totalSaved.toLocaleString()}</p>
                                    </div>
                                    <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                        <div className="flex items-center justify-center gap-1 text-indigo-200 text-[10px] uppercase font-bold tracking-wider mb-1">
                                            <Target className="w-3 h-3" />
                                            Target
                                        </div>
                                        <p className="text-xl font-bold tracking-tight opacity-90">₹{goal.targetAmount.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Quick Stats Grid */}
                        <div className="hidden md:grid grid-cols-2 gap-3">
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center gap-2 hover:border-orange-200 transition-colors group">
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Time Remaining</p>
                                    <p className="text-xl font-black text-slate-800 dark:text-white leading-tight">
                                        {daysLeft} <span className="text-xs font-bold text-slate-400">Days</span>
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center gap-2 hover:border-emerald-200 transition-colors group">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Left to Save</p>
                                    <p className="text-xl font-black text-slate-800 dark:text-white leading-tight">
                                        ₹{remaining.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Side Column: My Piggy & Quick Actions */}
                    <div className="hidden md:flex flex-col gap-4">
                        {/* My Piggy */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-300 via-indigo-400 to-emerald-400"></div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-6 text-center text-lg flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                Your Companion
                            </h3>
                            <MyPiggy minimal={false} className="!shadow-none !border-none !bg-transparent" />
                        </div>

                        {/* Desktop Quick Actions */}
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/time-travel')}
                                className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl p-4 flex items-center gap-4 transition-all group text-left"
                            >
                                <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600 dark:text-violet-300 group-hover:scale-110 transition-transform">
                                    <Rocket className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Time Machine</h3>
                                    <p className="text-xs text-slate-500">Peek into the future</p>
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                </div>
                            </button>

                            <button
                                onClick={() => setShowRandomSaver(true)}
                                className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl p-4 flex items-center gap-4 transition-all group text-left"
                            >
                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-300 group-hover:scale-110 transition-transform">
                                    <Dices className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Fate's Choice</h3>
                                    <p className="text-xs text-slate-500">Roll for savings</p>
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Tabs & Content --- */}
                <div className="mt-8 px-4 md:px-0">
                    <div className="flex items-center justify-center md:justify-start gap-2 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl mb-6 w-full md:w-fit mx-auto md:mx-0">
                        <button
                            onClick={() => setActiveTab('plan')}
                            className={cn(
                                "flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                                activeTab === 'plan'
                                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50"
                            )}
                        >
                            <PiggyBank className="w-4 h-4" />
                            Savings Plan
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={cn(
                                "flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                                activeTab === 'history'
                                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50"
                            )}
                        >
                            <History className="w-4 h-4" />
                            History
                        </button>
                    </div>

                    <div className="animate-fade-in min-h-[300px]">
                        {activeTab === 'plan' && <PlanList />}

                        {activeTab === 'history' && (
                            <div className="space-y-4">
                                {goalTransactions.length === 0 ? (
                                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                                            <History className="w-8 h-8" />
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">No transactions yet</p>
                                        <p className="text-xs text-slate-400 mt-1">Start saving to build your history!</p>
                                    </div>
                                ) : (
                                    goalTransactions.map((tx, idx) => (
                                        <div
                                            key={tx.id}
                                            className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center shadow-sm animate-fade-in group hover:border-indigo-100 dark:hover:border-indigo-900 transition-colors"
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                                    <Wallet className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">Saved Amount</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(tx.date).toLocaleDateString('en-IN', {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">+₹{tx.amount.toLocaleString()}</p>
                                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                                                    <ArrowLeft className="w-3 h-3 rotate-[135deg]" />
                                                    Paid
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="animate-fade-in space-y-8">
                                <AccountSetup />

                                <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                                            <Trash2 className="w-5 h-5" />
                                        </div>
                                        Danger Zone
                                    </h3>
                                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl p-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-32 bg-red-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

                                        <h4 className="font-bold text-red-900 dark:text-red-400 mb-2 relative z-10">Delete this Goal</h4>
                                        <p className="text-red-700/80 dark:text-red-400/80 text-sm mb-6 relative z-10">
                                            This will permanently delete "{goal.name}" and all its history. Savings data will be preserved in your wallet but the goal structure will be gone.
                                        </p>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
                                                    deleteGoal(goal.id);
                                                    navigate('/');
                                                }
                                            }}
                                            className="relative z-10 w-full py-4 bg-white dark:bg-slate-800 border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-500 hover:border-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:border-red-600 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                            Delete Goal Permanently
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showRandomSaver && <RandomSaver onClose={() => setShowRandomSaver(false)} />}
        </div>
    );
}
