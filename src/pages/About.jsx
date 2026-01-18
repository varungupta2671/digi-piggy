import { Trophy, Target, Zap, Shield, Sparkles, Heart, Rocket, Code, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 pb-24 md:pb-8 font-sans animate-fade-in">
            {/* Mobile-First Header Image/Hero */}
            <div className="bg-white pb-6 pt-8 px-6 rounded-b-[2.5rem] shadow-sm mb-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -ml-10 -mb-10"></div>

                <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-4 transform rotate-3">
                        <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">DigiPiggy</h1>
                    <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto leading-relaxed">
                        Your smart companion for financial freedom. Saving money shouldn't feel like a chore.
                    </p>
                </div>
            </div>

            <div className="px-4 space-y-4 max-w-3xl mx-auto">
                {/* Mission Card - Compact */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-start gap-4 relaltive z-10">
                        <div className="p-3 bg-rose-50 rounded-2xl shrink-0">
                            <Heart className="w-6 h-6 text-rose-500 fill-current" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 text-lg mb-1">Our Mission</h2>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                We transform your financial journey into an exciting adventure. Break down big dreams into small, achievable tickets.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features - Horizontal Scroll or Compact Grid? Let's do Compact Grid 2x2 for mobile compatibility */}
                <div>
                    <div className="flex items-center gap-2 mb-3 px-2">
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                        <h2 className="font-bold text-slate-800">Why DigiPiggy?</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: Trophy, title: "Gamified", desc: "Unlock badges", color: "bg-amber-100 text-amber-600" },
                            { icon: Target, title: "Goals", desc: "Track smart", color: "bg-emerald-100 text-emerald-600" },
                            { icon: Shield, title: "Private", desc: "Offline first", color: "bg-blue-100 text-blue-600" },
                            { icon: Zap, title: "Fast", desc: "Instant load", color: "bg-purple-100 text-purple-600" }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                                <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-2`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                                <p className="text-xs text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech & Stats - Very Compact List */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <Code className="w-4 h-4 text-slate-400" />
                            Under the Hood
                        </h3>
                    </div>
                    <div className="p-4 grid grid-cols-3 gap-y-4">
                        <div className="text-center">
                            <div className="font-bold text-slate-900 text-lg">100%</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wide">Secure</div>
                        </div>
                        <div className="text-center border-x border-slate-100">
                            <div className="font-bold text-slate-900 text-lg">0</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wide">Ads</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-slate-900 text-lg">MIT</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wide">License</div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="pt-4 pb-2">
                    <button
                        onClick={() => navigate('/create')}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        Start Saving Now
                        <ArrowRight className="w-5 h-5 opacity-80" />
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">
                        v2.0 • Made with ❤️ for savers
                    </p>
                </div>
            </div>
        </div>
    );
}
