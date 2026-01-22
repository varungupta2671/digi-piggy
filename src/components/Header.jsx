import { Home, Info, Mail, Trophy, Moon, Sun, Menu, X, Clock, Target, Volume2, VolumeX, Wallet, Settings, BookOpen } from 'lucide-react';
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
    const { isMuted, toggleMute } = usePiggy();
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const navigationItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/settings', label: 'Settings', icon: Settings }, // User might still associate settings with wallet icon, but let's stick to Wallet icon for now as it's money settings? No, user found wallet confusing. Let's use Settings icon.
        // Actually, let's use Settings icon.
        { path: '/achievements', label: 'Trophies', icon: Trophy },
        { path: '/challenges', label: 'Challenges', icon: Target },
        { path: '/history', label: 'History', icon: Clock },
        { path: '/about', label: 'About', icon: Info },
        { path: '/contact', label: 'Contact', icon: Mail },
    ];

    const handleLinkClick = () => {
        setMenuOpen(false);
    };

    return (
        <>
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/80 dark:bg-slate-900/80">
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
                        {navigationItems.slice(0, 4).map(item => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium",
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

                        <Link
                            to="/about"
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium",
                                isActive('/about')
                                    ? "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 shadow-sm ring-1 ring-emerald-500/20"
                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <Info className="w-4 h-4" />
                            <span>About</span>
                        </Link>

                        <Link
                            to="/contact"
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium",
                                isActive('/contact')
                                    ? "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 shadow-sm ring-1 ring-emerald-500/20"
                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <Mail className="w-4 h-4" />
                            <span>Contact</span>
                        </Link>

                        {/* Mute Toggle */}
                        <button
                            onClick={toggleMute}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors ml-2"
                            aria-label="Toggle sound"
                        >
                            {isMuted ? (
                                <VolumeX className="w-5 h-5 text-slate-400" />
                            ) : (
                                <Volume2 className="w-5 h-5 text-indigo-500" />
                            )}
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors ml-2"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        {/* Notification Center */}
                        <NotificationCenter />

                        {/* Voice Commands */}
                        <VoiceControl />
                    </nav>

                    {/* Mobile Menu Button & Theme Toggle */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Slide-out Menu */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 md:hidden animate-fade-in"
                    onClick={() => setMenuOpen(false)}
                >
                    <div
                        className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-2xl animate-slide-in-right"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Menu Header */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Menu</h2>
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="p-4 space-y-2">
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
                                                ? "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 shadow-sm"
                                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Quick Actions Section */}
                        <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Quick Actions</p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <NotificationCenter />
                                    <span className="text-sm text-slate-600 dark:text-slate-300">Notifications</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <VoiceControl />
                                    <span className="text-sm text-slate-600 dark:text-slate-300">Voice Commands</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                                v2.0 • Made with ❤️
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
