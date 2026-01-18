import { Trophy, Target, Zap, Shield, Sparkles, Heart, Users } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-[#0F0502] text-[#FFF8E7] font-['Courier_Prime'] p-6 md:p-12 animate-fade-in">
            <div className="max-w-3xl mx-auto space-y-12">
                {/* Animated Background Elements */}
                <div className="fixed inset-0 pointer-events-none opacity-10">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#FFD700] rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                {/* Hero Section */}
                <div className="text-center mb-16 relative">
                    <div className="inline-block mb-6 animate-bounce">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#FFD700] to-[#FFF8E7] rounded-2xl flex items-center justify-center shadow-2xl border-4 border-[#5D4037] transform rotate-12">
                            <Trophy className="w-12 h-12 text-[#2C1810]" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-['Righteous'] text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFF8E7] to-[#FFD700] mb-4 animate-fade-in">
                        DIGIPIGGY
                    </h1>
                    <p className="text-[#A1887F] text-xl md:text-2xl font-['VT323'] tracking-wide">
                        Your Smart Companion for Achieving Financial Dreams 💰
                    </p>
                </div>

                {/* Mission Statement with Gradient */}
                <div className="bg-gradient-to-br from-[#1A0B08] to-[#2C1810] rounded-3xl p-8 md:p-12 border-4 border-[#FFD700] shadow-2xl mb-12 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700] rounded-full blur-3xl opacity-5"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Heart className="w-8 h-8 text-[#FFD700] animate-pulse" />
                            <h2 className="text-3xl font-['Righteous'] text-[#FFD700]">Our Mission</h2>
                        </div>
                        <p className="text-[#FFF8E7] text-lg leading-relaxed">
                            We believe saving money shouldn't feel like a chore. <span className="text-[#FFD700] font-bold">DigiPiggy</span> transforms
                            your financial journey into an exciting adventure! Break down those big dreams into bite-sized "tickets"
                            and watch your progress soar. Every small step counts, and we're here to celebrate each one with you! 🎉
                        </p>
                    </div>
                </div>

                {/* Features Grid with Hover Effects */}
                <div className="mb-16">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <Sparkles className="w-8 h-8 text-[#FFD700]" />
                        <h2 className="text-4xl font-['Righteous'] text-[#FFD700] text-center">Why You'll Love It</h2>
                        <Sparkles className="w-8 h-8 text-[#FFD700]" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: Trophy,
                                title: "Gamified Savings",
                                description: "Turn saving into a game! Check off tickets, unlock achievements, and make every deposit feel like a win.",
                                color: "from-yellow-500 to-orange-500"
                            },
                            {
                                icon: Target,
                                title: "Smart Goal Tracking",
                                description: "Set unlimited goals, track progress in real-time, and visualize your journey with beautiful charts.",
                                color: "from-green-500 to-emerald-500"
                            },
                            {
                                icon: Shield,
                                title: "Privacy First",
                                description: "Your data, your device. Everything stays local with IndexedDB. No cloud, no tracking, no worries.",
                                color: "from-blue-500 to-cyan-500"
                            },
                            {
                                icon: Zap,
                                title: "Lightning Fast PWA",
                                description: "Install on any device! Works offline, loads instantly, and feels like a native app.",
                                color: "from-purple-500 to-pink-500"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-[#1A0B08] rounded-2xl p-6 border-2 border-[#5D4037] hover:border-[#FFD700] transition-all duration-300 group hover:scale-105 hover:shadow-2xl relative overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity`}></div>

                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#FFD700] to-[#FFF8E7] rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                                        <feature.icon className="w-8 h-8 text-[#2C1810]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#FFD700] mb-3 font-['Righteous']">{feature.title}</h3>
                                    <p className="text-[#A1887F] leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech Stack with Animated Cards */}
                <div className="bg-gradient-to-br from-[#1A0B08] to-[#2C1810] rounded-3xl p-8 md:p-12 border-4 border-[#FFD700] shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <Users className="w-8 h-8 text-[#FFD700]" />
                            <h2 className="text-3xl font-['Righteous'] text-[#FFD700] text-center">Built With Love & Modern Tech</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['React', 'Vite', 'TailwindCSS', 'IndexedDB', 'PWA', 'React Router', 'Lucide Icons', 'Context API'].map((tech, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-br from-[#2C1810] to-[#1A0B08] p-4 rounded-xl text-center border-2 border-[#5D4037] hover:border-[#FFD700] transition-all hover:scale-110 cursor-pointer group"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <p className="font-bold text-[#FFF8E7] group-hover:text-[#FFD700] transition-colors">{tech}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-12 animate-fade-in">
                    <p className="text-[#A1887F] text-lg mb-4">Ready to start your savings journey?</p>
                    <div className="inline-block px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFF8E7] text-[#2C1810] rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer border-b-4 border-[#D7CCC8]">
                        Get Started Today! 🚀
                    </div>
                </div>
            </div>
        </div>
    );
}
