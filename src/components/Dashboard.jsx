import { usePiggy } from '../context/PiggyContext';
import { useNavigate } from 'react-router-dom';
import { Wallet, Settings, ArrowLeft, Trophy, Calendar, TrendingUp, Rocket } from 'lucide-react';
import PlanList from './PlanList';
import AccountSetup from './AccountSetup';
import { useState } from 'react';
import { cn } from '../utils/cn';
import MyPiggy from './MyPiggy';
import RandomSaver from './RandomSaver';
import StreakBadge from './StreakBadge';
import MoodSaver from './MoodSaver';
import SavingsCoach from './SavingsCoach';
import RoundUpTracker from './RoundUpTracker';
import { Dices } from 'lucide-react';

export default function Dashboard() {
    const { goal, savingsPlan, deleteGoal, savingsStreak, longestStreak } = usePiggy();
    const [activeTab, setActiveTab] = useState('plan');
    const [showRandomSaver, setShowRandomSaver] = useState(false);
    const navigate = useNavigate();

    if (!goal) return null;

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

        if (diffDays < 0) return "Finished";
        if (diffDays > 365) return `${Math.floor(diffDays / 365)} Years left`;
        return `${diffDays} Days left`;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 md:pb-8">
            {/* Top Navigation / Header */}
            <div className="bg-white dark:bg-slate-900 sticky top-0 z-30 shadow-sm px-4 py-3 md:hidden flex items-center gap-3">
                <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate flex-1">{goal.name}</h1>
                <div className="w-9 h-9"></div> {/* Spacer */}
            </div>

            <div className="max-w-5xl mx-auto p-4 md:p-8">
                <div className="md:grid md:grid-cols-[1fr_2fr] gap-6 md:h-[calc(100dvh-100px)]">

                    {/* Sidebar / Overview Card */}
                    <div className="space-y-6 md:overflow-y-auto md:pr-2 custom-scrollbar md:h-full">
                        {/* My Piggy Evolution Companion */}
                        <MyPiggy />

                        {/* Quick Action: Time Traveler */}
                        <button
                            onClick={() => navigate('/time-travel')}
                            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white rounded-xl p-4 shadow-lg shadow-purple-200 dark:shadow-purple-900/20 flex items-center justify-between hover:scale-[1.02] active:scale-95 transition-all text-left group"
                        >
                            <div>
                                <h3 className="font-bold flex items-center gap-2">
                                    <Rocket className="w-5 h-5 fill-white/20" />
                                    Time Machine
                                </h3>
                                <p className="text-xs text-purple-100 opacity-90 mt-1">Peek into your financial future</p>
                            </div>
                            <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                            </div>
                        </button>

                        {/* Quick Action: Random Saver */}
                        <button
                            onClick={() => setShowRandomSaver(true)}
                            className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl p-4 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 flex items-center justify-between hover:scale-[1.02] active:scale-95 transition-all text-left group"
                        >
                            <div>
                                <h3 className="font-bold flex items-center gap-2">
                                    <Dices className="w-5 h-5 fill-white/20" />
                                    Fate's Choice
                                </h3>
                                <p className="text-xs text-indigo-100 opacity-90 mt-1">Let destiny decide your savings</p>
                            </div>
                            <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                            </div>
                        </button>

                        {/* Streak Badge Display */}
                        {savingsStreak > 0 && (
                            <div className="w-full flex justify-center">
                                <StreakBadge
                                    currentStreak={savingsStreak}
                                    longestStreak={longestStreak}
                                />
                            </div>
                        )}

                        {/* Mood-Based Quick Save */}
                        <MoodSaver />

                        {/* AI Savings Coach */}
                        <SavingsCoach />

                        {/* Round-Up Tracker */}
                        <RoundUpTracker />

                        {/* Main Goal Card */}
                        <div className="card overflow-hidden relative">
                            <div className="relative z-10 text-center py-6">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-200 dark:shadow-none">
                                    <Trophy className="w-10 h-10 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{goal.name}</h1>

                                <div className="flex justify-center items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {getTimeLeft()}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" />
                                        {goal.frequency}
                                    </span>
                                </div>

                                <div className="px-8">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Progress</span>
                                        <span className="text-slate-900 dark:text-white font-bold">{progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
                                        <span>₹{totalSaved.toLocaleString()}</span>
                                        <span>₹{goal.targetAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs (Desktop Side, Mobile sticky header handled above or generic tabs) */}
                        <div className="bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex gap-1">
                            <button
                                onClick={() => setActiveTab('plan')}
                                className={cn(
                                    "flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                                    activeTab === 'plan' ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                                )}
                            >
                                <Wallet className="w-4 h-4" />
                                Savings Plan
                            </button>
                            <button
                                onClick={() => setActiveTab('accounts')}
                                className={cn(
                                    "flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                                    activeTab === 'accounts' ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                                )}
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="mt-6 md:mt-0 md:overflow-y-auto pr-2 custom-scrollbar md:h-full scroll-smooth">
                        {activeTab === 'plan' ? (
                            <div className="animate-fade-in">
                                <PlanList />
                            </div>
                        ) : (
                            <div className="animate-fade-in space-y-8">
                                <AccountSetup />

                                <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                        </div>
                                        Danger Zone
                                    </h3>
                                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl p-6">
                                        <h4 className="font-bold text-red-900 dark:text-red-400 mb-2">Delete this Goal</h4>
                                        <p className="text-red-700/80 dark:text-red-400/80 text-sm mb-6">
                                            This will permanently delete "{goal.name}" and all its history. Savings data will be preserved in your wallet but the goal structure will be gone.
                                        </p>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
                                                    deleteGoal(goal.id);
                                                    navigate('/');
                                                }
                                            }}
                                            className="w-full py-3 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-sm active:scale-95"
                                        >
                                            Delete Goal
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
