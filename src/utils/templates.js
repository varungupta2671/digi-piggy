// Popular goal templates for quick setup
export const GOAL_TEMPLATES = [
    {
        id: 'iphone',
        name: 'iPhone 16 Pro',
        icon: '📱',
        category: 'gadget',
        targetAmount: 150000,
        durationValue: 12,
        durationUnit: 'months',
        frequency: 'monthly',
        description: 'Save for the latest iPhone'
    },
    {
        id: 'laptop',
        name: 'MacBook Air',
        icon: '💻',
        category: 'gadget',
        targetAmount: 100000,
        durationValue: 8,
        durationUnit: 'months',
        frequency: 'monthly',
        description: 'Get your dream laptop'
    },
    {
        id: 'vacation_goa',
        name: 'Goa Vacation',
        icon: '🏖️',
        category: 'travel',
        targetAmount: 50000,
        durationValue: 6,
        durationUnit: 'months',
        frequency: 'monthly',
        description: 'Dream beach getaway'
    },
    {
        id: 'vacation_international',
        name: 'International Trip',
        icon: '✈️',
        category: 'travel',
        targetAmount: 200000,
        durationValue: 12,
        durationUnit: 'months',
        frequency: 'monthly',
        description: 'Explore the world'
    },
    {
        id: 'emergency_fund',
        name: 'Emergency Fund',
        icon: '🚨',
        category: 'emergency',
        targetAmount: 100000,
        durationValue: 10,
        durationUnit: 'months',
        frequency: 'monthly',
        description: '6 months expenses safety net'
    },
    {
        id: 'car_down_payment',
        name: 'Car Down Payment',
        icon: '🚗',
        category: 'vehicle',
        targetAmount: 300000,
        durationValue: 18,
        durationUnit: 'months',
        frequency: 'monthly',
        description: 'Save for your dream car'
    },
    {
        id: 'wedding',
        name: 'Wedding Fund',
        icon: '💍',
        category: 'wedding',
        targetAmount: 500000,
        durationValue: 24,
        durationUnit: 'months',
        frequency: 'monthly',
        description: 'Plan your special day'
    },
    {
        id: 'home_renovation',
        name: 'Home Makeover',
        icon: '🏠',
        category: 'home',
        targetAmount: 200000,
        durationValue: 12,
        durationUnit: 'months',
        frequency: 'monthly',
        description: 'Renovate your space'
    },
    {
        id: 'education',
        name: 'Course/Certification',
        icon: '📚',
        category: 'education',
        targetAmount: 50000,
        durationValue: 6,
        durationUnit: 'months',
        frequency: 'monthly',
        description: 'Invest in your skills'
    },
    {
        id: 'gaming_console',
        name: 'Gaming Console',
        icon: '🎮',
        category: 'gadget',
        targetAmount: 50000,
        durationValue: 5,
        durationUnit: 'months',
        frequency: 'monthly',
        description: 'PS5 or Xbox Series X'
    },
    {
        id: 'bike',
        name: 'New Bike',
        icon: '🏍️',
        category: 'vehicle',
        targetAmount: 150000,
        durationValue: 12,
        durationUnit: 'months',
        frequency: 'monthly',
        description: 'Get your dream bike'
    },
    {
        id: 'investment_start',
        name: 'Investment Fund',
        icon: '📈',
        category: 'investment',
        targetAmount: 100000,
        durationValue: 10,
        durationUnit: 'months',
        frequency: 'monthly',
        description: 'Start your investment journey'
    }
];

export const getTemplateById = (id) => {
    return GOAL_TEMPLATES.find(t => t.id === id);
};
