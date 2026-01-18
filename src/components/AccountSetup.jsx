import { useState } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { Plus, CreditCard, Trash2, Save, Lock, Wallet, ShieldCheck, Unlock } from 'lucide-react';
import { cn } from '../utils/cn';

export default function AccountSetup() {
    const { accounts, addAccount, deleteAccount } = usePiggy();
    const [upiId, setUpiId] = useState('');
    const [name, setName] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Security State
    const [pin, setPin] = useState('');
    const [storedPin, setStoredPin] = useState(() => localStorage.getItem('piggy_pin'));
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [error, setError] = useState('');

    const handleSetPin = (e) => {
        e.preventDefault();
        if (pin.length !== 4 || isNaN(pin)) {
            setError('PIN must be 4 digits');
            return;
        }
        localStorage.setItem('piggy_pin', pin);
        setStoredPin(pin);
        setIsUnlocked(true);
        setPin('');
        setError('');
    };

    const handleUnlock = (e) => {
        e.preventDefault();
        if (pin === storedPin) {
            setIsUnlocked(true);
            setPin('');
            setError('');
        } else {
            setError('Incorrect PIN');
            setPin('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (upiId.trim() && name.trim()) {
            addAccount(upiId.trim(), name.trim());
            setUpiId('');
            setName('');
            setShowForm(false);
        }
    };

    if (!isUnlocked) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 animate-fade-in max-w-sm mx-auto">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <ShieldCheck className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {storedPin ? 'Security Check' : 'Set Security PIN'}
                </h3>
                <p className="text-slate-500 text-sm text-center mb-8">
                    {storedPin ? 'Please enter your PIN to manage accounts' : 'Create a 4-digit PIN to secure your savings accounts'}
                </p>

                <form onSubmit={storedPin ? handleUnlock : handleSetPin} className="w-full space-y-6">
                    <div className="relative">
                        <input
                            type="password"
                            inputMode="numeric"
                            maxLength="4"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="input text-center text-4xl tracking-[1em] font-bold h-20 placeholder:tracking-normal placeholder:text-4xl"
                            placeholder="••••"
                            autoFocus
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-4 btn-primary text-base"
                    >
                        {storedPin ? 'Unlock' : 'Set PIN'}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-24">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold">Linked Accounts</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsUnlocked(false)}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                            title="Lock"
                        >
                            <Lock className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="p-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl transition-colors shadow-lg shadow-emerald-500/30"
                        >
                            <Plus className={cn("w-5 h-5 transition-transform", showForm && "rotate-45")} />
                        </button>
                    </div>
                </div>
                <p className="text-slate-400 text-sm">Manage where your savings are transferred to.</p>
            </div>

            {showForm && (
                <div className="card animate-fade-in relative z-10 border-emerald-100 ring-4 ring-emerald-50/50">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-emerald-500" />
                        Add New Account
                    </h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Account Name</label>
                            <input
                                className="input"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. My Savings"
                                autoFocus
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">UPI ID</label>
                            <input
                                className="input"
                                value={upiId}
                                onChange={e => setUpiId(e.target.value)}
                                placeholder="name@upi"
                            />
                        </div>
                        <button className="w-full py-3 btn-primary flex items-center justify-center gap-2">
                            <Save className="w-4 h-4" />
                            Save Account
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-3">
                {accounts.map((account, index) => (
                    <div
                        key={account.id}
                        className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all flex items-center gap-4 group animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 truncate">{account.name}</p>
                            <p className="text-sm text-slate-500 font-mono truncate">{account.upiId}</p>
                        </div>
                        <button
                            onClick={() => deleteAccount(account.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Account"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}

                {accounts.length === 0 && !showForm && (
                    <div className="text-center py-12 px-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                        <CreditCard className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                        <p className="text-slate-500 font-medium">No accounts linked</p>
                        <p className="text-xs text-slate-400 mt-1">Tap the + button above to add a destination</p>
                    </div>
                )}
            </div>
        </div>
    );
}
