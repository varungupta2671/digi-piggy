import React, { useState } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { useToast } from '../context/ToastContext';
import { Dices, Sparkles, X, Check, Loader2, Smartphone, AlertCircle, ThumbsUp, ExternalLink, Lock } from 'lucide-react';
import { cn } from '../utils/cn';
import confetti from 'canvas-confetti';

const RandomSaver = ({ onClose }) => {
    const { savingsPlan, makePayment, accounts, defaultAccountId } = usePiggy();
    const { addToast } = useToast();

    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedBit, setSelectedBit] = useState(null);
    const [paymentStep, setPaymentStep] = useState('initial'); // 'initial', 'confirming'

    // Get all pending bits
    const pendingBits = savingsPlan.filter(bit => bit.status === 'pending');

    const spin = () => {
        if (pendingBits.length === 0) return;
        setIsSpinning(true);
        setSelectedBit(null);
        setPaymentStep('initial');

        // Simple animation logic
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * pendingBits.length);
            setSelectedBit(pendingBits[randomIndex]);
            setIsSpinning(false);
            fireConfetti();
        }, 1500);
    };

    const fireConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    const handlePay = () => {
        if (!selectedBit) return;

        // Check for accounts
        if (accounts.length === 0) {
            addToast('Please link a savings destination first!', 'error');
            return;
        }

        // Use default account or first available
        const accountId = defaultAccountId || accounts[0].id;
        const receiverAccount = accounts.find(a => a.id === accountId) || accounts[0];

        // --- THE REAL MONEY FLOW ---
        const tr = `piggy${Date.now()}`;
        const upiLink = `upi://pay?pa=${receiverAccount.upiId}&pn=${encodeURIComponent(receiverAccount.name)}&am=${selectedBit.amount}&tn=PiggyFateSave&tr=${tr}&cu=INR`;

        // 1. Open the App
        window.location.href = upiLink;

        // 2. Move UI to "Did it work?" state
        setPaymentStep('confirming');
    };

    const handleManualConfirmation = (success) => {
        if (success) {
            const accountId = defaultAccountId || (accounts.length > 0 ? accounts[0].id : 'manual');
            makePayment(selectedBit.id, accountId);
            addToast(`Destiny Fulfilled! ₹${selectedBit.amount} Saved.`, 'success');
            onClose();
        } else {
            setPaymentStep('initial');
            addToast('Payment cancelled. Spin again if you dare!', 'info');
        }
    };

    if (pendingBits.length === 0) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl w-full max-w-sm text-center relative shadow-2xl">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X className="w-5 h-5" />
                    </button>
                    <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Goal Completed!</h3>
                    <p className="text-slate-500 dark:text-slate-400">There are no pending savings left. You've done it all!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in font-sans">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl w-full max-w-sm relative shadow-2xl border-2 border-indigo-100 dark:border-indigo-900/50">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Dices className={cn("w-8 h-8 text-indigo-600 dark:text-indigo-400 transition-all duration-700", isSpinning && "animate-spin")} />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Fate's Choice</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                        Let destiny decide your saving for today. Are you ready?
                    </p>

                    {!selectedBit ? (
                        <button
                            onClick={spin}
                            disabled={isSpinning}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSpinning ? 'Rolling...' : 'Spin the Wheel'}
                        </button>
                    ) : (
                        <div className="animate-fade-in-up">
                            {paymentStep === 'initial' ? (
                                <>
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-6 mb-6">
                                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Destiny Selected</p>
                                        <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                                            ₹{selectedBit.amount}
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            Savings #{selectedBit.index}
                                        </div>
                                    </div>

                                    {accounts.length === 0 && (
                                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs rounded-xl flex items-center gap-2 mb-4 border border-amber-100 dark:border-amber-900/50 text-left">
                                            <div className="p-1.5 bg-amber-100 dark:bg-amber-900/50 rounded-lg shrink-0">
                                                <Lock className="w-3 h-3" />
                                            </div>
                                            Link a savings destination in Settings to proceed!
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={spin}
                                            className="py-3 px-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                        >
                                            Spin Again
                                        </button>
                                        <button
                                            onClick={handlePay}
                                            disabled={accounts.length === 0}
                                            className="py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Save Now
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="py-2 text-center animate-fade-in">
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 mb-6 border border-emerald-100 dark:border-emerald-900/30">
                                        <h4 className="font-bold text-slate-800 dark:text-white mb-1">Check your UPI App</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Confirm the transfer of ₹{selectedBit.amount}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleManualConfirmation(false)}
                                            className="py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
                                        >
                                            No, Failed
                                        </button>
                                        <button
                                            onClick={() => handleManualConfirmation(true)}
                                            className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
                                        >
                                            Yes, Paid!
                                            <ThumbsUp className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RandomSaver;
