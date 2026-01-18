import { Home, Info, Mail, Trophy, PlusCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';

export default function BottomNav() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Trophy, label: 'Trophies', path: '/achievements' },
        { icon: PlusCircle, label: 'Add', path: '/create', primary: true },
        { icon: Info, label: 'About', path: '/about' },
        { icon: Mail, label: 'Contact', path: '/contact' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 pb-safe z-50 md:hidden">
            <div className="flex items-center justify-around px-2 py-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            "flex flex-col items-center gap-1 p-2 transition-all duration-300 relative",
                            item.primary ? "-mt-8" : "",
                            isActive(item.path) && !item.primary ? "text-emerald-500 scale-105" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        {item.primary ? (
                            <div className="bg-emerald-500 text-white p-3 rounded-full shadow-lg shadow-emerald-200 hover:scale-105 transition-transform">
                                <item.icon className="w-6 h-6" />
                            </div>
                        ) : (
                            <item.icon className={cn("w-5 h-5", isActive(item.path) && "fill-current")} />
                        )}

                        {!item.primary && (
                            <span className="text-[10px] font-medium">{item.label}</span>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
