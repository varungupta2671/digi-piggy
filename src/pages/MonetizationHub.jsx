import { useState } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { cn } from '../utils/cn';
import { Zap, Shield, Crown, Check, AlertCircle } from 'lucide-react';

export default function MonetizationHub() {
    const { premiumStatus, updatePremiumStatus } = usePiggy();
    const [selectedPlan, setSelectedPlan] = useState(premiumStatus);

    const plans = [
        {
            id: 'free',
            name: 'Basic Piggy',
            price: 'Free',
            description: 'Essential savings tracking for everyone.',
            icon: Zap,
            color: 'from-slate-400 to-slate-500',
            features: [
                'Unlimited Savings Goals',
                'Basic Analytics',
                'Standard Avatar',
                'Ad-Supported experience'
            ]
        },
        {
            id: 'premium',
            name: 'Gold Piggy',
            price: '₹99/mo',
            description: 'Advanced features for serious savers.',
            icon: Shield,
            color: 'from-amber-400 to-amber-600',
            popular: true,
            features: [
                'Ad-Free Experience',
                'Advanced 3D Wardrobe Items',
                'Bill Reminders & Tracking',
                'Family Savings Groups'
            ]
        },
        {
            id: 'pro',
            name: 'Diamond Piggy',
            price: '₹249/mo',
            description: 'Ultimate power for financial masters.',
            icon: Crown,
            color: 'from-blue-500 to-indigo-600',
            features: [
                'AI Financial Advisor Chat',
                'Priority Support',
                'Exclusive Legendary Items',
                'Early access to new features'
            ]
        }
    ];

    const handleUpgrade = (id) => {
        updatePremiumStatus(id);
        setSelectedPlan(id);
    };

    return (
        <div className="min-h-screen pb-32 pt-6 px-4 max-w-6xl mx-auto">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-4">
                    Upgrade Your Piggy
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
                    Choose the plan that fits your savings journey. Unlock premium features and exclusive 3D items for your companion.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={cn(
                            "relative flex flex-col p-8 rounded-[3rem] transition-all duration-500 border-2 overflow-hidden",
                            selectedPlan === plan.id
                                ? "bg-white dark:bg-slate-800 border-indigo-500 shadow-[0_20px_50px_rgba(99,102,241,0.2)] scale-105"
                                : "bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        )}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-0 bg-amber-500 text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <div className={cn(
                            "w-16 h-16 rounded-3xl flex items-center justify-center mb-6 bg-gradient-to-br shadow-lg",
                            plan.color
                        )}>
                            <plan.icon className="w-8 h-8 text-white" />
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{plan.name}</h2>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-3xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                            {plan.id !== 'free' && <span className="text-slate-500 font-bold text-sm">/month</span>}
                        </div>

                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                            {plan.description}
                        </p>

                        <div className="space-y-4 mb-10 flex-1">
                            {plan.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-emerald-500" strokeWidth={3} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => handleUpgrade(plan.id)}
                            disabled={selectedPlan === plan.id}
                            className={cn(
                                "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300",
                                selectedPlan === plan.id
                                    ? "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-default"
                                    : "bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:scale-105 shadow-xl hover:shadow-indigo-500/25"
                            )}
                        >
                            {selectedPlan === plan.id ? 'Current Plan' : 'Select Plan'}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-16 p-8 bg-slate-900 dark:bg-black rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl border border-slate-800">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center border border-pink-500/30">
                        <AlertCircle className="w-8 h-8 text-pink-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-2">Need a trial?</h3>
                        <p className="text-slate-400 text-sm font-medium">Try any premium plan for 7 days, absolutely free.</p>
                    </div>
                </div>
                <button className="px-10 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                    Start Free Trial
                </button>
            </div>
        </div>
    );
}
