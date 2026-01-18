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

                                    <div className="space-y-3">
                                        <button
                                            onClick={() => handleLaunchApp('gpay')}
                                            disabled={accounts.length === 0}
                                            className="w-full py-4 bg-white hover:bg-slate-50 text-[#1F1F1F] font-bold rounded-full flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden border border-slate-200"
                                        >
                                            <div className="flex items-center gap-2 pointer-events-none">
                                                {/* Simple GPay Icon representation */}
                                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M4.5 9.5H2.5V14.5H4.5V9.5Z" fill="#7f8c8d" />
                                                    <path d="M19.5 9.5H16.5C15.9 9.5 15.5 9.9 15.5 10.5V11.5H18.5V12.5H15.5V14.5H14.5V9.5H19.5V8.5H14.5C13.9 8.5 13.5 8.9 13.5 9.5V14.5H11.5V6.5H21.5V9.5H19.5Z" fill="#4285F4" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.4578C11.76 9.87532 11.7067 9.31782 11.6111 8.78662H6V11.1378H9.22889C9.09111 11.8978 8.66444 12.5444 8.02667 12.9711V14.4933H9.96667C11.1022 13.4444 11.76 11.8978 11.76 10.4578Z" fill="#4285F4" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M6 16.3644C7.62 16.3644 8.97778 15.8267 10.0067 14.8689L8.06667 13.3467C7.52889 13.7067 6.84 13.9222 6 13.9222C4.43778 13.9222 3.11111 12.8644 2.63778 11.4444H0.635559V12.9978C1.61556 14.9467 3.63556 16.3644 6 16.3644Z" fill="#34A853" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M2.63778 11.4445C2.51556 11.0801 2.44889 10.6934 2.44889 10.2934C2.44889 9.89341 2.51556 9.50674 2.63778 9.14229V7.58896H0.635559C0.231115 8.39785 0 9.32007 0 10.2934C0 11.2667 0.231115 12.189 0.635559 12.9978L2.63778 11.4445Z" fill="#FBBC05" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M6 6.66444C6.88222 6.66444 7.67111 6.96889 8.29333 7.56444L10.0511 5.80667C8.97333 4.80222 7.61556 4.22222 6 4.22222C3.63556 4.22222 1.61556 5.64 0.635559 7.58889L2.63778 9.14222C3.11111 7.72222 4.43778 6.66444 6 6.66444Z" fill="#EA4335" />
                                                </svg>
                                                <span className="font-sans font-bold text-lg text-slate-700">Google Pay</span>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => handleLaunchApp('generic')}
                                            disabled={accounts.length === 0}
                                            className="w-full py-3 bg-[#2C1810] hover:bg-[#3E2723] text-[#A1887F] font-bold rounded-full flex items-center justify-center gap-2 transition-all border border-[#5D4037]"
                                        >
                                            <span className="text-sm uppercase tracking-wider">Other UPI Apps</span>
                                            <ExternalLink className="w-4 h-4 text-[#A1887F]" />
                                        </button>
                                    </div>
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
