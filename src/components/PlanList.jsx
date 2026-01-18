import { usePiggy } from '../context/PiggyContext';
import { useToast } from '../context/ToastContext';
import { useState } from 'react';
import { Check, Lock, ExternalLink, ThumbsUp } from 'lucide-react';
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

    const handleLaunchApp = () => {
        const receiverVpa = accounts.find(a => a.id === parseInt(selectedAccount))?.upiId;
        if (!receiverVpa) {
            addToast('Please select a valid savings account', 'error');
            return;
        }
        const upiLink = `upi://pay?pa=${receiverVpa}&pn=PiggyBankSave&tn=GoalSave&am=${selectedBit.amount}&cu=INR`;
        window.location.href = upiLink;
        setPaymentStep('confirming');
    };

    const handleVerification = (didPay) => {
        if (didPay) {
            makePayment(selectedBit.id, selectedAccount || 'manual');
            addToast(`Ticket Checked! ₹${selectedBit.amount} Saved.`, 'success');

            // Trigger Confetti
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);

            handleCloseModal();
        } else {
            setPaymentStep('initial');
        }
    };

    return (
        <div className="space-y-6 pb-20 font-['Courier_Prime']">
            {showConfetti && <Confetti />}

            {/* Payment Modal Overlay */}
            {selectedBit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0502]/90 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#1A0B08] w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border-4 border-[#FFD700] relative">
                        <div className="absolute top-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMTBMMTAgMEwyMCAxMFoiIGZpbGw9IiMwRjA1MDIiLz48L3N2Zz4=')] opacity-50"></div>

                        <div className="p-6 text-center">
                            <h3 className="text-xl font-bold font-['Righteous'] text-[#FFD700] mb-1">
                                {paymentStep === 'initial' ? 'CONFIRM DEPOSIT' : 'VERIFY PAYMENT'}
                            </h3>
                            <div className="text-5xl font-bold text-[#FFF8E7] font-['VT323'] my-6 border-y-2 border-dashed border-[#5D4037] py-4">
                                ₹{selectedBit.amount}
                            </div>

                            {paymentStep === 'initial' && (
                                <div className="space-y-4 animate-slide-in-up">
                                    <div className="text-left">
                                        <label className="text-xs font-bold text-[#A1887F] uppercase tracking-widest block mb-2">Destination Piggy Bank</label>
                                        {accounts.length > 0 ? (
                                            <div className="space-y-2">
                                                {accounts.map(acc => (
                                                    <button
                                                        key={acc.id}
                                                        onClick={() => setSelectedAccount(acc.id)}
                                                        className={cn(
                                                            "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all",
                                                            selectedAccount === acc.id
                                                                ? "bg-[#2C1810] border-[#FFD700] text-[#FFD700]"
                                                                : "bg-transparent border-[#5D4037] text-[#A1887F] hover:bg-[#2C1810]"
                                                        )}
                                                    >
                                                        <span className="font-bold">{acc.name}</span>
                                                        <div className="text-[10px] opacity-70 font-mono">{acc.upiId}</div>
                                                        {selectedAccount === acc.id && <Check className="w-4 h-4 text-[#FFD700]" />}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-red-900/20 text-red-400 text-xs rounded-lg flex items-center gap-2 border border-red-900/50">
                                                <Lock className="w-3 h-3" />
                                                Link a Saving Account in Setup first!
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleLaunchApp}
                                        disabled={accounts.length === 0}
                                        className="w-full py-4 bg-white hover:bg-slate-50 text-[#1F1F1F] font-bold rounded-full flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden border border-slate-200"
                                    >
                                        <div className="flex items-center gap-2 pointer-events-none">
                                            <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.427 10.963V8.769h6.12c.075.405.105.774.105 1.258 0 4-2.73 7.027-6.225 7.027-3.66 0-6.6-2.94-6.6-6.6s2.94-6.6 6.6-6.6c1.86 0 3.51.69 4.8 1.86l-1.8 1.8c-.54-.57-1.47-1.11-3-1.11-2.52 0-4.59 2.07-4.59 4.65s2.07 4.65 4.59 4.65c2.37 0 3.39-1.68 3.51-2.82h-3.61v-2.19z" fill="#4285F4" /><path d="M17.82 17.82l-1.65-1.65c.66-.57 1.23-1.23 1.68-1.95l1.65 1.65c-.75 1.05-1.68 1.95-2.79 2.67z" fill="#34A853" /><path d="M21.9 12.03c0-.36-.03-.72-.09-1.08h-2.16v2.16h1.44c-.15 1.05-.72 2.01-1.53 2.67l1.65 1.65c2.13-1.98 3.36-4.86 2.69-7.4z" fill="#FBBC04" /><path d="M12.427 21.06c2.58 0 4.86-.96 6.39-2.61l-1.65-1.65c-.75.54-1.74.87-2.91.87-2.22 0-4.14-1.53-4.8-3.6l-1.89 1.5c1.41 2.7 4.29 4.49 7.41 4.49z" fill="#EA4335" /><path d="M7.627 14.07c-.18-.54-.27-1.11-.27-1.71s.09-1.17.27-1.71l-1.89-1.5c-.75 1.5-1.17 3.21-1.17 5.01s.42 3.51 1.17 5.01l1.89-1.5z" fill="#FBBC04" /><path d="M12.427 6.42c1.47 0 2.79.54 3.81 1.53l2.85-2.85C17.347 3.42 15.067 2.52 12.427 2.52c-3.12 0-6 1.77-7.41 4.47l1.89 1.5c.66-2.04 2.58-3.57 4.8-3.57z" fill="#EB4335" /></svg>
                                            <span className="font-sans font-medium text-lg text-slate-700">Open Payment App</span>
                                            <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                                        </div>
                                    </button>
                                </div>
                            )}

                            {paymentStep === 'confirming' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="bg-[#2C1810] p-4 rounded-xl border border-[#5D4037]">
                                        <p className="text-[#E8DCC4] text-sm mb-2">Use your payment app to transfer exactly</p>
                                        <p className="text-[#FFD700] text-xl font-bold font-['VT323']">₹{selectedBit.amount}</p>
                                        <p className="text-[#8D6E63] text-xs mt-2 italic">Waiting for your confirmation...</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleVerification(true)}
                                            className="py-4 bg-[#00C853] text-[#003300] font-black rounded-xl hover:bg-[#00E676] transition-colors border-b-4 border-[#006428] active:border-b-0 active:translate-y-1 flex flex-col items-center justify-center gap-1"
                                        >
                                            <ThumbsUp className="w-5 h-5" />
                                            <span className="text-xs uppercase tracking-widest">Done</span>
                                        </button>
                                        <button
                                            onClick={() => handleVerification(false)}
                                            className="py-4 bg-[#3E2723] text-[#A1887F] font-bold rounded-xl hover:bg-[#4E342E] transition-colors border-b-4 border-[#2C1810]"
                                        >
                                            <span className="text-xs uppercase tracking-widest">Retry</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleCloseModal}
                                className="mt-6 w-full py-3 text-[#FF5252] font-bold hover:bg-[#2C1810] rounded-xl transition-colors uppercase tracking-widest text-sm"
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-end px-2">
                <div>
                    <h2 className="text-xl font-bold text-[#FFD700] font-['Righteous'] tracking-wide">SAVINGS BOARD</h2>
                    <p className="text-[#A1887F] text-xs">Tap a ticket to save</p>
                </div>
                <div className="text-[#FFD700] text-xs font-mono bg-[#1A0B08] px-2 py-1 rounded border border-[#5D4037]">
                    {savingsPlan.filter(b => b.status === 'paid').length}/{savingsPlan.length} TICKETS
                </div>
            </div>

            <div className="p-4 bg-[#1A0B08] rounded-xl border-4 border-[#FFD700] shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay pointer-events-none"></div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] landscape:grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-3 relative z-10">
                    {savingsPlan.map((bit, index) => {
                        const isPaid = bit.status === 'paid';
                        const date = new Date(bit.dueDate);
                        const rotation = Math.random() * 4 - 2;

                        return (
                            <button
                                key={bit.id}
                                disabled={isPaid}
                                onClick={() => handleTileClick(bit)}
                                style={{
                                    transform: isPaid ? 'scale(0.95)' : `rotate(${rotation}deg)`,
                                    animationDelay: `${index * 50}ms`
                                }}
                                title={isPaid ? `Paid on ${new Date(bit.paidAt).toLocaleDateString()}` : `Due: ${date.toLocaleDateString()}`}
                                className={`
                                    aspect-square rounded-lg flex flex-col items-center justify-center transition-all duration-300 relative group p-1 hover:z-50 border-b-4 active:border-b-0 active:translate-y-1 active:rotate-0 animate-scale-in
                                    ${isPaid
                                        ? 'bg-[#0F0502] text-[#3E2723] border-[#1A1A1A] opacity-50 shadow-inner'
                                        : 'bg-[#FFFDE7] text-[#1A0B08] shadow-lg hover:scale-110 hover:bg-[#FFFFFF] border-[#D7CCC8]'
                                    }
                                `}
                            >
                                {isPaid ? (
                                    <Check className="w-6 h-6 text-[#3E2723] animate-celebrate" />
                                ) : (
                                    <>
                                        <span className="text-sm font-black tracking-tighter truncate w-full text-center font-['VT323'] text-xl">₹{bit.amount}</span>
                                        <div className="w-full h-[1px] bg-[#D7CCC8] my-1"></div>
                                        <span className="text-[8px] font-bold text-[#5D4037] uppercase tracking-wider font-sans leading-none">
                                            {date.getDate()}/{date.getMonth() + 1}
                                        </span>
                                    </>
                                )}

                                {!isPaid && (
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#000] text-[#FFD700] text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-[#FFD700] transition-opacity font-['VT323'] tracking-widest text-lg">
                                        DUE: {date.toLocaleDateString()}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="text-center text-[#5D4037] text-[10px] uppercase tracking-[0.2em] opacity-50 mt-8">
                DigiPiggy Systems • 2026
            </div>
        </div>
    );
}
