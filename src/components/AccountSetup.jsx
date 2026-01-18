import { useState } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { Plus, CreditCard, Trash2 } from 'lucide-react';

export default function AccountSetup() {
    const { accounts, addAccount, deleteAccount } = usePiggy();
    const [upiId, setUpiId] = useState('');
    const [name, setName] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (upiId && name) {
            addAccount(upiId, name);
            setUpiId('');
            setName('');
            setShowForm(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-200">Link Savings UPI</h3>
                    <p className="text-xs text-slate-400">Where should your savings go?</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="p-2 bg-blue-600/20 text-blue-400 rounded-full hover:bg-blue-600/30 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="p-4 bg-slate-800 rounded-xl border border-slate-700 animate-slide-in-down space-y-4">
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Account Name (e.g. My Savings, Wife&apos;s GPay)</label>
                        <input
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="My Bank"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">UPI ID</label>
                        <input
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                            value={upiId}
                            onChange={e => setUpiId(e.target.value)}
                            placeholder="user@upi"
                        />
                    </div>
                    <button className="w-full py-2 bg-blue-600 rounded-lg text-white text-sm font-semibold">
                        Save Account
                    </button>
                </form>
            )}

            <div className="space-y-3">
                {accounts.map(account => (
                    <div key={account.id} className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-white">{account.name}</p>
                            <p className="text-xs text-slate-400 font-mono">{account.upiId}</p>
                        </div>
                        <button
                            onClick={() => deleteAccount(account.id)}
                            className="ml-auto p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}

                {accounts.length === 0 && !showForm && (
                    <div className="text-center p-8 border border-dashed border-slate-700 rounded-2xl text-slate-500 text-sm">
                        No accounts added yet. Tap + to add one.
                    </div>
                )}
            </div>
        </div>
    );
}
