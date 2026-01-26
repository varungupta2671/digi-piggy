import { useState } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { cn } from '../utils/cn';
import { Users, Trophy, Target, Globe, Plus, MessageCircle, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function Community() {
    const { groups, joinGroup, premiumStatus } = usePiggy();
    const [activeTab, setActiveTab] = useState('groups'); // groups | competitions

    const isLocked = premiumStatus === 'free';

    const mockGroups = [
        { id: '1', name: 'The Sharma Family', members: 4, goal: 'Summer Vacation', progress: 65, type: 'family' },
        { id: '2', name: 'Flat 402 Roomies', members: 3, goal: 'New PS5 Pro', progress: 42, type: 'friends' },
        { id: '3', name: 'Travel Buddies', members: 5, goal: 'Europe Trip 2026', progress: 12, type: 'friends' },
    ];

    const mockCompetitions = [
        { id: '1', name: '7-Day Streak Sprint', participants: 1240, prize: 'Legendary Cape', timeLeft: '2 days' },
        { id: '2', name: 'Macro-Saver Challenge', participants: 850, prize: 'Diamond Piggy Skin', timeLeft: '5 days' },
        { id: '3', name: 'Student Saver Open', participants: 3200, prize: '₹1000 Cashback', timeLeft: '12 hours' },
    ];

    if (isLocked) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] max-w-md w-full text-center shadow-2xl border border-slate-100 dark:border-slate-700">
                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">Community Hub</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                        Join Family Groups and Competitions to save together! Premium membership required.
                    </p>
                    <button
                        onClick={() => window.location.hash = '#/monetization'}
                        className="w-full py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
                    >
                        Learn More
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-32 pt-6 px-4 max-w-4xl mx-auto">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
                    Community <span className="text-pink-500">Hub</span>
                </h1>

                {/* Custom Tabs */}
                <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-3xl max-w-xs mx-auto mb-8 shadow-inner">
                    <button
                        onClick={() => setActiveTab('groups')}
                        className={cn(
                            "flex-1 py-3 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest transition-all",
                            activeTab === 'groups' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xl scale-105" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        Groups
                    </button>
                    <button
                        onClick={() => setActiveTab('competitions')}
                        className={cn(
                            "flex-1 py-3 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest transition-all",
                            activeTab === 'competitions' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xl scale-105" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        competitions
                    </button>
                </div>
            </header>

            {activeTab === 'groups' ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Your Groups</h2>
                        <button className="flex items-center gap-2 text-[10px] font-black text-pink-500 uppercase tracking-widest hover:scale-105 transition-transform bg-pink-50 dark:bg-pink-900/20 px-4 py-2 rounded-xl">
                            <Plus className="w-3 h-3" /> Create Group
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mockGroups.map(group => (
                            <div key={group.id} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 group cursor-pointer hover:border-pink-500 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-4 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-black">
                                                U{i}
                                            </div>
                                        ))}
                                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white border-4 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-black">
                                            +{group.members - 3}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-2xl group-hover:bg-pink-500 group-hover:text-white transition-colors">
                                        <MessageCircle className="w-5 h-5" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tighter">{group.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Saving for: <span className="text-slate-900 dark:text-slate-200">{group.goal}</span></p>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-400">Group Progress</span>
                                        <span className="text-pink-500">{group.progress}%</span>
                                    </div>
                                    <div className="h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" style={{ width: `${group.progress}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl mb-10">
                        <div className="absolute top-0 right-0 p-8 text-slate-800 pointer-events-none">
                            <Trophy size={160} strokeWidth={1} />
                        </div>
                        <div className="relative z-10 max-w-xs">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 animate-pulse">
                                <Globe size={10} /> Live Now
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">Season 1: Master of Streaks</h2>
                            <p className="text-slate-400 text-xs font-medium mb-8">Maintain the longest savings streak to win exclusive 3D furniture for your Piggy Wardrobe.</p>
                            <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                                Enter Arena
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {mockCompetitions.map(comp => (
                            <div key={comp.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between group hover:border-amber-500 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                        🏆
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1">{comp.name}</h3>
                                        <div className="flex gap-4">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 line-clamp-1">
                                                <Users size={12} /> {comp.participants} Joined
                                            </span>
                                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <Clock size={12} /> {comp.timeLeft} Left
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reward</div>
                                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl text-[10px] font-black text-amber-600 uppercase tracking-widest">
                                        {comp.prize} <ArrowUpRight size={12} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
