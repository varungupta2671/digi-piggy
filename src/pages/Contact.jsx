import { Mail, Github, Twitter, MessageCircle, Send, MapPin, Phone, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAFBFC] via-[#F0F4F8] to-[#E8F0FE] p-4 md:p-8 animate-fade-in">
            <div className="w-full max-w-6xl mx-auto space-y-12">
                {/* Floating Gradient Orbs */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
                </div>

                {/* Hero Section */}
                <div className="text-center mb-16 relative animate-fade-in-up">
                    <div className="inline-block mb-6">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-12 transition-all duration-500 relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <MessageCircle className="w-14 h-14 text-white relative z-10" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Let's Connect!
                    </h1>
                    <p className="text-slate-600 text-xl md:text-2xl max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                {/* Contact Form + Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Contact Form */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-indigo-100 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <div className="flex items-center gap-3 mb-6">
                            <Send className="w-6 h-6 text-indigo-600" />
                            <h2 className="text-2xl font-bold text-slate-800">Send a Message</h2>
                        </div>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/80 border-2 border-indigo-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/80 border-2 border-indigo-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows="4"
                                    className="w-full px-4 py-3 bg-white/80 border-2 border-indigo-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none resize-none"
                                    placeholder="Tell us what's on your mind..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
                            >
                                Send Message
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>

                    {/* Quick Contact Cards */}
                    <div className="space-y-6">
                        {[
                            {
                                icon: Mail,
                                title: "Email Us",
                                description: "support@digipiggy.app",
                                action: "mailto:support@digipiggy.app",
                                gradient: "from-blue-500 to-cyan-500"
                            },
                            {
                                icon: Heart,
                                title: "Share Feedback",
                                description: "Help us improve",
                                action: "#",
                                gradient: "from-pink-500 to-rose-500"
                            },
                            {
                                icon: Phone,
                                title: "Response Time",
                                description: "Within 24 hours ⚡",
                                gradient: "from-purple-500 to-indigo-500"
                            }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-indigo-100 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 group cursor-pointer animate-fade-in-up"
                                style={{ animationDelay: `${(index + 2) * 100}ms` }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                                        <item.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">{item.title}</h3>
                                        <p className="text-slate-600">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Sparkles className="w-6 h-6 text-indigo-600" />
                            <h2 className="text-3xl font-bold text-slate-800">Connect With Us</h2>
                            <Sparkles className="w-6 h-6 text-indigo-600" />
                        </div>
                        <p className="text-slate-600">Follow us on social media for updates and tips</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Github,
                                name: "GitHub",
                                handle: "@digipiggy",
                                url: "https://github.com",
                                gradient: "from-slate-700 to-slate-900"
                            },
                            {
                                icon: Twitter,
                                name: "Twitter",
                                handle: "@digipiggy_app",
                                url: "https://twitter.com",
                                gradient: "from-blue-400 to-blue-600"
                            },
                            {
                                icon: Mail,
                                name: "Newsletter",
                                handle: "Stay Updated",
                                url: "mailto:support@digipiggy.app",
                                gradient: "from-emerald-400 to-emerald-600"
                            }
                        ].map((social, index) => (
                            <a
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-indigo-100 hover:border-indigo-300 transition-all group hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl text-center"
                            >
                                <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${social.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-lg`}>
                                    <social.icon className="w-9 h-9 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{social.name}</h3>
                                <p className="text-slate-600 text-sm">{social.handle}</p>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Info Banner */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">Quick Info</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <MapPin className="w-10 h-10 text-white mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-white mb-2">Location</h3>
                                <p className="text-indigo-100">Worldwide 🌍</p>
                            </div>

                            <div className="text-center">
                                <Phone className="w-10 h-10 text-white mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-white mb-2">Response Time</h3>
                                <p className="text-indigo-100">Within 24 hours ⚡</p>
                            </div>

                            <div className="text-center">
                                <Heart className="w-10 h-10 text-white mx-auto mb-3 animate-pulse" />
                                <h3 className="text-lg font-bold text-white mb-2">Open Source</h3>
                                <p className="text-indigo-100">Contributions Welcome! 🎉</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center animate-fade-in">
                    <p className="text-slate-500 text-sm mb-2">
                        Made with ❤️ for savers around the world
                    </p>
                    <p className="text-slate-400 text-xs">
                        DigiPiggy © 2026 • Open Source • Privacy First
                    </p>
                </div>
            </div>
        </div>
    );
}
