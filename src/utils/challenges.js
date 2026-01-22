// Exciting and diverse savings challenges
import { Zap, Trophy, Target, TrendingUp, Calendar, Gift, Star, Flame, Award, Crown } from 'lucide-react';

export const CHALLENGES = [
    {
        id: 'sprint_saver',
        title: '7-Day Sprint',
        description: 'Save every day for 7 consecutive days',
        icon: Zap,
        difficulty: 'easy',
        duration: 7,
        target: 7, // 7 saves
        reward: 100,
        color: 'from-yellow-400 to-orange-500',
        badge: '⚡ Sprint Champion'
    },
    {
        id: 'weekend_warrior',
        title: 'Weekend Warrior',
        description: 'Save ₹500 every weekend for a month',
        icon: Trophy,
        difficulty: 'medium',
        duration: 30,
        target: 2000, // ₹2000 total
        reward: 250,
        color: 'from-blue-400 to-indigo-500',
        badge: '🏆 Weekend Master'
    },
    {
        id: 'savings_streak',
        title: 'Streak King',
        description: 'Maintain a 30-day savings streak',
        icon: Flame,
        difficulty: 'hard',
        duration: 30,
        target: 30,
        reward: 500,
        color: 'from-red-400 to-pink-500',
        badge: '🔥 Streak Legend'
    },
    {
        id: 'thousand_club',
        title: '1K Club',
        description: 'Save ₹1000 in a single week',
        icon: Star,
        difficulty: 'medium',
        duration: 7,
        target: 1000,
        reward: 200,
        color: 'from-purple-400 to-pink-500',
        badge: '⭐ 1K Achiever'
    },
    {
        id: 'daily_discipline',
        title: 'Daily Discipline',
        description: 'Save ₹50 every single day for 14 days',
        icon: Target,
        difficulty: 'medium',
        duration: 14,
        target: 700, // ₹700 total
        reward: 150,
        color: 'from-emerald-400 to-teal-500',
        badge: '🎯 Discipline Master'
    },
    {
        id: 'monthly_marathon',
        title: 'Monthly Marathon',
        description: 'Save ₹5000 in 30 days',
        icon: TrendingUp,
        difficulty: 'hard',
        duration: 30,
        target: 5000,
        reward: 750,
        color: 'from-indigo-400 to-purple-500',
        badge: '🏃 Marathon Champion'
    },
    {
        id: 'payday_boost',
        title: 'Payday Boost',
        description: 'Save ₹1500 within 24 hours of starting',
        icon: Gift,
        difficulty: 'medium',
        duration: 1,
        target: 1500,
        reward: 300,
        color: 'from-rose-400 to-red-500',
        badge: '🎁 Payday Pro'
    },
    {
        id: 'century_challenge',
        title: 'Century Challenge',
        description: 'Complete 100 savings transactions',
        icon: Award,
        difficulty: 'hard',
        duration: 60,
        target: 100,
        reward: 1000,
        color: 'from-amber-400 to-yellow-500',
        badge: '💯 Century Maker'
    },
    {
        id: 'royal_saver',
        title: 'Royal Saver',
        description: 'Save ₹10,000 in 60 days',
        icon: Crown,
        difficulty: 'expert',
        duration: 60,
        target: 10000,
        reward: 1500,
        color: 'from-yellow-500 via-amber-500 to-orange-600',
        badge: '👑 Royalty Status'
    },
    {
        id: 'quick_start',
        title: 'Quick Start',
        description: 'Save 3 times in your first 24 hours',
        icon: Zap,
        difficulty: 'easy',
        duration: 1,
        target: 3,
        reward: 50,
        color: 'from-cyan-400 to-blue-500',
        badge: '⚡ Quick Starter'
    },
    {
        id: 'consistency_king',
        title: 'Consistency King',
        description: 'Save at least once every 3 days for a month',
        icon: Calendar,
        difficulty: 'medium',
        duration: 30,
        target: 10, // minimum 10 saves
        reward: 300,
        color: 'from-green-400 to-emerald-500',
        badge: '📅 Consistency Crown'
    },
    {
        id: 'mega_saver',
        title: 'Mega Saver',
        description: 'Save ₹20,000 in 90 days',
        icon: Trophy,
        difficulty: 'expert',
        duration: 90,
        target: 20000,
        reward: 2500,
        color: 'from-violet-500 via-purple-500 to-fuchsia-600',
        badge: '🏆 Mega Legend'
    }
];

export const DIFFICULTY_COLORS = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    hard: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    expert: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
};

export function getChallengeById(id) {
    return CHALLENGES.find(c => c.id === id);
}

export function getChallengesByDifficulty(difficulty) {
    return CHALLENGES.filter(c => c.difficulty === difficulty);
}

// Calculate challenge progress based on transactions
export function calculateChallengeProgress(challenge, transactions, startDate) {
    const challengeStart = new Date(startDate);
    const challengeEnd = new Date(challengeStart);
    challengeEnd.setDate(challengeEnd.getDate() + challenge.duration);

    const relevantTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate >= challengeStart && txDate <= challengeEnd;
    });

    if (challenge.id === 'sprint_saver' || challenge.id === 'savings_streak') {
        // Count consecutive days with saves
        return relevantTransactions.length;
    } else if (challenge.id === 'century_challenge') {
        // Count total transactions
        return relevantTransactions.length;
    } else if (challenge.id === 'quick_start') {
        // Count saves within 24 hours
        return relevantTransactions.length;
    } else if (challenge.id === 'consistency_king') {
        // Count number of saves
        return relevantTransactions.length;
    } else {
        // Sum up savings amount
        return relevantTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    }
}
