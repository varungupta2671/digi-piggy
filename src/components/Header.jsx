import { Home, Info, Mail, Trophy, Moon, Sun, Menu, X, Clock, Target, Volume2, VolumeX, Settings, BookOpen, Users, ShoppingBag, IndianRupee, Coins, Shield, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
import { useTheme } from '../context/ThemeContext';
import { usePiggy } from '../context/PiggyContext';
import { useState } from 'react';
import PiggyAvatar from './PiggyAvatar';
import NotificationCenter from './NotificationCenter';
import VoiceControl from './VoiceControl';

export default function Header() {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const { isMuted, toggleMute, piggyCoins } = usePiggy();
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const navigationItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/community', label: 'Community', icon: Users },
        { path: '/marketplace', label: 'Market', icon: ShoppingBag },
        { path: '/bills', label: 'Bills', icon: IndianRupee },
        { path: '/advisor', label: 'Advisor', icon: MessageSquare },
        { path: '/learn', label: 'Learn', icon: BookOpen },
        { path: '/achievements', label: 'Trophies', icon: Trophy },
        { path: '/history', label: 'History', icon: Clock },
        { path: '/settings', label: 'Settings', icon: Settings },
        { path: '/about', label: 'About', icon: Info },
        { path: '/contact', label: 'Contact', icon: Mail },
    ];

    const handleLinkClick = () => {
        setMenuOpen(false);
    };

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo and Title */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110">
                        <PiggyAvatar className="w-full h-full" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                            DIGIPIGGY
                        </h1>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
                            Smart Savings
                        </p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {/* Show first 5 items on desktop, others in settings or elsewhere if needed */}
                    {navigationItems.slice(0, 5).map(item => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-full transition-all text-sm font-medium",
                                    isActive(item.path)
                                        ? "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 shadow-sm ring-1 ring-emerald-500/20"
                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />

                    {/* Mute Toggle */}
                    <button
                        onClick={toggleMute}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                        aria-label="Toggle sound"
                    >
                        {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-indigo-500" />}
                    </button>

                    {/* Piggy Coins Display */}
                    <Link
                        to="/marketplace"
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all group mx-1 border border-slate-200 dark:border-slate-700"
                    >
                        <Coins className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-black text-slate-800 dark:text-white tabular-nums tracking-tighter">
                            {piggyCoins.toLocaleString()}
                        </span>
                    </Link>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <NotificationCenter />
                    <VoiceControl />
                </nav>

                {/* Mobile Header Elements */}
                <div className="flex md:hidden items-center gap-1">
                    <Link
                        to="/marketplace"
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 mr-1"
                    >
                        <Coins className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-black text-slate-800 dark:text-white tabular-nums">
                            {piggyCoins.toLocaleString()}
                        </span>
                    </Link>

                    <button
                        onClick={toggleTheme}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Slide-out Menu */}
            {menuOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 md:hidden animate-fade-in" onClick={() => setMenuOpen(false)}>
                    <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-2xl animate-slide-in-right flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Navigation</h2>
                            <button onClick={() => setMenuOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <nav className="p-4 flex-1 overflow-y-auto space-y-1">
                            {navigationItems.map(item => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={handleLinkClick}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                            isActive(item.path)
                                                ? "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400"
                                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Settings & Audio</p>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={toggleMute} className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                    {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-indigo-500" />}
                                    <span className="text-[10px] font-bold mt-1 uppercase">{isMuted ? 'Muted' : 'Unmuted'}</span>
                                </button>
                                <button onClick={toggleTheme} className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                    {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
                                    <span className="text-[10px] font-bold mt-1 uppercase">{theme.toUpperCase()}</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <NotificationCenter />
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">Notifications</span>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center">
                            <p className="text-[10px] text-slate-400 font-medium">DIGIPIGGY v2.1.0 • Made with ❤️</p>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
                .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
            `}</style>
        </header>
    );
}
