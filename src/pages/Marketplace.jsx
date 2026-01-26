import { useState } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { ITEMS } from '../data/items';
import { cn } from '../utils/cn';
import { ShoppingBag, Star, Zap, Gem, ShoppingCart, ArrowLeft, Coins } from 'lucide-react';

export default function Marketplace() {
    const { piggyCoins, inventory, unlockItem, updatePiggyCoins } = usePiggy();
    const [filter, setFilter] = useState('ALL');

    const shopItems = ITEMS.map(item => ({
        ...item,
        price: item.rarity === 'legendary' ? 500 : item.rarity === 'epic' ? 250 : item.rarity === 'rare' ? 100 : 50
    }));

    const filteredItems = filter === 'ALL' ? shopItems : shopItems.filter(i => i.rarity.toUpperCase() === filter);

    const handlePurchase = (item) => {
        if (piggyCoins >= item.price && !inventory.includes(item.id)) {
            updatePiggyCoins(-item.price);
            unlockItem(item.id);
        }
    };

    return (
        <div className="min-h-screen pb-32 pt-6 px-4 max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-2 text-center md:text-left">
                        Achievement <span className="text-pink-500">Market</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest text-center md:text-left">Exchange Piggy Coins for items</p>
                </div>

                {/* Coin Display */}
                <div className="bg-slate-900 text-white px-8 py-5 rounded-[2.5rem] flex items-center gap-5 shadow-2xl border-4 border-slate-800">
                    <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <Coins className="text-white w-7 h-7" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none block mb-1">Your Balance</span>
                        <span className="text-3xl font-black tracking-tighter tabular-nums leading-none">{piggyCoins.toLocaleString()}</span>
                    </div>
                </div>
            </header>

            {/* Filters */}
            <div className="flex gap-3 overflow-x-auto pb-8 mb-4 no-scrollbar">
                {['ALL', 'COMMON', 'RARE', 'EPIC', 'LEGENDARY'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap",
                            filter === f
                                ? "bg-pink-500 text-white shadow-xl scale-105"
                                : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => {
                    const isOwned = inventory.includes(item.id);
                    const canAfford = piggyCoins >= item.price;

                    return (
                        <div
                            key={item.id}
                            className={cn(
                                "group bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-xl border-2 transition-all duration-500 flex flex-col items-center",
                                isOwned ? "border-emerald-500/20 opacity-80" : "border-slate-100 dark:border-slate-800 hover:border-pink-300 dark:hover:border-pink-900"
                            )}
                        >
                            <div className="relative mb-8 text-7xl group-hover:scale-125 transition-transform duration-500 filter drop-shadow-xl">
                                {item.icon}
                                {item.rarity === 'legendary' && <div className="absolute -inset-4 bg-amber-500/20 blur-2xl rounded-full animate-pulse" />}
                            </div>

                            <div className="text-center flex-1 w-full">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1 truncate">{item.name}</h3>
                                <div className={cn(
                                    "text-[9px] font-black uppercase tracking-widest mb-4 inline-block px-3 py-1 rounded-full",
                                    item.rarity === 'legendary' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                                )}>
                                    {item.rarity}
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 leading-relaxed mb-8 opacity-60 px-4">{item.description}</p>
                            </div>

                            <button
                                onClick={() => handlePurchase(item)}
                                disabled={isOwned || !canAfford}
                                className={cn(
                                    "w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all",
                                    isOwned
                                        ? "bg-emerald-500/10 text-emerald-500 cursor-default"
                                        : canAfford
                                            ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:scale-105 active:scale-95 shadow-xl"
                                            : "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                                )}
                            >
                                {isOwned ? (
                                    <>Owned <ShoppingCart size={14} /></>
                                ) : (
                                    <>
                                        {item.price} <Coins size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
