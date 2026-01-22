import React, { useState } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { Dices, Sparkles, X, Check, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';
import confetti from 'canvas-confetti';

const RandomSaver = ({ onClose }) => {
    const { savingsPlan, makePayment, accounts, defaultAccountId } = usePiggy();
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedBit, setSelectedBit] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    // Get all pending bits
    const pendingBits = savingsPlan.filter(bit => bit.status === 'pending');

    const spin = () => {
        if (pendingBits.length === 0) return;
        setIsSpinning(true);
        setSelectedBit(null);

        // Simple animation logic
        // In a real app we might cycle through numbers, but here we just wait
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

    const handlePay = async () => {
        if (!selectedBit) return;
        setPaymentProcessing(true);

        // Use default account or first available
        const accountId = defaultAccountId || (accounts.length > 0 ? accounts[0].id : 'cash');

        await makePayment(selectedBit.id, accountId);

        setPaymentProcessing(false);
        onClose(); // Close modal after successful payment
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
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
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-6 mb-6">
                                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Destiny Selected</p>
                                <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                                    ₹{selectedBit.amount}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    Savings #{selectedBit.index}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={spin}
                                    className="py-3 px-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    Spin Again
                                </button>
                                <button
                                    onClick={handlePay}
                                    disabled={paymentProcessing}
                                    className="py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 transition-all flex items-center justify-center gap-2"
                                >
                                    {paymentProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    Save Now
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RandomSaver;
