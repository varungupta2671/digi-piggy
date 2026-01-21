import { Home, Info, Clock, Trophy, Plus, Target } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';

export default function BottomNav() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Trophy, label: 'Trophies', path: '/achievements' },
        { icon: Plus, label: 'Add', path: '/create', primary: true },
        { icon: Target, label: 'Challenges', path: '/challenges' },
        { icon: Info, label: 'About', path: '/about' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 pb-safe z-50 md:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-around px-2 py-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            "flex flex-col items-center gap-1 p-2 transition-all duration-300 relative min-w-[60px]",
                            item.primary ? "-mt-8" : "",
                            isActive(item.path) && !item.primary ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        {item.primary ? (
                            <div className="bg-slate-900 text-white p-3.5 rounded-full shadow-lg shadow-slate-300 hover:scale-110 transition-transform ring-4 ring-white">
                                <item.icon className="w-6 h-6" />
                            </div>
                        ) : (
                            <div className="relative">
                                <item.icon className={cn("w-6 h-6 transition-all", isActive(item.path) ? "stroke-[2.5px]" : "stroke-2")} />
                                {isActive(item.path) && (
                                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-900 rounded-full"></span>
                                )}
                            </div>
                        )}

                        {!item.primary && (
                            <span className={cn(
                                "text-[10px] font-medium transition-colors",
                                isActive(item.path) ? "text-slate-900" : "text-slate-400"
                            )}>{item.label}</span>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
