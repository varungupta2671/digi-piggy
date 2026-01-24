import { useState } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { CHARACTERS } from '../data/characters';
import { ITEMS } from '../data/items';
import Avatar from '../components/Avatar';
import { cn } from '../utils/cn';
import { Lock, Unlock, Search } from 'lucide-react';

export default function Wardrobe() {
    const { inventory, avatarConfig, updateAvatar, unlockItem } = usePiggy();
    const [activeTab, setActiveTab] = useState('character'); // character | head | eyes | body | hand

    const handleCharacterSelect = (id) => {
        updateAvatar({ characterId: id });
    };

    const handleEquip = (slot, itemId) => {
        const currentEquipped = avatarConfig.equipped[slot];
        const newEquipped = currentEquipped === itemId ? null : itemId; // Toggle

        updateAvatar({
            equipped: {
                ...avatarConfig.equipped,
                [slot]: newEquipped
            }
        });
    };

    // Filter items by current tab type
    const getItemsForTab = () => {
        if (activeTab === 'character') return [];
        return ITEMS.filter(i => i.type === activeTab.toUpperCase());
    };

    const tabs = [
        { id: 'character', label: 'Piggy', icon: '🐷' },
        { id: 'head', label: 'Head', icon: '🤠' },
        { id: 'eyes', label: 'Eyes', icon: '😎' },
        { id: 'body', label: 'Body', icon: '👕' },
        { id: 'hand', label: 'Hand', icon: '🪄' },
    ];

    // Debug helper to unlock all for testing
    // const unlockAll = () => ITEMS.forEach(i => unlockItem(i.id));

    return (
        <div className="min-h-screen pb-32 pt-6 px-4">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                    Piggy Wardrobe
                </h1>
                <p className="text-slate-500 dark:text-slate-400">Customize your savings companion!</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Visual Preview - 3D Stage */}
                <div className="w-full lg:w-[45%] sticky top-24 flex flex-col items-center">
                    <div className="relative w-full max-w-md aspect-square rounded-[3rem] overflow-hidden group">
                        {/* 3D Environment Background */}
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-200 to-slate-400 dark:from-slate-800 dark:to-slate-950 transition-colors duration-500" />

                        {/* Grid Floor */}
                        <div
                            className="absolute bottom-0 inset-x-0 h-1/2 opacity-20 dark:opacity-10"
                            style={{
                                backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                                backgroundSize: '24px 24px',
                                transform: 'perspective(500px) rotateX(60deg) translateY(20px)',
                                transformOrigin: 'bottom'
                            }}
                        />

                        {/* Podium / Stage */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-12 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-[100%] border border-white/30 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]" />

                        {/* Spotlight */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-full bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-3xl pointer-events-none" />

                        <div className="relative z-10 w-full h-full flex items-center justify-center p-12 transition-transform duration-700 group-hover:scale-105">
                            <Avatar size="xl" className="drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)]" />
                        </div>

                        {/* Overlay Labels */}
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Preview</h2>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">3D Real-time Stage</p>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => <div key={i} className="w-1 h-4 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls - Glassmorphism UI */}
                <div className="flex-1 w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl border border-white/40 dark:border-white/5">
                    {/* Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-6 mb-6 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
                                    activeTab === tab.id
                                        ? "bg-slate-950 text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)] dark:bg-white dark:text-slate-950 scale-105"
                                        : "bg-white/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300"
                                )}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                        {activeTab === 'character' ? (
                            // Character Selection
                            CHARACTERS.map((char) => (
                                <div
                                    key={char.id}
                                    onClick={() => handleCharacterSelect(char.id)}
                                    className={cn(
                                        "group relative p-6 rounded-3xl border transition-all duration-500 cursor-pointer flex flex-col items-center gap-4",
                                        avatarConfig.characterId === char.id
                                            ? "border-pink-500 bg-pink-500/5 shadow-[0_15px_30px_rgba(236,72,153,0.15)]"
                                            : "border-slate-100 dark:border-slate-800 bg-white/30 dark:bg-black/20 hover:border-pink-300 dark:hover:border-pink-900"
                                    )}
                                >
                                    <div className="relative">
                                        <div
                                            className="w-16 h-16 rounded-3xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg"
                                            style={{
                                                backgroundColor: char.baseColor,
                                                border: `4px solid ${char.accentColor}`,
                                                boxShadow: `0 10px 20px ${char.accentColor}44`
                                            }}
                                        />
                                        {avatarConfig.characterId === char.id && (
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold border-2 border-white dark:border-slate-900 shadow-lg">
                                                ✓
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <div className="font-black text-xs uppercase tracking-tighter text-slate-800 dark:text-white">{char.name}</div>
                                        <div className="text-[9px] font-bold text-slate-400 leading-tight mt-1 opacity-60">{char.description}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Item Selection
                            getItemsForTab().map((item) => {
                                const isUnlocked = inventory.includes(item.id);
                                const isEquipped = avatarConfig.equipped[item.type] === item.id;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => isUnlocked && handleEquip(item.type, item.id)}
                                        className={cn(
                                            "group relative p-6 rounded-3xl border transition-all duration-500 flex flex-col items-center gap-4",
                                            !isUnlocked && "opacity-40 grayscale-[0.5] cursor-not-allowed",
                                            isUnlocked && "cursor-pointer hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]",
                                            isEquipped
                                                ? "border-violet-500 bg-violet-500/5 shadow-[0_20px_40px_rgba(139,92,246,0.1)]"
                                                : "border-slate-100 dark:border-slate-800 bg-white/30 dark:bg-black/20 hover:border-violet-300 dark:hover:border-violet-900"
                                        )}
                                    >
                                        <div className="relative text-5xl filter drop-shadow-xl transition-all duration-500 group-hover:scale-125 group-hover:-rotate-12 flex h-20 items-center justify-center">
                                            {item.icon}
                                            {isEquipped && (
                                                <div className="absolute -inset-4 bg-violet-500/20 blur-2xl rounded-full animate-pulse" />
                                            )}
                                        </div>

                                        <div className="text-center w-full">
                                            <div className="font-black text-[10px] uppercase tracking-tighter text-slate-800 dark:text-white truncate">{item.name}</div>
                                            <div className={cn(
                                                "text-[8px] font-black uppercase tracking-widest mt-1 px-2 py-0.5 rounded-full inline-block",
                                                item.rarity === 'legendary' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" :
                                                    item.rarity === 'epic' ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30" :
                                                        item.rarity === 'rare' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30" :
                                                            "bg-slate-100 text-slate-500 dark:bg-slate-800"
                                            )}>
                                                {item.rarity}
                                            </div>
                                        </div>

                                        {!isUnlocked && (
                                            <div className="absolute inset-x-0 bottom-0 top-1/2 flex items-center justify-center bg-gradient-to-t from-slate-200/80 dark:from-slate-900/80 to-transparent rounded-b-3xl pt-4">
                                                <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg border border-slate-100 dark:border-slate-700">
                                                    <Lock className="w-4 h-4 text-slate-500" />
                                                </div>
                                            </div>
                                        )}

                                        {isEquipped && (
                                            <div className="absolute top-4 right-4 w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_10px_#8b5cf6] animate-ping" />
                                        )}
                                    </div>
                                );
                            })
                        )}

                        {/* Empty State for Tab */}
                        {activeTab !== 'character' && getItemsForTab().length === 0 && (
                            <div className="col-span-full text-center py-12">
                                <Search className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No items in this vault</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* <button onClick={unlockAll} className="mt-8 text-xs text-slate-300">Dev: Unlock All</button> */}
        </div>
    );
}
