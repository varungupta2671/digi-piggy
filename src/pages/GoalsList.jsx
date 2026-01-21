import { usePiggy } from '../context/PiggyContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, TrendingUp, Calendar, ArrowRight, Wallet, Target } from 'lucide-react';
import { cn } from '../utils/cn';
import { getCategoryById } from '../utils/categories';

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
        <div className="min-h-screen bg-slate-50 pb-28 md:pb-8 animate-fade-in">
            {/* Header Section */}
            <div className="bg-white px-6 pt-6 pb-6 rounded-b-[2rem] shadow-sm mb-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-800">Hello, Saver! 👋</h1>
                            {savingsStreak > 0 && (
                                <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full border border-orange-200">
                                    <span className="text-base">🔥</span>
                                    <span className="text-xs font-bold text-orange-700">{savingsStreak}d</span>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-slate-400 mt-1">Let's reach your goals</p>
                    </div>
                    <button
                        onClick={() => navigate('/achievements')}
                        className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 transition-colors"
                    >
                        <Trophy className="w-5 h-5" />
                    </button>
                </div>

                {/* Total Balance Card */}
                <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-slate-200">
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
                    <button onClick={handleCreateNew} className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm border border-emerald-100 active:scale-95 transition-transform">
                        <Plus className="w-4 h-4" />
                        New Goal
                    </button>
                    <button onClick={() => navigate('/about')} className="p-3 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm border border-slate-100 active:scale-95 transition-transform">
                        <Wallet className="w-4 h-4" />
                        How it works
                    </button>
                </div>
            </div>

            {/* Goals List Content */}
            <div className="px-4 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-lg font-bold text-slate-800">Your Goals</h2>
                    <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                        {goals.length} Active
                    </span>
                </div>

                {goals.length === 0 ? (
                    <div className="text-center py-12 px-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm border-dashed">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <Target className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No Goals Yet</h3>
                        <p className="text-slate-400 text-sm mb-6 max-w-[200px] mx-auto">Start your savings journey by creating your first target.</p>
                        <button
                            onClick={handleCreateNew}
                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95"
                        >
                            Create Goal
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {goals.map((goal, index) => {
                            const totalSaved = goal.savingsPlan
                                ?.filter(bit => bit.status === 'paid')
                                .reduce((sum, bit) => sum + bit.amount, 0) || 0;
                            const progress = Math.min((totalSaved / goal.targetAmount) * 100, 100);

                            return (
                                <button
                                    key={goal.id}
                                    onClick={() => handleGoalClick(goal.id)}
                                    className="w-full bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 text-left relative overflow-hidden group hover:border-emerald-200 transition-all active:scale-[0.98] duration-200"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                                                <Target className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-slate-900 leading-tight">{goal.name}</h3>
                                                    <span className="text-base">{getCategoryById(goal.category).icon}</span>
                                                </div>
                                                <p className="text-xs text-slate-400">Target: ₹{goal.targetAmount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 -mr-2 -mt-2 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-slate-500">Progress</span>
                                            <span className="text-slate-900">{progress.toFixed(0)}%</span>
                                        </div>
                                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-1">
                                            <span>₹{totalSaved.toLocaleString()} Saved</span>
                                            <span>₹{(goal.targetAmount - totalSaved).toLocaleString()} Left</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
