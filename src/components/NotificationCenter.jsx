import { Bell, X, CheckCircle, AlertCircle, Target as TargetIcon, TrendingUp, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { cn } from '../utils/cn';

const NOTIFICATION_ICONS = {
    milestone: CheckCircle,
    deadline: Clock,
    celebration: TrendingUp,
    reminder: TargetIcon,
    achievement: CheckCircle,
};

const NOTIFICATION_COLORS = {
    milestone: 'text-emerald-500',
    deadline: 'text-amber-500',
    celebration: 'text-purple-500',
    reminder: 'text-blue-500',
    achievement: 'text-yellow-500',
};

export default function NotificationCenter() {
    const { notifications = [], markNotificationRead, clearAllNotifications } = usePiggy();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleClearAll = () => {
        clearAllNotifications();
        setIsOpen(false);
    };

    const NotificationsList = () => (
        <>
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                {notifications.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No notifications yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {notifications.map(notification => {
                            const Icon = NOTIFICATION_ICONS[notification.type] || AlertCircle;
                            const colorClass = NOTIFICATION_COLORS[notification.type] || 'text-slate-500';

                            return (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer",
                                        !notification.read && "bg-emerald-50 dark:bg-emerald-900/10"
                                    )}
                                    onClick={() => markNotificationRead(notification.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", colorClass)} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 dark:text-white text-sm">
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-2">
                                                {new Date(notification.timestamp).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-2" />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );

    return (
        <div className="relative">
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Desktop Dropdown */}
            {isOpen && !isMobile && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 max-h-[500px] overflow-hidden flex flex-col">
                        <NotificationsList />
                    </div>
                </>
            )}

            {/* Mobile Drawer */}
            {isOpen && isMobile && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Drawer Panel */}
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-slide-in-right">
                        {/* Drawer Header */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Notifications Content */}
                        <div className="flex-1 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    <Bell className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {notifications.map(notification => {
                                        const Icon = NOTIFICATION_ICONS[notification.type] || AlertCircle;
                                        const colorClass = NOTIFICATION_COLORS[notification.type] || 'text-slate-500';

                                        return (
                                            <div
                                                key={notification.id}
                                                className={cn(
                                                    "p-4 active:bg-slate-100 dark:active:bg-slate-800 transition-colors",
                                                    !notification.read && "bg-emerald-50 dark:bg-emerald-900/10"
                                                )}
                                                onClick={() => markNotificationRead(notification.id)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <Icon className={cn("w-6 h-6 mt-0.5 flex-shrink-0", colorClass)} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-slate-400 mt-2">
                                                            {new Date(notification.timestamp).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-2" />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Drawer Footer */}
                        {notifications.length > 0 && (
                            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={handleClearAll}
                                    className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Clear All Notifications
                                </button>
                            </div>
                        )}
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
        </div>
    );
}
