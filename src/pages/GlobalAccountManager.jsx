import React, { useState } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { Wallet, CreditCard, Plus, Trash2, Check, Star, Shield, Smartphone, Building2, Info, PiggyBank } from 'lucide-react';
import { cn } from '../utils/cn';

export default function GlobalAccountManager() {
    const { accounts, addAccount, deleteAccount, defaultAccountId, setGlobalDefaultAccount } = usePiggy();
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [upiId, setUpiId] = useState('');
    const [isDefault, setIsDefault] = useState(false);
    const [error, setError] = useState('');

    // Bank Detection Logic
    const getBankInfo = (upi) => {
        if (!upi.includes('@')) return { name: 'Unknown Bank', color: 'bg-slate-100', text: 'text-slate-500' };
        const handle = upi.split('@')[1].toLowerCase();

        const banks = {
            'okicic': { name: 'ICICI Bank', color: 'bg-orange-100', text: 'text-orange-600' },
            'okhdfcbank': { name: 'HDFC Bank', color: 'bg-blue-100', text: 'text-blue-600' },
            'okaxis': { name: 'Axis Bank', color: 'bg-rose-100', text: 'text-rose-600' },
            'oksbi': { name: 'SBI', color: 'bg-indigo-100', text: 'text-indigo-600' },
            'paytm': { name: 'Paytm', color: 'bg-cyan-100', text: 'text-cyan-600' },
            'ybl': { name: 'Yes Bank (PhonePe)', color: 'bg-purple-100', text: 'text-purple-600' },
            'axl': { name: 'Axis Bank (PhonePe)', color: 'bg-rose-100', text: 'text-rose-600' },
            'ibl': { name: 'ICICI Bank (PhonePe)', color: 'bg-orange-100', text: 'text-orange-600' }
        };

        return banks[handle] || { name: 'Linked Bank', color: 'bg-slate-100', text: 'text-slate-500' };
    };

    const validateUPI = (id) => {
        const regex = /^[\w.-]+@[\w.-]+$/;
        return regex.test(id);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Please enter a nickname for this account');
            return;
        }
        if (!validateUPI(upiId)) {
            setError('Invalid UPI ID format (e.g., name@bank)');
            return;
        }

        addAccount(upiId.trim(), name.trim(), isDefault);
        setName('');
        setUpiId('');
        setIsDefault(false);
        setShowForm(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 md:pb-8 animate-fade-in font-sans">
            <div className="max-w-2xl mx-auto px-4 pt-4 md:pt-8">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20">
                        <PiggyBank className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Savings Destinations</h1>
                        <p className="text-slate-500 dark:text-slate-400">Where should your money go?</p>
                    </div>
                </div>

                {/* Info Card: The Self-Transfer Model */}
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 mb-8 flex gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl h-fit text-blue-600 dark:text-blue-400">
                        <Info className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-blue-900 dark:text-blue-300 text-sm mb-1">How Real Money Saving Works</h3>
                        <p className="text-xs text-blue-800/80 dark:text-blue-400/80 leading-relaxed">
                            DigiPiggy doesn't hold your money. Instead, we help you transfer money to your own secondary bank account.
                            <br /><br />
                            <strong>Add the UPI ID of your savings account below.</strong> When you save, we'll open GPay/PhonePe to transfer money to yourself instantly & fee-free.
                        </p>
                    </div>
                </div>

                {/* Add New Button */}
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full py-4 bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-indigo-200 hover:text-indigo-500 transition-all mb-8 shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Add Savings Account (UPI)
                    </button>
                )}

                {/* Add Form */}
                {showForm && (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 mb-8 animate-scale-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-indigo-500" />
                                Add Destination
                            </h3>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">Close</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">My Savings Account (UPI ID)</label>
                                <div className="relative">
                                    <input
                                        className="input pl-11"
                                        placeholder="mysavings@okhdfcbank"
                                        value={upiId}
                                        onChange={e => setUpiId(e.target.value)}
                                        autoFocus
                                    />
                                    <Smartphone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                                </div>
                                {upiId && (
                                    <p className="text-xs text-indigo-500 mt-2 flex items-center gap-1 font-medium">
                                        <Shield className="w-3 h-3" />
                                        Bank: {getBankInfo(upiId).name}
                                    </p>
                                )}
                                <p className="text-[10px] text-slate-400 mt-2">Enter the UPI ID of the bank account where you want to STORE your savings.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Nickname</label>
                                <input
                                    className="input"
                                    placeholder="e.g. HDFC Savings, Emergency Fund"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl cursor-pointer" onClick={() => setIsDefault(!isDefault)}>
                                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors", isDefault ? "border-indigo-500 bg-indigo-500" : "border-slate-300")}>
                                    {isDefault && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Set as my primary savings destination</span>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl font-medium text-center">
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="w-full btn-primary py-4 text-base shadow-indigo-200">
                                Verify & Add Destination
                            </button>
                        </form>
                    </div>
                )}

                {/* Accounts List */}
                <div className="space-y-4">
                    {accounts.length > 0 && <h3 className="font-bold text-slate-900 dark:text-white px-2">Your Destinations</h3>}

                    {accounts.map((account, index) => {
                        const bankInfo = getBankInfo(account.upiId);
                        const isDefaultAccount = defaultAccountId === account.id;

                        return (
                            <div
                                key={account.id}
                                className={cn(
                                    "p-5 rounded-3xl border transition-all duration-300 relative group",
                                    isDefaultAccount
                                        ? "bg-white dark:bg-slate-800 border-indigo-500 shadow-md shadow-indigo-100"
                                        : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-200"
                                )}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", bankInfo.color)}>
                                            <CreditCard className={cn("w-6 h-6", bankInfo.text)} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900 dark:text-white">{account.name}</h3>
                                                {isDefaultAccount && (
                                                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase rounded-full tracking-wider">Primary</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 font-mono mt-0.5">{account.upiId}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => deleteAccount(account.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Actions */}
                                {!isDefaultAccount && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                                        <button
                                            onClick={() => setGlobalDefaultAccount(account.id)}
                                            className="text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                                        >
                                            <Star className="w-3 h-3" />
                                            Set as Primary
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {accounts.length === 0 && !showForm && (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <CreditCard className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Destinations Set</h3>
                            <p className="text-slate-500 max-w-xs mx-auto text-sm">Add a bank UPI ID where you want to accumulate your savings.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
