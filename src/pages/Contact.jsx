import { Mail, Github, Twitter, MessageCircle, Send, MapPin, Phone, Heart } from 'lucide-react';

export default function Contact() {
    return (
        <div className="min-h-screen bg-[#0F0502] text-[#FFF8E7] font-['Courier_Prime'] p-4 md:p-8 animate-fade-in">
            <div className="w-full max-w-6xl mx-auto space-y-8">
                {/* Animated Background */}
                <div className="fixed inset-0 pointer-events-none opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#FFD700] rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#FFD700] rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                {/* Hero Section */}
                <div className="text-center mb-16 relative">
                    <div className="inline-block mb-6">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#FFD700] to-[#FFF8E7] rounded-full flex items-center justify-center shadow-2xl border-4 border-[#5D4037] animate-bounce">
                            <MessageCircle className="w-12 h-12 text-[#2C1810]" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-['Righteous'] text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFF8E7] to-[#FFD700] mb-4">
                        LET'S CONNECT!
                    </h1>
                    <p className="text-[#A1887F] text-xl md:text-2xl font-['VT323']">
                        We'd love to hear from you! 💬
                    </p>
                </div>

                {/* Contact Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Email Card */}
                    <div className="bg-gradient-to-br from-[#1A0B08] to-[#2C1810] rounded-2xl p-8 border-4 border-[#FFD700] shadow-2xl relative overflow-hidden group hover:scale-105 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFF8E7] rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                                <Mail className="w-10 h-10 text-[#2C1810]" />
                            </div>
                            <h3 className="text-2xl font-['Righteous'] text-[#FFD700] mb-3">Email Us</h3>
                            <p className="text-[#A1887F] mb-4">Got questions? We're here to help!</p>
                            <a
                                href="mailto:support@digipiggy.app"
                                className="inline-block px-6 py-3 bg-[#FFD700] text-[#2C1810] rounded-lg font-bold hover:bg-[#FFF8E7] transition-all shadow-lg"
                            >
                                support@digipiggy.app
                            </a>
                        </div>
                    </div>

                    {/* Feedback Card */}
                    <div className="bg-gradient-to-br from-[#1A0B08] to-[#2C1810] rounded-2xl p-8 border-4 border-[#FFD700] shadow-2xl relative overflow-hidden group hover:scale-105 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFF8E7] rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                                <Heart className="w-10 h-10 text-[#2C1810]" />
                            </div>
                            <h3 className="text-2xl font-['Righteous'] text-[#FFD700] mb-3">Share Feedback</h3>
                            <p className="text-[#A1887F] mb-4">Help us improve! Your thoughts matter.</p>
                            <button className="inline-block px-6 py-3 bg-[#FFD700] text-[#2C1810] rounded-lg font-bold hover:bg-[#FFF8E7] transition-all shadow-lg">
                                Send Feedback
                            </button>
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="mb-12">
                    <h2 className="text-3xl font-['Righteous'] text-[#FFD700] mb-8 text-center flex items-center justify-center gap-3">
                        <Send className="w-8 h-8" />
                        Connect With Us
                        <Send className="w-8 h-8" />
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Github,
                                name: "GitHub",
                                handle: "@digipiggy",
                                url: "https://github.com",
                                color: "from-gray-600 to-gray-800",
                                hoverColor: "group-hover:from-gray-500 group-hover:to-gray-700"
                            },
                            {
                                icon: Twitter,
                                name: "Twitter",
                                handle: "@digipiggy_app",
                                url: "https://twitter.com",
                                color: "from-blue-400 to-blue-600",
                                hoverColor: "group-hover:from-blue-300 group-hover:to-blue-500"
                            },
                            {
                                icon: Mail,
                                name: "Newsletter",
                                handle: "Stay Updated",
                                url: "mailto:support@digipiggy.app",
                                color: "from-green-400 to-green-600",
                                hoverColor: "group-hover:from-green-300 group-hover:to-green-500"
                            }
                        ].map((social, index) => (
                            <a
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#1A0B08] rounded-2xl p-6 border-2 border-[#5D4037] hover:border-[#FFD700] transition-all group hover:scale-105 relative overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>

                                <div className="relative z-10 text-center">
                                    <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${social.color} ${social.hoverColor} rounded-full flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:rotate-12`}>
                                        <social.icon className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#FFD700] mb-2 font-['Righteous']">{social.name}</h3>
                                    <p className="text-[#A1887F] text-sm">{social.handle}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Location & Info */}
                <div className="bg-gradient-to-br from-[#1A0B08] to-[#2C1810] rounded-3xl p-8 md:p-12 border-4 border-[#FFD700] shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-['Righteous'] text-[#FFD700] mb-8 text-center">Quick Info</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <MapPin className="w-10 h-10 text-[#FFD700] mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-[#FFF8E7] mb-2">Location</h3>
                                <p className="text-[#A1887F]">Worldwide 🌍</p>
                            </div>

                            <div className="text-center">
                                <Phone className="w-10 h-10 text-[#FFD700] mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-[#FFF8E7] mb-2">Response Time</h3>
                                <p className="text-[#A1887F]">Within 24 hours ⚡</p>
                            </div>

                            <div className="text-center">
                                <Heart className="w-10 h-10 text-[#FFD700] mx-auto mb-3 animate-pulse" />
                                <h3 className="text-lg font-bold text-[#FFF8E7] mb-2">Open Source</h3>
                                <p className="text-[#A1887F]">Contributions Welcome! 🎉</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center animate-fade-in">
                    <p className="text-[#5D4037] text-sm mb-2">
                        Made with ❤️ for savers around the world
                    </p>
                    <p className="text-[#A1887F] text-xs">
                        DigiPiggy © 2026 • Open Source • Privacy First
                    </p>
                </div>
            </div>
        </div>
    );
}
