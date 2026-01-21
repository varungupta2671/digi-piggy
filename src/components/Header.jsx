import { Home, Info, Mail, Trophy, PiggyBank, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm/50 backdrop-blur-md bg-white/80">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo and Title */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center border border-emerald-200 group-hover:bg-emerald-200 transition-colors shadow-sm">
                        <PiggyBank className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                            DIGIPIGGY
                        </h1>
                        <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                            Smart Savings
                        </p>
                    </div>
                </Link>

                {/* Navigation - Desktop Only */}
                <nav className="hidden md:flex items-center gap-1">
                    <Link
                        to="/"
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium",
                            isActive('/')
                                ? "bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-500/20"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                    </Link>

                    <Link
                        to="/achievements"
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium",
                            isActive('/achievements')
                                ? "bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-500/20"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <Trophy className="w-4 h-4" />
                        <span>Trophies</span>
                    </Link>

                    <Link
                        to="/about"
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium",
                            isActive('/about')
                                ? "bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-500/20"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
                                ? "bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-500/20"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <Mail className="w-4 h-4" />
                        <span>Contact</span>
                    </Link>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 rounded-full transition-colors ml-2"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </button>
                </nav>
            </div>
        </header>
    );
}
