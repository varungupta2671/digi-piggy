import { useState } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { CHARACTERS } from '../data/characters';
import { ITEMS } from '../data/items';
import Avatar from '../components/Avatar';
import { cn } from '../utils/cn';
import { Lock, Unlock } from 'lucide-react';

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

            <div className="flex flex-col md:flex-row gap-8">
                {/* Visual Preview */}
                <div className="flex-1 flex flex-col items-center">
                    <div className="relative w-full max-w-sm aspect-square bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-[3rem] border-4 border-white dark:border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden">

                        {/* Spotlight effect */}
                        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                        <Avatar size="xl" />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700">
                    {/* Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-slate-100 dark:border-slate-700 no-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all",
                                    activeTab === tab.id
                                        ? "bg-slate-900 text-white shadow-lg transform scale-105"
                                        : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                                )}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {activeTab === 'character' ? (
                            // Character Selection
                            CHARACTERS.map((char) => (
                                <div
                                    key={char.id}
                                    onClick={() => handleCharacterSelect(char.id)}
                                    className={cn(
                                        "relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2",
                                        avatarConfig.characterId === char.id
                                            ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                                            : "border-slate-200 dark:border-slate-700 hover:border-pink-300"
                                    )}
                                >
                                    <div className="w-12 h-12 rounded-full" style={{ backgroundColor: char.baseColor, border: `3px solid ${char.accentColor}` }} />
                                    <div className="text-center">
                                        <div className="font-bold text-sm">{char.name}</div>
                                        <div className="text-[10px] text-slate-500 leading-tight mt-1">{char.description}</div>
                                    </div>
                                    {avatarConfig.characterId === char.id && (
                                        <div className="absolute top-2 right-2 w-3 h-3 bg-pink-500 rounded-full animate-pulse" />
                                    )}
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
                                            "relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 group",
                                            !isUnlocked && "opacity-60 grayscale cursor-not-allowed",
                                            isUnlocked && "cursor-pointer hover:border-violet-300",
                                            isEquipped
                                                ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-md ring-2 ring-violet-200 dark:ring-violet-800"
                                                : "border-slate-200 dark:border-slate-700"
                                        )}
                                    >
                                        <div className="text-4xl filter drop-shadow-sm transition-transform group-hover:scale-110 duration-300 items-center justify-center flex h-16">
                                            {item.icon}
                                        </div>

                                        <div className="text-center w-full">
                                            <div className="font-bold text-xs truncate w-full">{item.name}</div>
                                            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">{item.rarity}</div>
                                        </div>

                                        {!isUnlocked && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50 dark:bg-slate-900/50 rounded-xl backdrop-blur-[1px]">
                                                <Lock className="w-6 h-6 text-slate-400" />
                                            </div>
                                        )}

                                        {isEquipped && (
                                            <div className="absolute top-2 right-2 w-4 h-4 bg-violet-500 text-white rounded-full flex items-center justify-center shadow-lg transform scale-110">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping absolute opacity-75" />
                                                <div className="w-1.5 h-1.5 bg-white rounded-full relative" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}

                        {/* Empty State for Tab */}
                        {activeTab !== 'character' && getItemsForTab().length === 0 && (
                            <div className="col-span-full text-center py-8 text-slate-400">
                                No items found in this category yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* <button onClick={unlockAll} className="mt-8 text-xs text-slate-300">Dev: Unlock All</button> */}
        </div>
    );
}
