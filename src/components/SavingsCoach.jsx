import { usePiggy } from '../context/PiggyContext';
import { analyzeSavingBehavior } from '../utils/aiCoach';
import { Sparkles, TrendingUp, AlertCircle, PartyPopper } from 'lucide-react';

export default function SavingsCoach() {
    const { transactions, goals } = usePiggy();
    const insights = analyzeSavingBehavior(transactions, goals);

    if (insights.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                        Keep saving to unlock personalized insights!
                    </p>
                </div>
            </div>
        );
    }

    const getIconComponent = (type) => {
        switch (type) {
            case 'positive':
                return PartyPopper;
            case 'velocity':
            case 'consistency':
                return AlertCircle;
            default:
                return TrendingUp;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800';
            case 'medium':
                return 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800';
            default:
                return 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-indigo-500" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Savings Coach</h3>
            </div>

            <div className="space-y-4">
                {insights.map((insight, idx) => {
                    const IconComponent = getIconComponent(insight.type);

                    return (
                        <div
                            key={idx}
                            className={`p-4 rounded-xl border-2 bg-gradient-to-br ${getPriorityColor(insight.priority)}`}
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">{insight.icon}</span>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                                        {insight.title}
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                        {insight.message}
                                    </p>
                                    {insight.action && (
                                        <button className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                            {insight.action} →
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
