import React, { useState } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { useTheme } from '../context/ThemeContext';
import {
    User, CreditCard, Bell, Moon, Sun, Volume2, VolumeX,
    Smartphone, Trash2, LogOut, ChevronRight, Shield,
    Download, RefreshCw, Plus, Check, Star, AlertTriangle
} from 'lucide-react';
import { cn } from '../utils/cn';
import ReportGenerator from '../components/ReportGenerator';

export default function SettingsPage() {
    const {
        accounts, addAccount, deleteAccount,
        defaultAccountId, setGlobalDefaultAccount,
        isMuted, toggleMute, exportAllData
    } = usePiggy();
    const { theme, toggleTheme } = useTheme();

    const [showAddAccount, setShowAddAccount] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountUpi, setNewAccountUpi] = useState('');
    const [error, setError] = useState('');

    // Bank Detection (Reused logic for consistency)
    const getBankInfo = (upi) => {
        if (!upi.includes('@')) return { name: 'Unknown Bank', color: 'bg-slate-100', text: 'text-slate-500' };
        const handle = upi.split('@')[1].toLowerCase();
        const banks = {
            'okicic': { name: 'ICICI Bank', color: 'bg-orange-100', text: 'text-orange-600' },
            'okhdfcbank': { name: 'HDFC Bank', color: 'bg-blue-100', text: 'text-blue-600' },
            'okaxis': { name: 'Axis Bank', color: 'bg-rose-100', text: 'text-rose-600' },
            'oksbi': { name: 'SBI', color: 'bg-indigo-100', text: 'text-indigo-600' },
            'paytm': { name: 'Paytm', color: 'bg-cyan-100', text: 'text-cyan-600' },
            'ybl': { name: 'PhonePe (Yes)', color: 'bg-purple-100', text: 'text-purple-600' },
        };
        return banks[handle] || { name: 'Linked Bank', color: 'bg-slate-100', text: 'text-slate-500' };
    };

    const handleAddAccount = (e) => {
        e.preventDefault();
        setError('');
        if (!newAccountName.trim() || !newAccountUpi.trim()) {
            setError('All fields are required');
            return;
        }
        if (!/^[\w.-]+@[\w.-]+$/.test(newAccountUpi)) {
            setError('Invalid UPI ID format');
            return;
        }
        addAccount(newAccountUpi.trim(), newAccountName.trim());
        setNewAccountName('');
        setNewAccountUpi('');
        setShowAddAccount(false);
    };

    const handleExport = async () => {
        const data = await exportAllData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `piggy_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 md:pb-8 animate-fade-in">
            <div className="max-w-2xl mx-auto px-4 pt-6 md:pt-10">

                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Manage preferences and payment methods</p>

                <div className="space-y-8">

                    {/* SECTION: ACCOUNTS */}
                    <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-indigo-500" />
                                Payment Methods
                            </h2>
                            <button
                                onClick={() => setShowAddAccount(!showAddAccount)}
                                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-colors"
                            >
                                {showAddAccount ? 'Cancel' : '+ Add New'}
                            </button>
                        </div>

                        {showAddAccount && (
                            <form onSubmit={handleAddAccount} className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 animate-slide-down">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Account Alias</label>
                                        <input
                                            className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                            placeholder="e.g. Primary Savings"
                                            value={newAccountName}
                                            onChange={e => setNewAccountName(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">UPI ID</label>
                                        <input
                                            className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                                            placeholder="user@bank"
                                            value={newAccountUpi}
                                            onChange={e => setNewAccountUpi(e.target.value)}
                                        />
                                    </div>
                                    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                                    <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-indigo-200 dark:shadow-none">
                                        Link Account
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="space-y-3">
                            {accounts.length > 0 ? accounts.map((acc) => {
                                const bank = getBankInfo(acc.upiId);
                                const isDefault = defaultAccountId === acc.id;
                                return (
                                    <div key={acc.id} className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-md transition-all bg-white dark:bg-slate-800">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bank.color)}>
                                                <Smartphone className={cn("w-5 h-5", bank.text)} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{acc.name}</h3>
                                                    {isDefault && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase">Default</span>}
                                                </div>
                                                <p className="text-xs text-slate-500 font-mono">{acc.upiId}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {!isDefault && (
                                                <button
                                                    onClick={() => setGlobalDefaultAccount(acc.id)}
                                                    className="p-2 text-slate-300 hover:text-yellow-500 transition-colors"
                                                    title="Set Default"
                                                >
                                                    <Star className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteAccount(acc.id)}
                                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                                title="Remove"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="text-center py-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <p className="text-sm text-slate-500">No payment methods added yet.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* SECTION: APP PREFERENCES */}
                    <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Smartphone className="w-5 h-5 text-emerald-500" />
                            App Preferences
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                                        {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">Appearance</p>
                                        <p className="text-xs text-slate-500">Toggle dark/light mode</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className={cn(
                                        "w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out",
                                        theme === 'dark' ? "bg-indigo-500" : "bg-slate-200"
                                    )}
                                >
                                    <div className={cn("w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300", theme === 'dark' && "translate-x-6")} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">Sound Effects</p>
                                        <p className="text-xs text-slate-500">Mute in-app sounds</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleMute}
                                    className={cn(
                                        "w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out",
                                        !isMuted ? "bg-emerald-500" : "bg-slate-200"
                                    )}
                                >
                                    <div className={cn("w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300", !isMuted && "translate-x-6")} />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* SECTION: DATA */}
                    <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-slate-400" />
                            Data & Privacy
                        </h2>

                        <div className="space-y-4">
                            <button onClick={handleExport} className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Download className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    <div className="text-left">
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">Export Data</p>
                                        <p className="text-xs text-slate-500">Download a backup of your goals</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </button>

                            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-red-700 dark:text-red-400 text-sm">Reset Application</p>
                                        <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1 mb-3">
                                            This will permanently delete all local data, including goals and transaction history.
                                        </p>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure? This will wipe ALL data.')) {
                                                    localStorage.clear();
                                                    window.location.reload();
                                                }
                                            }}
                                            className="text-xs font-bold bg-white dark:bg-red-900/40 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-50"
                                        >
                                            Reset Everything
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION: EXPORT & REPORTS */}
                    <ReportGenerator />

                    <div className="text-center pt-8 text-slate-400">
                        <p className="text-xs font-medium">DigiPiggy v2.1.0 (Build 2024.12)</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
