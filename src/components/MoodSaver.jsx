import { useState } from 'react';
import { Heart, Smile, Zap, Target, TrendingUp, X } from 'lucide-react';
import { usePiggy } from '../context/PiggyContext';
import { cn } from '../utils/cn';

const MOOD_PRESETS = [
    {
        id: 'happy',
        label: 'Happy',
        emoji: '😊',
        icon: Smile,
        amount: 100,
        color: 'from-yellow-400 to-orange-500',
        message: 'Feeling good? Save a treat!'
    },
    {
        id: 'motivated',
        label: 'Motivated',
        emoji: '💪',
        icon: Zap,
        amount: 300,
        color: 'from-blue-400 to-indigo-600',
        message: 'Channel that energy into savings!'
    },
    {
        id: 'excited',
        label: 'Excited',
        emoji: '🎉',
        icon: TrendingUp,
        amount: 500,
        color: 'from-pink-400 to-rose-600',
        message: 'Celebration savings! Lock it in!'
    },
    {
        id: 'determined',
        label: 'Determined',
        emoji: '🔥',
        icon: Target,
        amount: 1000,
        color: 'from-red-500 to-orange-600',
        message: 'Beast mode activated!'
    },
    {
        id: 'grateful',
        label: 'Grateful',
        emoji: '🙏',
        icon: Heart,
        amount: 200,
        color: 'from-purple-400 to-pink-600',
        message: 'Count blessings, save pennies!'
    }
];

export default function MoodSaver() {
    const { goal, makePayment, accounts, defaultAccountId, addNotification } = usePiggy();
    const [selectedMood, setSelectedMood] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [saving, setSaving] = useState(false);

    if (!goal) return null;

    const handleQuickSave = async (moodPreset) => {
        const account = accounts.find(a => a.id === (defaultAccountId || accounts[0]?.id));
        if (!account) {
            alert('Please set up an account first!');
            return;
        }

        const amount = customAmount ? parseFloat(customAmount) : moodPreset.amount;

        if (amount > account.balance) {
            alert('Insufficient balance!');
            return;
        }

        setSaving(true);
        setSelectedMood(moodPreset.id);

        // Create a manual bit for this mood-based save
        // In real implementation, you'd need to add this bit to the goal's plan
        // For now, we simulate with a toast/notification

        await addNotification({
            type: 'celebration',
            title: `${moodPreset.emoji} ${moodPreset.label} Save!`,
            message: `You saved ₹${amount} while feeling ${moodPreset.label.toLowerCase()}!`
        });

        setTimeout(() => {
            setSaving(false);
            setSelectedMood(null);
            setCustomAmount('');
        }, 1500);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mood Saver</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Save based on how you feel right now</p>
                </div>
                <div className="text-3xl animate-bounce-slow">💰</div>
            </div>

            {/* Mood Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                {MOOD_PRESETS.map(mood => {
                    const Icon = mood.icon;
                    const isSelected = selectedMood === mood.id;

                    return (
                        <button
                            key={mood.id}
                            onClick={() => handleQuickSave(mood)}
                            disabled={saving}
                            className={cn(
                                "group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300",
                                "hover:scale-105 active:scale-95",
                                isSelected
                                    ? `bg-gradient-to-br ${mood.color} border-transparent text-white shadow-lg`
                                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                            )}
                        >
                            {/* Animated check mark */}
                            {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white animate-bounce">
                                    ✓
                                </div>
                            )}

                            <span className="text-3xl mb-2">{mood.emoji}</span>
                            <span className={cn(
                                "text-xs font-medium mb-1",
                                isSelected ? "text-white" : "text-slate-700 dark:text-slate-300"
                            )}>
                                {mood.label}
                            </span>
                            <span className={cn(
                                "text-sm font-bold",
                                isSelected ? "text-white" : "text-emerald-600 dark:text-emerald-400"
                            )}>
                                ₹{mood.amount}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Custom Amount */}
            <div className="flex gap-2">
                <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Custom amount..."
                    className="flex-1 input text-sm"
                />
                <button
                    onClick={() => handleQuickSave(MOOD_PRESETS[0])}
                    disabled={!customAmount || saving}
                    className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save
                </button>
            </div>

            {saving && (
                <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        Saving...
                    </div>
                </div>
            )}
        </div>
    );
}
