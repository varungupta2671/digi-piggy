// Savings Simulator - Interactive what-if calculator
import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { cn } from '../utils/cn';

export default function SavingsSimulator({ goal }) {
    const [targetAmount, setTargetAmount] = useState(goal?.targetAmount || 50000);
    const [saveAmount, setSaveAmount] = useState(1000);
    const [frequency, setFrequency] = useState('monthly');

    const simulation = useMemo(() => {
        const frequencies = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };

        const daysPerSave = frequencies[frequency];
        const totalSaves = Math.ceil(targetAmount / saveAmount);
        const totalDays = totalSaves * daysPerSave;
        const months = Math.floor(totalDays / 30);
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        return {
            totalSaves,
            totalDays,
            months,
            years,
            remainingMonths,
            dailyRate: targetAmount / totalDays,
            weeklyRate: (targetAmount / totalDays) * 7,
            monthlyRate: (targetAmount / totalDays) * 30
        };
    }, [targetAmount, saveAmount, frequency]);

    const formatDuration = () => {
        if (simulation.years > 0) {
            return `${simulation.years}y ${simulation.remainingMonths}m`;
        }
        return `${simulation.months} months`;
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-6 h-6 text-indigo-500" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Savings Simulator</h3>
            </div>

            {/* Input Controls */}
            <div className="space-y-4 mb-6">
                <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                        Target Amount
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                        <input
                            type="number"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(parseInt(e.target.value) || 0)}
                            className="input pl-10"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                        Save Per Period
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                        <input
                            type="number"
                            value={saveAmount}
                            onChange={(e) => setSaveAmount(parseInt(e.target.value) || 0)}
                            className="input pl-10"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                        Frequency
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {['daily', 'weekly', 'monthly', 'yearly'].map(freq => (
                            <button
                                key={freq}
                                onClick={() => setFrequency(freq)}
                                className={cn(
                                    "py-2 px-3 rounded-lg text-sm font-medium transition-all",
                                    frequency === freq
                                        ? "bg-indigo-500 text-white shadow-md"
                                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                                )}
                            >
                                {freq.charAt(0).toUpperCase() + freq.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-800">
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
                    Your Savings Journey
                </h4>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-indigo-500" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">Duration</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {formatDuration()}
                        </p>
                    </div>

                    <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">Total Saves</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {simulation.totalSaves}
                        </p>
                    </div>

                    <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-amber-500" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">Daily Avg</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                            ₹{Math.round(simulation.dailyRate)}
                        </p>
                    </div>

                    <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-rose-500" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">Monthly Avg</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                            ₹{Math.round(simulation.monthlyRate)}
                        </p>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-800">
                    <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                        {simulation.months < 6
                            ? "🚀 Ambitious! You'll reach your goal quickly!"
                            : simulation.months < 12
                                ? "✨ Great plan! Steady progress ahead."
                                : simulation.months < 24
                                    ? "💪 Long-term commitment pays off!"
                                    : "🎯 Patient and persistent - the key to big goals!"}
                    </p>
                </div>
            </div>
        </div>
    );
}
