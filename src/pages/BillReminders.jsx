import { useState } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { cn } from '../utils/cn';
import { Calendar, Plus, Clock, CheckCircle2, AlertCircle, IndianRupee, Trash2 } from 'lucide-react';

export default function BillReminders() {
    const { billReminders, addBillReminder, premiumStatus } = usePiggy();
    const [isAdding, setIsAdding] = useState(false);
    const [newBill, setNewBill] = useState({
        name: '',
        amount: '',
        dueDate: '',
        category: 'utility'
    });

    const isLocked = premiumStatus === 'free';

    const handleAdd = (e) => {
        e.preventDefault();
        addBillReminder(newBill);
        setIsAdding(false);
        setNewBill({ name: '', amount: '', dueDate: '', category: 'utility' });
    };

    if (isLocked) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] max-w-md w-full text-center shadow-2xl border border-slate-100 dark:border-slate-700">
                    <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">Gold Feature</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                        Bill Reminders are available for Gold and Diamond Piggies. Never miss a payment again!
                    </p>
                    <button
                        onClick={() => window.location.hash = '#/settings'} // Simple route hack for demo
                        className="w-full py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
                    >
                        Upgrade Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-32 pt-6 px-4 max-w-4xl mx-auto">
            <header className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-2">
                        Bills <span className="text-indigo-500">&</span> Reminders
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">Keep your credit score healthy</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="p-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-3xl shadow-xl hover:scale-110 transition-transform"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </header>

            {isAdding && (
                <div className="mb-10 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 animate-in slide-in-from-top duration-500">
                    <form onSubmit={handleAdd} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Bill Name</label>
                                <input
                                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="e.g. Electricity"
                                    value={newBill.name}
                                    onChange={e => setNewBill({ ...newBill, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Amount</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl pl-12 pr-5 py-4 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                                        placeholder="0.00"
                                        value={newBill.amount}
                                        onChange={e => setNewBill({ ...newBill, amount: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Due Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                                    value={newBill.dueDate}
                                    onChange={e => setNewBill({ ...newBill, dueDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Category</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                                    value={newBill.category}
                                    onChange={e => setNewBill({ ...newBill, category: e.target.value })}
                                >
                                    <option value="utility">Utility</option>
                                    <option value="rent">Rent</option>
                                    <option value="subscription">Subscription</option>
                                    <option value="internet">Internet</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 py-4 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                Add Reminder
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-8 py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {billReminders.length === 0 ? (
                    <div className="text-center py-20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <AlertCircle className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No bills added yet</p>
                    </div>
                ) : (
                    billReminders.map((bill) => (
                        <div
                            key={bill.id}
                            className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-xl">
                                    {bill.category === 'utility' ? '⚡' : bill.category === 'rent' ? '🏠' : '📦'}
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-lg leading-tight mb-1">{bill.name}</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                            <Calendar className="w-3 h-3" />
                                            Due {new Date(bill.dueDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">₹{parseFloat(bill.amount).toLocaleString()}</span>
                                <div className="flex gap-2">
                                    <button className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all">
                                        <CheckCircle2 size={18} />
                                    </button>
                                    <button className="p-2 bg-pink-500/10 text-pink-500 rounded-xl hover:bg-pink-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
