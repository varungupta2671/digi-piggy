import { useState } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { Plus, CreditCard, Trash2, Save, ArrowRight, Lock } from 'lucide-react';

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
            <div className="flex flex-col items-center justify-center p-8 space-y-6 font-['Courier_Prime'] animate-fade-in bg-[#1A0B08] rounded-2xl border-4 border-[#FFD700] m-4 shadow-2xl">
                <div className="mb-2 p-4 bg-[#2C1810] rounded-full border-2 border-[#5D4037]">
                    <CreditCard className="w-8 h-8 text-[#FFD700]" />
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-bold text-[#FFD700] font-['Righteous'] tracking-wide">
                        {storedPin ? 'SECURITY CHECK' : 'SETUP SECURITY'}
                    </h3>
                    <p className="text-xs text-[#A1887F] uppercase tracking-widest mt-2">
                        {storedPin ? 'Enter PIN to access accounts' : 'Create 4-digit PIN for protection'}
                    </p>
                </div>

                <form onSubmit={storedPin ? handleUnlock : handleSetPin} className="w-full max-w-xs space-y-4">
                    <input
                        type="password"
                        inputMode="numeric"
                        maxLength="4"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full bg-[#0F0502] border-2 border-[#5D4037] rounded-xl py-4 text-center text-[#00FF41] font-['VT323'] text-3xl tracking-[1em] focus:outline-none focus:border-[#FFD700] transition-all placeholder:text-[#2C1810] placeholder:tracking-normal"
                        placeholder="••••"
                        autoFocus
                    />
                    {error && <p className="text-[#FF5252] text-xs text-center font-bold">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-3 bg-[#FFD700] text-[#2C1810] font-black uppercase tracking-widest rounded-xl hover:bg-[#FFF8E7] transition-all shadow-lg border-b-4 border-[#D7CCC8] active:border-b-0 active:translate-y-1"
                    >
                        {storedPin ? 'UNLOCK' : 'SET PIN'}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6 font-['Courier_Prime'] animate-fade-in pb-20">
            <div className="flex items-center justify-between bg-[#1A0B08] p-4 rounded-2xl border-2 border-[#5D4037] shadow-lg">
                <div>
                    <h3 className="text-xl font-bold text-[#FFD700] font-['Righteous'] tracking-wide">LINK SAVINGS UPI</h3>
                    <p className="text-xs text-[#A1887F] uppercase tracking-widest">Where should your savings go?</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsUnlocked(false)}
                        className="p-3 bg-[#2C1810] text-[#A1887F] rounded-xl hover:text-[#FFD700] border border-[#5D4037] transition-all"
                        title="Lock"
                    >
                        <Lock className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="p-3 bg-[#FFD700] text-[#2C1810] rounded-xl hover:bg-[#FFF8E7] transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)] active:scale-95"
                    >
                        <Plus className={`w-6 h-6 transition-transform ${showForm ? 'rotate-45' : ''}`} />
                    </button>
                </div>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="p-6 bg-[#1A0B08] rounded-2xl border-4 border-[#FFD700] shadow-2xl relative overflow-hidden animate-slide-in-down space-y-4">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay pointer-events-none"></div>

                    <div className="relative z-10 space-y-4">
                        <div>
                            <label className="text-xs font-bold text-[#A1887F] uppercase tracking-widest block mb-2">Account Name</label>
                            <input
                                className="w-full bg-[#0F0502] border-2 border-[#5D4037] rounded-xl p-3 text-[#FFF8E7] focus:outline-none focus:border-[#FFD700] transition-colors font-bold placeholder:text-[#A1887F]/50"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. My Savings"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#A1887F] uppercase tracking-widest block mb-2">UPI ID</label>
                            <input
                                className="w-full bg-[#0F0502] border-2 border-[#5D4037] rounded-xl p-3 text-[#00FF41] font-['VT323'] text-xl focus:outline-none focus:border-[#FFD700] transition-colors placeholder:text-[#A1887F]/50"
                                value={upiId}
                                onChange={e => setUpiId(e.target.value)}
                                placeholder="user@upi"
                            />
                        </div>
                        <button className="w-full py-4 bg-[#FFD700] text-[#2C1810] font-black uppercase tracking-widest rounded-xl hover:bg-[#FFF8E7] transition-all flex items-center justify-center gap-2 shadow-lg border-b-4 border-[#D7CCC8] active:border-b-0 active:translate-y-1">
                            <Save className="w-5 h-5" />
                            Save Account
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {accounts.map((account, index) => (
                    <div
                        key={account.id}
                        className="p-4 bg-[#1A0B08] rounded-2xl border-2 border-[#5D4037] flex items-center gap-4 hover:border-[#FFD700] transition-colors group relative overflow-hidden animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                        <div className="w-12 h-12 rounded-xl bg-[#2C1810] border border-[#5D4037] flex items-center justify-center text-[#FFD700] shadow-inner flex-shrink-0">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-bold text-[#FFF8E7] truncate">{account.name}</p>
                            <p className="text-sm text-[#A1887F] font-['VT323'] tracking-widest truncate">{account.upiId}</p>
                        </div>
                        <button
                            onClick={() => deleteAccount(account.id)}
                            className="p-2 text-[#5D4037] hover:text-[#FF5252] hover:bg-[#2C1810] rounded-lg transition-colors"
                            title="Delete Account"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}

                {accounts.length === 0 && !showForm && (
                    <div className="text-center p-12 border-2 border-dashed border-[#5D4037] rounded-3xl opacity-50">
                        <ArrowRight className="w-8 h-8 mx-auto mb-2 text-[#5D4037] -rotate-45" />
                        <p className="text-[#A1887F] font-bold uppercase tracking-widest">No accounts linked</p>
                        <p className="text-xs text-[#5D4037] mt-1">Tap the + button to add a destination for your savings</p>
                    </div>
                )}
            </div>
        </div>
    );
}
