import { usePiggy } from '../context/PiggyContext';
import { useMemo } from 'react';
import { Lightbulb, TrendingUp, Target, Calendar, Zap } from 'lucide-react';

export default function SmartSuggestions() {
    const { goals, transactions, savingsStreak } = usePiggy();

    const suggestions = useMemo(() => {
        const tips = [];

        if (goals.length === 0) {
            tips.push({
                icon: Target,
                color: 'bg-blue-100 text-blue-700 border-blue-200',
                iconColor: 'text-blue-600',
                message: "Create your first savings goal to get started!"
            });
            return tips;
        }

        // Active goal analysis
        const activeGoal = goals[0]; // Assuming first goal is active
        if (activeGoal) {
            const totalSaved = activeGoal.savingsPlan
                ?.filter(bit => bit.status === 'paid')
                .reduce((sum, bit) => sum + bit.amount, 0) || 0;
            const progress = (totalSaved / activeGoal.targetAmount) * 100;
            const remaining = activeGoal.targetAmount - totalSaved;

            // Near milestone
            if (progress >= 45 && progress < 50) {
                tips.push({
                    icon: Target,
                    color: 'bg-purple-100 text-purple-700 border-purple-200',
                    iconColor: 'text-purple-600',
                    message: `You're ₹${(activeGoal.targetAmount * 0.5 - totalSaved).toLocaleString()} away from 50% on ${activeGoal.name}!`
                });
            } else if (progress >= 95 && progress < 100) {
                tips.push({
                    icon: Zap,
                    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                    iconColor: 'text-yellow-600',
                    message: `Almost there! Just ₹${remaining.toLocaleString()} to complete ${activeGoal.name}!`
                });
            }
        }

        // Streak encouragement
        if (savingsStreak === 0 && transactions.length > 0) {
            tips.push({
                icon: TrendingUp,
                color: 'bg-orange-100 text-orange-700 border-orange-200',
                iconColor: 'text-orange-600',
                message: "Start a new streak today! Save any amount to begin."
            });
        } else if (savingsStreak >= 3 && savingsStreak < 7) {
            tips.push({
                icon: TrendingUp,
                color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                iconColor: 'text-emerald-600',
                message: `${7 - savingsStreak} more days to unlock 'Week Long' achievement!`
            });
        } else if (savingsStreak >= 7 && savingsStreak < 30) {
            tips.push({
                icon: Zap,
                color: 'bg-red-100 text-red-700 border-red-200',
                iconColor: 'text-red-600',
                message: `On fire! 🔥 ${30 - savingsStreak} days to 'Month Strong' badge!`
            });
        }

        // Transaction pattern analysis
        if (transactions.length >= 7) {
            const last7Days = transactions.slice(-7);
            const avgAmount = last7Days.reduce((sum, tx) => sum + tx.amount, 0) / 7;

            // Weekend pattern
            const weekendTx = transactions.filter(tx => {
                const day = new Date(tx.date).getDay();
                return day === 0 || day === 6;
            });

            if (weekendTx.length >= 3) {
                const avgWeekend = weekendTx.reduce((sum, tx) => sum + tx.amount, 0) / weekendTx.length;
                if (avgWeekend > avgAmount * 1.2) {
                    tips.push({
                        icon: Calendar,
                        color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
                        iconColor: 'text-indigo-600',
                        message: "You save more on weekends! Try depositing ₹" + Math.round(avgWeekend) + " today."
                    });
                }
            }
        }

        // Default motivational tip
        if (tips.length === 0 && transactions.length > 0) {
            const lastTx = transactions[transactions.length - 1];
            tips.push({
                icon: Lightbulb,
                color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
                iconColor: 'text-cyan-600',
                message: `Great job! You last saved ₹${lastTx.amount.toLocaleString()}. Keep the momentum going!`
            });
        }

        return tips.slice(0, 2); // Show max 2 suggestions
    }, [goals, transactions, savingsStreak]);

    if (suggestions.length === 0) return null;

    return (
        <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
                <div
                    key={index}
                    className={`p-4 rounded-2xl border-2 ${suggestion.color} animate-fade-in flex items-start gap-3`}
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="flex-shrink-0">
                        <suggestion.icon className={`w-5 h-5 ${suggestion.iconColor}`} />
                    </div>
                    <p className="text-sm font-medium leading-relaxed flex-1">
                        {suggestion.message}
                    </p>
                </div>
            ))}
        </div>
    );
}
