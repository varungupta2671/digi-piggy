import { usePiggy } from '../context/PiggyContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

export default function GoalsList() {
    const { goals, switchGoal } = usePiggy();
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

    return (
        <div className="min-h-screen pt-4 px-4 pb-20 md:pb-8 animate-fade-in max-w-4xl mx-auto">
            {/* Header / Summary Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl shadow-slate-200 mb-8 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Total Savings</p>
                            <h1 className="text-4xl font-bold tracking-tight">
                                ₹{totalPortfolioValue.toLocaleString()}
                            </h1>
                        </div>
                        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                            <Trophy className="w-6 h-6 text-yellow-400" />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <div className="bg-white/5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                            On Track
                        </div>
                        <div className="bg-white/5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300">
                            {goals.length} Active Goals
                        </div>
                    </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">My Targets</h2>
                {goals.length > 0 && (
                    <button onClick={handleCreateNew} className="text-emerald-600 text-sm font-semibold hover:text-emerald-700 transition-colors">
                        + Add New
                    </button>
                )}
            </div>

            {/* Goals Grid */}
            {goals.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Start Saving Today</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Create your first goal and start building your future one step at a time.</p>
                    <button
                        onClick={handleCreateNew}
                        className="btn-primary"
                    >
                        Create Your First Goal
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goals.map((goal, index) => {
                        const totalSaved = goal.savingsPlan
                            ?.filter(bit => bit.status === 'paid')
                            .reduce((sum, bit) => sum + bit.amount, 0) || 0;
                        const progress = Math.min((totalSaved / goal.targetAmount) * 100, 100);

                        return (
                            <button
                                key={goal.id}
                                onClick={() => handleGoalClick(goal.id)}
                                className="group card hover:border-emerald-500/30 text-left relative overflow-hidden p-0"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="p-5 relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-orange-100 p-3 rounded-2xl">
                                            <Trophy className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target</p>
                                            <p className="text-lg font-bold text-slate-900">₹{goal.targetAmount.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">
                                        {goal.name}
                                    </h3>
                                    <p className="text-xs text-slate-400 mb-4">Created {new Date().toLocaleDateString()}</p>

                                    {/* Progress Bar */}
                                    <div className="mb-2">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-2xl font-bold text-slate-900">
                                                {progress.toFixed(0)}<span className="text-sm text-slate-400 ml-1">%</span>
                                            </span>
                                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                                ₹{totalSaved.toLocaleString()} Saved
                                            </span>
                                        </div>
                                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Indicator */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
