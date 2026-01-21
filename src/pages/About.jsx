import { Trophy, Target, Zap, Shield, Sparkles, Heart, Rocket, Code, ArrowRight, PiggyBank, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePiggy } from '../context/PiggyContext';
import { useToast } from '../context/ToastContext';

export default function About() {
    const navigate = useNavigate();
    const { exportAllData } = usePiggy();
    const { addToast } = useToast();

    const handleExport = async () => {
        try {
            const data = await exportAllData();
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const date = new Date().toISOString().split('T')[0];
            link.href = url;
            link.download = `digipiggy_backup_${date}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            addToast('💾 Data exported successfully!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            addToast('❌ Export failed. Please try again.', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 md:pb-8 font-sans animate-fade-in">
            {/* Mobile-First Header Image/Hero */}
            <div className="bg-white dark:bg-slate-800 pb-6 pt-8 px-6 rounded-b-[2.5rem] shadow-sm mb-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-50 dark:bg-yellow-900/20 rounded-full blur-3xl -ml-10 -mb-10"></div>

                <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center shadow-sm border border-emerald-200 dark:border-emerald-900/50 mb-4 transform rotate-3">
                        <PiggyBank className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">DIGIPIGGY</h1>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase mb-2">Smart Savings</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-xs mx-auto leading-relaxed">
                        Your smart companion for financial freedom. Saving money shouldn't feel like a chore.
                    </p>
                </div>
            </div>

            <div className="px-4 space-y-4 max-w-3xl mx-auto">
                {/* Mission Card - Compact */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                    <div className="flex items-start gap-4 relaltive z-10">
                        <div className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-2xl shrink-0">
                            <Heart className="w-6 h-6 text-rose-500 dark:text-rose-400 fill-current" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Our Mission</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                We transform your financial journey into an exciting adventure. Break down big dreams into small, achievable tickets.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features - Horizontal Scroll or Compact Grid? Let's do Compact Grid 2x2 for mobile compatibility */}
                <div>
                    <div className="flex items-center gap-2 mb-3 px-2">
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                        <h2 className="font-bold text-slate-800 dark:text-white">Why DigiPiggy?</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: Trophy, title: "Gamified", desc: "Unlock badges", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
                            { icon: Target, title: "Goals", desc: "Track smart", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
                            { icon: Shield, title: "Private", desc: "Offline first", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
                            { icon: Zap, title: "Fast", desc: "Instant load", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" }
                        ].map((item, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
                                <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-2`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech & Stats - Very Compact List */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                            <Code className="w-4 h-4 text-slate-400" />
                            Under the Hood
                        </h3>
                    </div>
                    <div className="p-4 grid grid-cols-3 gap-y-4">
                        <div className="text-center">
                            <div className="font-bold text-slate-900 dark:text-white text-lg">100%</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">Secure</div>
                        </div>
                        <div className="text-center border-x border-slate-100 dark:border-slate-700">
                            <div className="font-bold text-slate-900 dark:text-white text-lg">0</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">Ads</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-slate-900 dark:text-white text-lg">MIT</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">License</div>
                        </div>
                    </div>
                </div>

                {/* Data Export Section */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                            <Download className="w-4 h-4 text-slate-400" />
                            Backup Your Data
                        </h3>
                    </div>
                    <div className="p-4">
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                            Export all your savings data as a JSON file. Keep a backup of your goals, transactions, and achievements.
                        </p>
                        <button
                            onClick={handleExport}
                            className="w-full py-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 rounded-xl font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Export All Data
                        </button>
                    </div>
                </div>

                {/* CTA */}
                <div className="pt-4 pb-2">
                    <button
                        onClick={() => navigate('/create')}
                        className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 dark:shadow-indigo-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
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
