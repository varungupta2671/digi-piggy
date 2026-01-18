import { usePiggy } from '../context/PiggyContext';
import { useToast } from '../context/ToastContext';
import { useState } from 'react';
import { Check, Lock, ExternalLink, ThumbsUp, X, Smartphone } from 'lucide-react';
import { cn } from '../utils/cn';
import Confetti from './Confetti';

export default function PlanList() {
    const { savingsPlan, accounts, makePayment } = usePiggy();
    const { addToast } = useToast();

    const [selectedBit, setSelectedBit] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [paymentStep, setPaymentStep] = useState('initial');
    const [showConfetti, setShowConfetti] = useState(false);

    const handleTileClick = (bit) => {
        if (bit.status === 'paid') return;
        setSelectedBit(bit);
        setPaymentStep('initial');
        if (accounts.length > 0) setSelectedAccount(accounts[0].id);
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
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative">
                        <div className="p-6 text-center">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-slate-900">
                                    {paymentStep === 'initial' ? 'Deposite Funds' : 'Verify Payment'}
                                </h3>
                                <button onClick={handleCloseModal} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="my-8">
                                <span className="text-sm text-slate-500 font-medium uppercase tracking-wide">Amount</span>
                                <div className="text-5xl font-bold text-slate-900 mt-2">
                                    ₹{selectedBit.amount}
                                </div>
                            </div>

                            {paymentStep === 'initial' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="text-left space-y-3">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Destination Account</label>
                                        {accounts.length > 0 ? (
                                            <div className="space-y-2">
                                                {accounts.map(acc => (
                                                    <button
                                                        key={acc.id}
                                                        onClick={() => setSelectedAccount(acc.id)}
                                                        className={cn(
                                                            "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                                                            selectedAccount === acc.id
                                                                ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500"
                                                                : "bg-white border-slate-200 hover:border-emerald-200"
                                                        )}
                                                    >
                                                        <div>
                                                            <div className="font-bold text-slate-900">{acc.name}</div>
                                                            <div className="text-xs text-slate-500">{acc.upiId}</div>
                                                        </div>
                                                        {selectedAccount === acc.id && <Check className="w-5 h-5 text-emerald-500" />}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-orange-50 text-orange-600 text-sm rounded-xl flex items-center gap-3 border border-orange-100">
                                                <div className="p-2 bg-orange-100 rounded-lg">
                                                    <Lock className="w-4 h-4" />
                                                </div>
                                                Link a Savings Account in Settings first!
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <button
                                            onClick={() => handleLaunchApp('gpay')}
                                            disabled={accounts.length === 0}
                                            className="w-full py-3.5 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <Smartphone className="w-5 h-5" />
                                            Google Pay
                                        </button>

                                        <button
                                            onClick={() => handleLaunchApp('generic')}
                                            disabled={accounts.length === 0}
                                            className="w-full py-3.5 bg-white text-slate-700 font-bold rounded-xl flex items-center justify-center gap-3 border border-slate-200 hover:bg-slate-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                            Other UPI App
                                        </button>
                                    </div>
                                </div>
                            )}

                            {paymentStep === 'confirming' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                                        <p className="text-emerald-800 font-medium">Please confirm in your payment app</p>
                                        <div className="mt-4 flex justify-center">
                                            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => handleVerification(true)}
                                            className="py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
                                        >
                                            Done
                                        </button>
                                        <button
                                            onClick={() => handleVerification(false)}
                                            className="py-3 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            )}
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
