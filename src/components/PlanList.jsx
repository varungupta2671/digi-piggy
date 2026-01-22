import { usePiggy } from '../context/PiggyContext';
import { useToast } from '../context/ToastContext';
import { useState } from 'react';
import { Check, Lock, ExternalLink, ThumbsUp, X, Smartphone, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';
import Confetti from './Confetti';

export default function PlanList() {
    const { savingsPlan, accounts, makePayment, defaultAccountId } = usePiggy();
    const { addToast } = useToast();

    const [selectedBit, setSelectedBit] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [paymentStep, setPaymentStep] = useState('initial'); // 'initial', 'confirming'
    const [showConfetti, setShowConfetti] = useState(false);

    const handleTileClick = (bit) => {
        if (bit.status === 'paid') return;
        setSelectedBit(bit);
        setPaymentStep('initial');

        // Auto-select default or first account
        if (accounts.length > 0) {
            const initialAccount = defaultAccountId && accounts.find(a => a.id === defaultAccountId)
                ? defaultAccountId
                : accounts[0].id;
            setSelectedAccount(initialAccount);
        }
    };

    const handleCloseModal = () => {
        setSelectedBit(null);
        setPaymentStep('initial');
    };

    const handlePay = () => {
        const receiverAccount = accounts.find(a => a.id === parseInt(selectedAccount));

        if (!receiverAccount) {
            addToast('Please select a valid savings destination', 'error');
            return;
        }

        // --- THE REAL MONEY FLOW ---
        // Construct the UPI Intent Link
        // pa = Payee Address (The user's own savings account)
        // pn = Payee Name (User's Name)
        // am = Amount
        // tr = Transaction Ref (Unique)
        // tn = Transaction Note
        const tr = `piggy${Date.now()}`;
        const upiLink = `upi://pay?pa=${receiverAccount.upiId}&pn=${encodeURIComponent(receiverAccount.name)}&am=${selectedBit.amount}&tn=PiggyBankSave&tr=${tr}&cu=INR`;

        // 1. Open the App
        window.location.href = upiLink;

        // 2. Move UI to "Did it work?" state
        setPaymentStep('confirming');
    };

    const handleManualConfirmation = (success) => {
        if (success) {
            makePayment(selectedBit.id, selectedAccount || 'manual');
            addToast(`Success! ₹${selectedBit.amount} Saved.`, 'success');
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
            handleCloseModal();
        } else {
            // User cancelled or failed
            setPaymentStep('initial');
            addToast('Payment cancelled. Try again!', 'info');
        }
    };

    return (
        <div className="space-y-6 pb-20 font-sans">
            {showConfetti && <Confetti />}

            {/* Payment Modal */}
            {selectedBit && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in h-[100dvh] w-screen">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative animate-scale-in border border-slate-200 dark:border-slate-700">

                        {/* Header */}
                        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Secure Transfer</span>
                            </div>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Amount Display */}
                            <div className="text-center mb-8">
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Transferring to Self</p>
                                <div className="text-4xl font-black text-slate-900 dark:text-white font-display">
                                    ₹{selectedBit.amount.toLocaleString()}
                                </div>
                            </div>

                            {/* Phase 1: Destination Selection */}
                            {paymentStep === 'initial' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Destination Account</label>

                                        {accounts.length > 0 ? (
                                            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                                {accounts.map(acc => (
                                                    <button
                                                        key={acc.id}
                                                        onClick={() => setSelectedAccount(acc.id)}
                                                        className={cn(
                                                            "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group",
                                                            selectedAccount === acc.id
                                                                ? "bg-slate-900 dark:bg-indigo-600 border-slate-900 dark:border-indigo-600 text-white shadow-lg"
                                                                : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 text-slate-900 dark:text-white"
                                                        )}
                                                    >
                                                        <div>
                                                            <div className="font-bold text-sm">{acc.name}</div>
                                                            <div className={cn("text-xs font-mono mt-0.5", selectedAccount === acc.id ? "text-slate-300 dark:text-indigo-200" : "text-slate-500 dark:text-slate-400")}>
                                                                {acc.upiId}
                                                            </div>
                                                        </div>
                                                        {selectedAccount === acc.id && (
                                                            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                                                                <Check className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm rounded-xl flex items-center gap-3 border border-amber-100 dark:border-amber-900/50">
                                                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg shrink-0">
                                                    <Lock className="w-4 h-4" />
                                                </div>
                                                Link a savings destination in Wallet to start saving!
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={handlePay}
                                        disabled={accounts.length === 0}
                                        className="w-full py-4 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <span>Open Payment App</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                    <p className="text-[10px] text-center text-slate-400">
                                        We'll open your default UPI app (GPay, PhonePe, etc.)
                                    </p>
                                </div>
                            )}

                            {/* Phase 2: Manual Confirmation */}
                            {paymentStep === 'confirming' && (
                                <div className="py-2 text-center animate-fade-in">
                                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                        <Smartphone className="w-10 h-10 text-indigo-500" />
                                        <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
                                            <AlertCircle className="w-6 h-6 text-orange-400" />
                                        </div>
                                    </div>

                                    <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Check your UPI App</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                                        Did you successfully verify and complete the transfer of <strong>₹{selectedBit.amount}</strong>?
                                    </p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleManualConfirmation(false)}
                                            className="py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            No, Failed
                                        </button>
                                        <button
                                            onClick={() => handleManualConfirmation(true)}
                                            className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            Yes, Paid!
                                            <ThumbsUp className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center px-1">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Savings Plan</h2>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                    {savingsPlan.filter(b => b.status === 'paid').length} / {savingsPlan.length} Complete
                </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {savingsPlan.map((bit, index) => {
                    const isPaid = bit.status === 'paid';
                    const date = new Date(bit.dueDate);

                    return (
                        <button
                            key={bit.id}
                            disabled={isPaid}
                            onClick={() => handleTileClick(bit)}
                            className={cn(
                                "aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative group p-1",
                                isPaid
                                    ? "bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-default"
                                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm hover:shadow-md hover:scale-105 hover:-translate-y-1 border border-slate-100 dark:border-slate-700"
                            )}
                            style={{ animationDelay: `${index * 30}ms` }}
                        >
                            {isPaid ? (
                                <Check className="w-8 h-8 text-emerald-400 dark:text-emerald-500/50" />
                            ) : (
                                <>
                                    <span className="text-lg font-bold">₹{bit.amount}</span>
                                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1">
                                        {date.getDate()}/{date.getMonth() + 1}
                                    </span>
                                </>
                            )}
                        </button>
                    );
                })}
            </div>

            {savingsPlan.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 border-dashed">
                    <p className="text-slate-400 text-sm">No savings plan generated yet.</p>
                </div>
            )}
        </div>
    );
}
