import { Trophy, Target, Zap, Shield, Sparkles, Heart, Users, Rocket, Code, Lock } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAFBFC] via-[#F0F4F8] to-[#E8F0FE] p-6 md:p-12 animate-fade-in">
            <div className="max-w-6xl mx-auto space-y-16">
                {/* Floating Gradient Orbs */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
                </div>

                {/* Hero Section */}
                <div className="text-center mb-16 relative animate-fade-in-up">
                    <div className="inline-block mb-6">
                        <div className="w-28 h-28 mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-12 transition-all duration-500 relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <Trophy className="w-16 h-16 text-white relative z-10" />
                        </div>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        DigiPiggy
                    </h1>
                    <p className="text-slate-600 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                        Your Smart Companion for Achieving Financial Dreams 💰
                    </p>
                </div>

                {/* Mission Statement */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-indigo-100 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
                            <h2 className="text-3xl font-bold text-slate-800">Our Mission</h2>
                        </div>
                        <p className="text-slate-700 text-lg leading-relaxed">
                            We believe saving money shouldn't feel like a chore. <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">DigiPiggy</span> transforms
                            your financial journey into an exciting adventure! Break down those big dreams into bite-sized "tickets"
                            and watch your progress soar. Every small step counts, and we're here to celebrate each one with you! 🎉
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mb-16">
                    <div className="flex items-center justify-center gap-3 mb-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <Sparkles className="w-8 h-8 text-indigo-600" />
                        <h2 className="text-4xl font-bold text-slate-800 text-center">Why You'll Love It</h2>
                        <Sparkles className="w-8 h-8 text-indigo-600" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Trophy,
                                title: "Gamified Savings",
                                description: "Turn saving into a game! Check off tickets and unlock achievements.",
                                gradient: "from-yellow-500 to-orange-500"
                            },
                            {
                                icon: Target,
                                title: "Smart Tracking",
                                description: "Set unlimited goals and track progress in real-time with beautiful charts.",
                                gradient: "from-green-500 to-emerald-500"
                            },
                            {
                                icon: Shield,
                                title: "Privacy First",
                                description: "Your data stays on your device. No cloud, no tracking, no worries.",
                                gradient: "from-blue-500 to-cyan-500"
                            },
                            {
                                icon: Zap,
                                title: "Lightning Fast",
                                description: "PWA that works offline, loads instantly, and feels native.",
                                gradient: "from-purple-500 to-pink-500"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-indigo-100 hover:border-indigo-300 transition-all duration-300 group hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl relative overflow-hidden animate-fade-in-up"
                                style={{ animationDelay: `${(index + 3) * 100}ms` }}
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

                                <div className="relative z-10">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-indigo-100 shadow-xl relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '700ms' }}>
                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <Code className="w-8 h-8 text-indigo-600" />
                            <h2 className="text-3xl font-bold text-slate-800 text-center">Built With Modern Tech</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {[
                                { name: 'React', icon: '⚛️' },
                                { name: 'Vite', icon: '⚡' },
                                { name: 'Tailwind', icon: '🎨' },
                                { name: 'IndexedDB', icon: '💾' },
                                { name: 'PWA', icon: '📱' },
                                { name: 'Router', icon: '🛣️' },
                                { name: 'Lucide', icon: '🎭' },
                                { name: 'Context', icon: '🔄' },
                                { name: 'Hooks', icon: '🪝' },
                                { name: 'ES6+', icon: '🚀' }
                            ].map((tech, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-br from-white to-indigo-50 p-4 rounded-xl text-center border border-indigo-100 hover:border-indigo-300 transition-all hover:scale-110 cursor-pointer group shadow-sm hover:shadow-lg"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">{tech.icon}</div>
                                    <p className="font-bold text-slate-700 text-sm group-hover:text-indigo-600 transition-colors">{tech.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                    {[
                        { icon: Users, label: "Active Users", value: "1000+", gradient: "from-blue-500 to-cyan-500" },
                        { icon: Lock, label: "Secure & Private", value: "100%", gradient: "from-green-500 to-emerald-500" },
                        { icon: Rocket, label: "Goals Achieved", value: "5000+", gradient: "from-purple-500 to-pink-500" }
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-indigo-100 shadow-lg hover:shadow-xl transition-all text-center group hover:scale-105"
                        >
                            <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-lg`}>
                                <stat.icon className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</div>
                            <div className="text-slate-600">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
                    <p className="text-slate-600 text-lg mb-6">Ready to start your savings journey?</p>
                    <button className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 group">
                        <Rocket className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        Get Started Today!
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center animate-fade-in">
                    <p className="text-slate-500 text-sm mb-2">
                        Made with ❤️ by developers who love saving
                    </p>
                    <p className="text-slate-400 text-xs">
                        DigiPiggy © 2026 • Open Source • MIT License
                    </p>
                </div>
            </div>
        </div>
    );
}
