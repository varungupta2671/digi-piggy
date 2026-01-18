import { usePiggy } from '../context/PiggyContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, TrendingUp, Calendar } from 'lucide-react';

export default function GoalsList() {
    const { goals, switchGoal } = usePiggy();
    const navigate = useNavigate();

    const handleGoalClick = (goalId) => {
        switchGoal(goalId);
        navigate(`/goal/${goalId}`);
    };

    const handleCreateNew = () => {
        // switchGoal(null); // No longer needed as CreateGoal/GoalForm handles state
        navigate('/create');
    };

    return (
        <div className="min-h-screen bg-[#0F0502] text-[#FFF8E7] font-['Courier_Prime'] p-4 md:p-8 animate-fade-in">
            <div className="max-w-6xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-['Righteous'] text-[#FFD700] mb-2">
                        MY SAVINGS GOALS
                    </h1>
                    <p className="text-[#A1887F] text-sm">
                        Select a goal to view details or create a new one
                    </p>
                </div>

                {/* Create New Goal Button */}
                <div className="mb-8 flex justify-center">
                    <button
                        onClick={handleCreateNew}
                        className="flex items-center gap-3 px-6 py-4 bg-[#FFD700] text-[#2C1810] rounded-xl font-bold uppercase tracking-wider hover:bg-[#FFF8E7] transition-all shadow-lg border-b-4 border-[#D7CCC8] active:border-b-0 active:translate-y-1"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Goal
                    </button>
                </div>

                {/* Goals Grid */}
                {goals.length === 0 ? (
                    <div className="text-center py-16">
                        <Trophy className="w-16 h-16 text-[#5D4037] mx-auto mb-4" />
                        <p className="text-[#A1887F] text-lg">No goals yet. Create your first savings goal!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {goals.map((goal, index) => {
                            const totalSaved = goal.savingsPlan
                                ?.filter(bit => bit.status === 'paid')
                                .reduce((sum, bit) => sum + bit.amount, 0) || 0;
                            const progress = Math.min((totalSaved / goal.targetAmount) * 100, 100);

                            return (
                                <button
                                    key={goal.id}
                                    onClick={() => handleGoalClick(goal.id)}
                                    className="bg-[#1A0B08] rounded-2xl p-6 border-4 border-[#FFD700] shadow-lg hover:scale-105 transition-transform text-left relative overflow-hidden group animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Texture Overlay */}
                                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay pointer-events-none"></div>

                                    <div className="relative z-10">
                                        {/* Goal Name */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <Trophy className="w-6 h-6 text-[#FFD700]" />
                                            <h3 className="text-xl font-['Righteous'] text-[#FFD700] truncate">
                                                {goal.name}
                                            </h3>
                                        </div>

                                        {/* Target Amount */}
                                        <div className="mb-4">
                                            <p className="text-[#A1887F] text-xs uppercase tracking-widest mb-1">Target</p>
                                            <p className="text-3xl font-['VT323'] text-[#00FF41]">
                                                ₹{goal.targetAmount.toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Progress */}
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[#A1887F] text-xs uppercase tracking-widest">Progress</span>
                                                <span className="text-[#FFD700] text-sm font-bold">{progress.toFixed(0)}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-[#0F0502] rounded-full border border-[#5D4037]">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFF8E7] rounded-full transition-all duration-500"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-[#FFFDE7] text-[#1A0B08] p-2 rounded-lg text-center">
                                                <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                                                <p className="text-xs font-bold">₹{totalSaved.toLocaleString()}</p>
                                                <p className="text-[8px] opacity-60">Saved</p>
                                            </div>
                                            <div className="bg-[#FFFDE7] text-[#1A0B08] p-2 rounded-lg text-center">
                                                <Calendar className="w-4 h-4 mx-auto mb-1" />
                                                <p className="text-xs font-bold">{goal.totalSlots}</p>
                                                <p className="text-[8px] opacity-60">Slots</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 bg-[#FFD700] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
