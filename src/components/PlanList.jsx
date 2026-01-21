import { usePiggy } from '../context/PiggyContext';
import { useToast } from '../context/ToastContext';
import { useState } from 'react';
import { Check, Lock, ExternalLink, ThumbsUp, X, Smartphone, ShieldCheck } from 'lucide-react';
import { cn } from '../utils/cn';
import Confetti from './Confetti';

export default function PlanList() {
    const { savingsPlan, accounts, makePayment, defaultAccountId } = usePiggy();
    const { addToast } = useToast();

    const [selectedBit, setSelectedBit] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [paymentStep, setPaymentStep] = useState('initial');
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

    const handleLaunchApp = (appType) => {
        const receiverVpa = accounts.find(a => a.id === parseInt(selectedAccount))?.upiId;
        if (!receiverVpa) {
            addToast('Please select a valid savings account', 'error');
            return;
        }

        const baseUrl = appType === 'gpay' ? 'tez://upi/pay' : 'upi://pay';
        const upiLink = `${baseUrl}?pa=${receiverVpa}&pn=PiggyBankSave&tn=GoalSave&am=${selectedBit.amount}&cu=INR`;

        window.location.href = upiLink;
        setPaymentStep('confirming');
    };

    const handleVerification = (didPay) => {
        if (didPay) {
            makePayment(selectedBit.id, selectedAccount || 'manual');
            addToast(`Success! ₹${selectedBit.amount} Saved.`, 'success');
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
            handleCloseModal();
        } else {
            setPaymentStep('initial');
        }
    };

    return (
        <div className="space-y-6 pb-20">
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
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Secure Gateway</span>
                            </div>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Amount Display */}
                            <div className="text-center mb-8">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Paying Amount</p>
                                <div className="text-4xl font-bold text-slate-900 dark:text-white font-display">
                                    ₹{selectedBit.amount.toLocaleString()}
                                </div>
                            </div>

                            {/* Phase 1: Account Selection */}
                            {paymentStep === 'initial' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pay Using</label>

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
                                                Link a savings account in Wallet to proceed!
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (accounts.length === 0) return;

                                            // Realistic simulated flow
                                            setPaymentStep('connecting');

                                            // 1. Simulate "Connecting to Bank"
                                            setTimeout(() => {
                                                setPaymentStep('processing');

                                                // 2. Simulate "Processing"
                                                setTimeout(() => {
                                                    handleVerification(true);
                                                }, 2000);

                                            }, 1500);
                                        }}
                                        disabled={accounts.length === 0}
                                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <span>Proceed to Pay</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Phase 2: Connecting */}
                            {paymentStep === 'connecting' && (
                                <div className="py-8 flex flex-col items-center justify-center text-center animate-fade-in">
                                    <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
                                    <h4 className="text-lg font-bold text-slate-800 dark:text-white">Connecting Securely...</h4>
                                    <p className="text-slate-500 text-sm mt-2">Establishing 256-bit encrypted channel</p>
                                </div>
                            )}

                            {/* Phase 3: Processing */}
                            {paymentStep === 'processing' && (
                                <div className="py-8 flex flex-col items-center justify-center text-center animate-fade-in">
                                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6 relative">
                                        <Smartphone className="w-10 h-10 text-indigo-500 animate-pulse" />
                                        <div className="absolute -right-1 -bottom-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800 dark:text-white">Processing Payment</h4>
                                    <p className="text-slate-500 text-sm mt-2">Please do not close this window...</p>
                                </div>
                            )}

                        </div>

                        {/* Footer Trust Badge */}
                        <div className="bg-slate-50 dark:bg-slate-800/80 p-3 text-center border-t border-slate-100 dark:border-slate-700">
                            <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
                                <Lock className="w-3 h-3" />
                                POWERED BY DIGIPIGGY SECURE
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center px-1">
                <h2 className="text-lg font-bold text-slate-800">Savings Plan</h2>
                <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
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
                                    ? "bg-slate-100 text-slate-400 cursor-default"
                                    : "bg-white text-slate-800 shadow-sm hover:shadow-md hover:scale-105 hover:-translate-y-1 border border-slate-100"
                            )}
                            style={{ animationDelay: `${index * 30}ms` }}
                        >
                            {isPaid ? (
                                <Check className="w-8 h-8 text-emerald-400" />
                            ) : (
                                <>
                                    <span className="text-lg font-bold">₹{bit.amount}</span>
                                    <span className="text-[10px] font-medium text-slate-400 mt-1">
                                        {date.getDate()}/{date.getMonth() + 1}
                                    </span>
                                </>
                            )}
                        </button>
                    );
                })}
            </div>

            {savingsPlan.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 border-dashed">
                    <p className="text-slate-400 text-sm">No savings plan generated yet.</p>
                </div>
            )}
        </div>
    );
}
