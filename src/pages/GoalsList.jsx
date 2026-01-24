import { usePiggy } from '../context/PiggyContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, TrendingUp, Calendar, ArrowRight, Wallet, Target } from 'lucide-react';
import { cn } from '../utils/cn';
import { getCategoryById } from '../utils/categories';
import SmartSuggestions from '../components/SmartSuggestions';
import GoalDeck from '../components/GoalDeck';
import Avatar from '../components/Avatar';

export default function GoalsList() {
    const { goals, switchGoal, savingsStreak } = usePiggy();
    const navigate = useNavigate();

    const handleGoalClick = (goalId) => {
        switchGoal(goalId);
        navigate(`/goal/${goalId}`);
    };

    const handleCreateNew = () => {
        navigate('/create');
    };

    const totalPortfolioValue = goals.reduce((acc, goal) => {
        const saved = goal.savingsPlan
            ?.filter(bit => bit.status === 'paid')
            .reduce((sum, bit) => sum + bit.amount, 0) || 0;
        return acc + saved;
    }, 0);

    const totalTargetValue = goals.reduce((acc, goal) => acc + parseInt(goal.targetAmount || 0), 0);
    const overallProgress = totalTargetValue > 0 ? (totalPortfolioValue / totalTargetValue) * 100 : 0;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-28 md:pb-8 animate-fade-in">
            {/* Header Section */}
            <div className="bg-white dark:bg-slate-800 px-6 pt-6 pb-6 rounded-b-[2rem] shadow-sm mb-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Hello, Saver! 👋</h1>
                            {savingsStreak > 0 && (
                                <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full border border-orange-200 dark:border-orange-900/50">
                                    <span className="text-base">🔥</span>
                                    <span className="text-xs font-bold text-orange-700 dark:text-orange-400">{savingsStreak}d</span>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-slate-400 mt-1">Let's reach your goals</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/wardrobe')}
                            className="bg-slate-50 dark:bg-slate-700/50 rounded-full p-1 border border-slate-100 dark:border-slate-600 shadow-sm transition-transform active:scale-95"
                        >
                            <Avatar size="sm" showItems={true} className="w-10 h-10" />
                        </button>
                        <button
                            onClick={() => navigate('/achievements')}
                            className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-600 text-slate-400 dark:text-slate-300 hover:text-emerald-500 hover:border-emerald-200 transition-colors"
                        >
                            <Trophy className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Total Balance Card */}
                <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-slate-200 dark:shadow-none">
                    <div className="relative z-10">
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Total Savings</p>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-2xl font-bold text-slate-500">₹</span>
                            <span className="text-4xl font-bold tracking-tight">{totalPortfolioValue.toLocaleString()}</span>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-1 bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <Target className="w-3 h-3 text-emerald-400" />
                                    <span className="text-[10px] text-slate-300 uppercase tracking-wide">Target</span>
                                </div>
                                <p className="font-bold text-sm">₹{totalTargetValue.toLocaleString()}</p>
                            </div>
                            <div className="flex-1 bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <TrendingUp className="w-3 h-3 text-blue-400" />
                                    <span className="text-[10px] text-slate-300 uppercase tracking-wide">Progress</span>
                                </div>
                                <p className="font-bold text-sm">{overallProgress.toFixed(1)}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>
                </div>

                {/* Quick Actions - Mobile Friendly */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <button onClick={handleCreateNew} className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm border border-emerald-100 dark:border-emerald-900/50 active:scale-95 transition-transform">
                        <Plus className="w-4 h-4" />
                        New Goal
                    </button>
                    <button onClick={() => navigate('/about')} className="p-3 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm border border-slate-100 dark:border-slate-600 active:scale-95 transition-transform">
                        <Wallet className="w-4 h-4" />
                        How it works
                    </button>
                </div>
            </div>

            {/* Goals List Content */}
            <div className="px-4 max-w-4xl mx-auto">
                {/* Smart Suggestions */}
                <div className="mb-6">
                    <SmartSuggestions />
                </div>

                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Your Goals</h2>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                        {goals.length} Active
                    </span>
                </div>

                {goals.length === 0 ? (
                    <div className="text-center py-12 px-6 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm border-dashed">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-600">
                            <Target className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Goals Yet</h3>
                        <p className="text-slate-400 text-sm mb-6 max-w-[200px] mx-auto">Start your savings journey by creating your first target.</p>
                        <button
                            onClick={handleCreateNew}
                            className="bg-slate-900 dark:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95"
                        >
                            Create Goal
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <GoalDeck goals={goals} />
                    </div>
                )}
            </div>
        </div>
    );
}
