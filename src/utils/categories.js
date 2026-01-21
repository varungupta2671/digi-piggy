// Category definitions with icons and colors
export const GOAL_CATEGORIES = [
    {
        id: 'travel',
        name: 'Travel',
        icon: '✈️',
        color: 'bg-sky-100 text-sky-700 border-sky-200',
        badge: 'bg-sky-500'
    },
    {
        id: 'gadget',
        name: 'Gadgets',
        icon: '📱',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        badge: 'bg-purple-500'
    },
    {
        id: 'education',
        name: 'Education',
        icon: '📚',
        color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        badge: 'bg-indigo-500'
    },
    {
        id: 'emergency',
        name: 'Emergency',
        icon: '🚨',
        color: 'bg-red-100 text-red-700 border-red-200',
        badge: 'bg-red-500'
    },
    {
        id: 'vehicle',
        name: 'Vehicle',
        icon: '🚗',
        color: 'bg-orange-100 text-orange-700 border-orange-200',
        badge: 'bg-orange-500'
    },
    {
        id: 'wedding',
        name: 'Wedding',
        icon: '💍',
        color: 'bg-pink-100 text-pink-700 border-pink-200',
        badge: 'bg-pink-500'
    },
    {
        id: 'home',
        name: 'Home',
        icon: '🏠',
        color: 'bg-green-100 text-green-700 border-green-200',
        badge: 'bg-green-500'
    },
    {
        id: 'investment',
        name: 'Investment',
        icon: '📈',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        badge: 'bg-emerald-500'
    },
    {
        id: 'other',
        name: 'Other',
        icon: '🎯',
        color: 'bg-slate-100 text-slate-700 border-slate-200',
        badge: 'bg-slate-500'
    }
];

export const getCategoryById = (id) => {
    return GOAL_CATEGORIES.find(cat => cat.id === id) || GOAL_CATEGORIES[GOAL_CATEGORIES.length - 1];
};
