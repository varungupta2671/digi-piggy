import { useState } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { Bell, X, Settings } from 'lucide-react';

export default function ReminderSettings() {
    const { notifications } = usePiggy();
    const [preferences, setPreferences] = useState({
        disableInactivity: false,
        disablePattern: false,
        disableDeadlines: false,
        disableStreak: false,
        quietHoursStart: 22,
        quietHoursEnd: 8
    });
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (key) => {
        const updated = { ...preferences, [key]: !preferences[key] };
        setPreferences(updated);
        localStorage.setItem('reminderPreferences', JSON.stringify(updated));
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                aria-label="Reminder Settings"
            >
                <Settings className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Bell className="w-6 h-6 text-indigo-500" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Smart Reminders
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Inactivity Alerts</p>
                                    <p className="text-xs text-slate-500">Remind me if I haven't saved in 3+ days</p>
                                </div>
                                <button
                                    onClick={() => handleToggle('disableInactivity')}
                                    className={`w-12 h-6 rounded-full transition-colors ${preferences.disableInactivity
                                            ? 'bg-slate-300 dark:bg-slate-600'
                                            : 'bg-emerald-500'
                                        }`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${preferences.disableInactivity ? 'translate-x-1' : 'translate-x-6'
                                        }`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Pattern Reminders</p>
                                    <p className="text-xs text-slate-500">Remind me on my usual saving days</p>
                                </div>
                                <button
                                    onClick={() => handleToggle('disablePattern')}
                                    className={`w-12 h-6 rounded-full transition-colors ${preferences.disablePattern
                                            ? 'bg-slate-300 dark:bg-slate-600'
                                            : 'bg-emerald-500'
                                        }`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${preferences.disablePattern ? 'translate-x-1' : 'translate-x-6'
                                        }`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Deadline Alerts</p>
                                    <p className="text-xs text-slate-500">Warn me about approaching goal deadlines</p>
                                </div>
                                <button
                                    onClick={() => handleToggle('disableDeadlines')}
                                    className={`w-12 h-6 rounded-full transition-colors ${preferences.disableDeadlines
                                            ? 'bg-slate-300 dark:bg-slate-600'
                                            : 'bg-emerald-500'
                                        }`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${preferences.disableDeadlines ? 'translate-x-1' : 'translate-x-6'
                                        }`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Streak Protection</p>
                                    <p className="text-xs text-slate-500">Remind me to maintain my streak</p>
                                </div>
                                <button
                                    onClick={() => handleToggle('disableStreak')}
                                    className={`w-12 h-6 rounded-full transition-colors ${preferences.disableStreak
                                            ? 'bg-slate-300 dark:bg-slate-600'
                                            : 'bg-emerald-500'
                                        }`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${preferences.disableStreak ? 'translate-x-1' : 'translate-x-6'
                                        }`} />
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-sm text-slate-500 text-center">
                                Smart reminders help you stay consistent with your savings habits
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
