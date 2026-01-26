import { useState, useRef, useEffect } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { cn } from '../utils/cn';
import { Send, Bot, User, ArrowLeft, Loader2, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdvisorChat() {
    const { premiumStatus } = usePiggy();
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: 'Hello! I am your personal Piggy Advisor. How can I help you with your savings today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    const isLocked = premiumStatus !== 'pro';

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Mock AI Response
        setTimeout(() => {
            const botMsg = {
                id: Date.now() + 1,
                type: 'bot',
                text: getMockResponse(input)
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const getMockResponse = (text) => {
        const t = text.toLowerCase();
        if (t.includes('save')) return "To save more, I recommend setting up a small recurring goal first. Have you tried our 'Small Drops' strategy?";
        if (t.includes('invest')) return "Investment education is key! Check out our Learning Hub for new modules on SIP and Mutual Funds.";
        if (t.includes('goal')) return "Your current goal progress is looking good. If you increase your weekly drop by just 10%, you'll finish 2 weeks early!";
        return "That's an interesting question. As your Advisor, I suggest keeping 20% of your income for savings. Would you like to create a new goal for that?";
    };

    if (isLocked) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] max-w-md w-full text-center shadow-2xl border border-slate-100 dark:border-slate-700">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <Bot className="w-10 h-10 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">AI Advisor</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                        Chat with our Financial Advisor AI to get personalized savings tips. Diamond Piggy membership required.
                    </p>
                    <button
                        onClick={() => window.location.hash = '#/monetization'}
                        className="w-full py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
                    >
                        Unlock Advisor
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900 relative">
            <header className="p-6 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-2xl text-slate-500"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Bot className="text-white w-6 h-6" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800" />
                        </div>
                        <div>
                            <h2 className="font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Piggy Advisor</h2>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active AI Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <ShieldCheck size={14} className="text-blue-500" />
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none">Diamond Plan</span>
                </div>
            </header>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-10"
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex items-end gap-3 transition-all animate-in slide-in-from-bottom-2",
                            msg.type === 'user' ? "flex-row-reverse" : ""
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0 mb-1 shadow-md",
                            msg.type === 'bot' ? "bg-blue-500" : "bg-slate-900 dark:bg-slate-700"
                        )}>
                            {msg.type === 'bot' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className={cn(
                            "max-w-[80%] p-5 rounded-[2rem] text-sm font-bold leading-relaxed shadow-sm",
                            msg.type === 'bot'
                                ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-700"
                                : "bg-blue-600 text-white rounded-br-none shadow-blue-500/20"
                        )}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                            <Bot size={16} />
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl rounded-bl-none border border-slate-100 dark:border-slate-700">
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 pb-12">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4">
                    <div className="flex-1 relative">
                        <input
                            placeholder="Ask about your savings..."
                            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-3xl px-6 py-5 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all pr-12"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500">
                            <Sparkles size={18} />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="p-5 bg-blue-600 text-white rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all shadow-blue-500/20"
                    >
                        <Send size={24} strokeWidth={2.5} />
                    </button>
                </form>
            </div>
        </div>
    );
}
