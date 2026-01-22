import { Heart, Smile, Zap, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

const MOOD_OPTIONS = [
    { id: 'excited', label: 'Excited!', icon: Sparkles, color: 'text-yellow-500' },
    { id: 'motivated', label: 'Motivated', icon: Zap, color: 'text-orange-500' },
    { id: 'happy', label: 'Happy', icon: Smile, color: 'text-emerald-500' },
    { id: 'determined', label: 'Determined', icon: Heart, color: 'text-red-500' },
];

export default function TransactionJournal({ note, mood, onNoteChange, onMoodChange }) {
    return (
        <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    How are you feeling about this save?
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {MOOD_OPTIONS.map(option => {
                        const Icon = option.icon;
                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => onMoodChange(option.id)}
                                className={cn(
                                    "flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all",
                                    mood === option.id
                                        ? "border-current bg-white dark:bg-slate-700 shadow-md scale-105"
                                        : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500",
                                    option.color
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">{option.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Add a note (optional)
                </label>
                <textarea
                    value={note}
                    onChange={(e) => onNoteChange(e.target.value)}
                    placeholder="Why are you saving today? What's your motivation?"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                    rows={3}
                />
            </div>
        </div>
    );
}
