import { usePiggy } from '../context/PiggyContext';
import { useNavigate } from 'react-router-dom';
import { Wallet, Settings, ArrowLeft, Trophy, Calendar, TrendingUp } from 'lucide-react';
import PlanList from './PlanList';
import AccountSetup from './AccountSetup';
import { useState } from 'react';
import { cn } from '../utils/cn';

export default function Dashboard() {
    const { goal, savingsPlan } = usePiggy();
    const [activeTab, setActiveTab] = useState('plan');
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
        <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">
            {/* Top Navigation / Header */}
            <div className="bg-white sticky top-0 z-30 shadow-sm px-4 py-3 md:hidden flex items-center gap-3">
                <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h1 className="text-lg font-bold text-slate-900 truncate flex-1">{goal.name}</h1>
                <div className="w-9 h-9"></div> {/* Spacer */}
            </div>

            <div className="max-w-5xl mx-auto p-4 md:p-8">
                <div className="md:grid md:grid-cols-[1fr_2fr] gap-6 md:h-[calc(100vh-100px)]">

                    {/* Sidebar / Overview Card */}
                    <div className="space-y-6">
                        {/* Main Goal Card */}
                        <div className="card overflow-hidden relative">
                            <div className="relative z-10 text-center py-6">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
                                    <Trophy className="w-10 h-10 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 mb-1">{goal.name}</h1>

                                <div className="flex justify-center items-center gap-2 text-sm text-slate-500 mb-6">
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
                                        <span className="text-slate-500 font-medium">Progress</span>
                                        <span className="text-slate-900 font-bold">{progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>₹{totalSaved.toLocaleString()}</span>
                                        <span>₹{goal.targetAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs (Desktop Side, Mobile sticky header handled above or generic tabs) */}
                        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex gap-1">
                            <button
                                onClick={() => setActiveTab('plan')}
                                className={cn(
                                    "flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                                    activeTab === 'plan' ? "bg-emerald-50 text-emerald-700 shadow-sm" : "text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                <Wallet className="w-4 h-4" />
                                Savings Plan
                            </button>
                            <button
                                onClick={() => setActiveTab('accounts')}
                                className={cn(
                                    "flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                                    activeTab === 'accounts' ? "bg-emerald-50 text-emerald-700 shadow-sm" : "text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="mt-6 md:mt-0 md:overflow-y-auto pr-1 custom-scrollbar md:h-full">
                        {activeTab === 'plan' ? (
                            <div className="animate-fade-in">
                                <PlanList />
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <AccountSetup />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
