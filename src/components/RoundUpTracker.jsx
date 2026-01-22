import { useState } from 'react';
import { Coins, TrendingUp, Plus } from 'lucide-react';
import { usePiggy } from '../context/PiggyContext';

export default function RoundUpTracker() {
    const { transactions, addNotification } = usePiggy();
    const [isEnabled, setIsEnabled] = useState(() => {
        return localStorage.getItem('roundUpEnabled') === 'true';
    });

    // Calculate virtual round-ups
    const roundUpData = transactions.reduce((acc, tx) => {
        const roundUp = Math.ceil(tx.amount / 100) * 100 - tx.amount;
        return {
            totalRoundUp: acc.totalRoundUp + roundUp,
            count: acc.count + 1
        };
    }, { totalRoundUp: 0, count: 0 });

    const handleToggle = () => {
        const newState = !isEnabled;
        setIsEnabled(newState);
        localStorage.setItem('roundUpEnabled', newState.toString());

        if (newState) {
            addNotification({
                type: 'celebration',
                title: 'Round-Up Enabled! 🎯',
                message: 'Your spare change is now being tracked automatically.'
            });
        }
    };

    const handleCollect = () => {
        if (roundUpData.totalRoundUp > 0) {
            addNotification({
                type: 'achievement',
                title: `Collected ₹${Math.round(roundUpData.totalRoundUp)}! 💰`,
                message: `Your round-ups have been added to your savings goal.`
            });
            // In a real implementation, this would create a transaction
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Coins className="w-6 h-6 text-amber-500" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Round-Up Savings</h3>
                </div>
                <button
                    onClick={handleToggle}
                    className={`w-12 h-6 rounded-full transition-colors ${isEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                </button>
            </div>

            {isEnabled ? (
                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border-2 border-amber-200 dark:border-amber-800">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                    Virtual Round-Ups
                                </p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                    ₹{Math.round(roundUpData.totalRoundUp)}
                                </p>
                            </div>
                            <div className="p-4 bg-amber-200 dark:bg-amber-800 rounded-full">
                                <Coins className="w-8 h-8 text-amber-700 dark:text-amber-200" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">
                                From {roundUpData.count} transactions
                            </span>
                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                                Avg ₹{roundUpData.count > 0 ? Math.round(roundUpData.totalRoundUp / roundUpData.count) : 0}/tx
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleCollect}
                        disabled={roundUpData.totalRoundUp === 0}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Collect Round-Ups
                    </button>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                        <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                            💡 Round-ups are virtual tracking. Click "Collect" to add them to your active goal!
                        </p>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Enable round-ups to automatically track spare change from your savings!
                    </p>
                    <p className="text-sm text-slate-500">
                        Every transaction will be rounded to the nearest ₹100
                    </p>
                </div>
            )}
        </div>
    );
}
