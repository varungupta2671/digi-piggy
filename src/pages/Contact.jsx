import { Mail, MessageCircle, Send, ArrowRight, Github, Twitter } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    return (
        <div className="min-h-screen bg-slate-50 pb-24 md:pb-8 font-sans animate-fade-in">
            {/* Header */}
            <div className="bg-white px-6 pt-8 pb-6 rounded-b-[2.5rem] shadow-sm mb-6 text-center">
                <div className="inline-block p-3 bg-indigo-50 rounded-2xl mb-4">
                    <MessageCircle className="w-8 h-8 text-indigo-600" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900">Get in Touch</h1>
                <p className="text-slate-500 text-sm mt-1">We'd love to hear your feedback!</p>
            </div>

            <div className="px-4 max-w-lg mx-auto space-y-6">

                {/* Contact Form Card */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                    <form className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Name</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all placeholder:font-normal placeholder:text-slate-400"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Email</label>
                            <input
                                type="email"
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all placeholder:font-normal placeholder:text-slate-400"
                                placeholder="hello@example.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Message</label>
                            <textarea
                                rows="3"
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all resize-none placeholder:font-normal placeholder:text-slate-400"
                                placeholder="Your thoughts..."
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        <button className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                            Send Message
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 gap-3">
                    <a href="mailto:support@digipiggy.app" className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Email Us</span>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center">
                            <Twitter className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Twitter</span>
                    </a>
                </div>

                <div className="text-center pt-4">
                    <p className="text-xs text-slate-400">Response time: &lt; 24 hours</p>
                </div>
            </div>
        </div>
    );
}
