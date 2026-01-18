import { Home, Info, Mail, Palette, Trophy } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { cn } from '../utils/cn';

export default function Header() {
    const { theme, setTheme } = useTheme();
    const [showThemeMenu, setShowThemeMenu] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="bg-[#1A0B08] border-b-4 border-[#FFD700] shadow-lg relative z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo and Title */}
                <Link to="/" className="flex items-center gap-3 group">
                    <img
                        src="/pwa-192x192.png"
                        alt="DigiPiggy"
                        className="w-10 h-10 rounded-lg border-2 border-[#FFD700] group-hover:scale-110 transition-transform"
                    />
                    <div>
                        <h1 className="text-xl font-['Righteous'] text-[#FFD700] tracking-wide">
                            DIGIPIGGY
                        </h1>
                        <p className="text-[8px] text-[#A1887F] uppercase tracking-widest font-bold">
                            Smart Digital Savings
                        </p>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-2">
                    <Link
                        to="/"
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-bold uppercase tracking-wider",
                            isActive('/')
                                ? "bg-[#FFD700] text-[#2C1810]"
                                : "text-[#FFF8E7] hover:bg-[#2C1810]"
                        )}
                    >
                        <Home className="w-4 h-4" />
                        <span className="hidden sm:inline">Home</span>
                    </Link>

                    <Link
                        to="/about"
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-bold uppercase tracking-wider",
                            isActive('/about')
                                ? "bg-[#FFD700] text-[#2C1810]"
                                : "text-[#FFF8E7] hover:bg-[#2C1810]"
                        )}
                    >
                        <Info className="w-4 h-4" />
                        <span className="hidden sm:inline">About</span>
                    </Link>

                    <Link
                        to="/contact"
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-bold uppercase tracking-wider",
                            isActive('/contact')
                                ? "bg-[#FFD700] text-[#2C1810]"
                                : "text-[#FFF8E7] hover:bg-[#2C1810]"
                        )}
                    >
                        <Mail className="w-4 h-4" />
                        <span className="hidden sm:inline">Contact</span>
                    </Link>

                    <Link
                        to="/achievements"
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-bold uppercase tracking-wider",
                            isActive('/achievements')
                                ? "bg-[#FFD700] text-[#2C1810]"
                                : "text-[#FFF8E7] hover:bg-[#2C1810]"
                        )}
                    >
                        <Trophy className="w-4 h-4" />
                        <span className="hidden sm:inline">Trophies</span>
                    </Link>

                    {/* Theme Switcher */}
                    <div className="relative ml-2">
                        <button
                            onClick={() => setShowThemeMenu(!showThemeMenu)}
                            className="bg-[#2C1810] text-[#FFD700] p-2 rounded-lg border border-[#5D4037] hover:bg-[#3E2723] hover:border-[#FFD700] transition-all shadow-lg active:scale-95"
                            title="Change Theme"
                        >
                            <Palette className="w-4 h-4" />
                        </button>

                        {showThemeMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-[998]"
                                    onClick={() => setShowThemeMenu(false)}
                                />
                                <div className="absolute top-full right-0 mt-2 bg-[#1A0B08] border-2 border-[#FFD700] rounded-lg shadow-2xl overflow-hidden z-[999] min-w-[150px]">
                                    <button
                                        onClick={() => { setTheme('retro'); setShowThemeMenu(false); }}
                                        className={cn(
                                            "w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest transition-colors border-b border-[#5D4037]",
                                            theme === 'retro' ? "bg-[#FFD700] text-[#2C1810]" : "text-[#FFF8E7] hover:bg-[#2C1810]"
                                        )}
                                    >
                                        🎮 Retro
                                    </button>
                                    <button
                                        onClick={() => { setTheme('cyber'); setShowThemeMenu(false); }}
                                        className={cn(
                                            "w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest transition-colors border-b border-[#5D4037]",
                                            theme === 'cyber' ? "bg-[#FFD700] text-[#2C1810]" : "text-[#FFF8E7] hover:bg-[#2C1810]"
                                        )}
                                    >
                                        ⚡ Cyber
                                    </button>
                                    <button
                                        onClick={() => { setTheme('minimal'); setShowThemeMenu(false); }}
                                        className={cn(
                                            "w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest transition-colors",
                                            theme === 'minimal' ? "bg-[#FFD700] text-[#2C1810]" : "text-[#FFF8E7] hover:bg-[#2C1810]"
                                        )}
                                    >
                                        ✨ Minimal
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
