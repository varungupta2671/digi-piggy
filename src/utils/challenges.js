import { Trophy, Zap, Award } from 'lucide-react';

// Challenge Templates and Definitions
export const CHALLENGE_TYPES = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly'
};

export const CHALLENGE_STATUS = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    FAILED: 'failed'
};

export const CHALLENGE_TEMPLATES = [
    {
        id: 'weekend_warrior',
        type: CHALLENGE_TYPES.WEEKLY,
        title: 'Weekend Warrior',
        description: 'Make 2 deposits this weekend',
        targetCount: 2,
        durationDays: 7,
        reward: 'challenge_starter',
        icon: '⚡'
    },
    {
        id: 'daily_saver',
        type: CHALLENGE_TYPES.DAILY,
        title: 'Daily Saver',
        description: 'Save for 7 consecutive days',
        targetCount: 7,
        durationDays: 7,
        reward: 'speedster',
        icon: '🔥'
    },
    {
        id: 'monthly_goal',
        type: CHALLENGE_TYPES.MONTHLY,
        title: 'Monthly Marathon',
        description: 'Save ₹10,000 this month',
        targetAmount: 10000,
        durationDays: 30,
        reward: 'marathon_runner',
        icon: '🏃'
    },
    {
        id: 'streak_builder',
        type: CHALLENGE_TYPES.WEEKLY,
        title: 'Streak Builder',
        description: 'Build a 14-day savings streak',
        targetCount: 14,
        durationDays: 14,
        reward: 'challenge_master',
        icon: '🎯'
    }
];

// New achievement definitions for challenges
export const CHALLENGE_ACHIEVEMENTS = [
    {
        id: 'challenge_starter',
        title: 'Challenge Starter',
        description: 'Complete your first challenge',
        icon: Award,
        color: 'text-green-400'
    },
    {
        id: 'challenge_master',
        title: 'Challenge Master',
        description: 'Complete 5 challenges',
        icon: Trophy,
        color: 'text-purple-500'
    },
    {
        id: 'speedster',
        title: 'Speedster',
        description: 'Complete a daily challenge',
        icon: Zap,
        color: 'text-yellow-400'
    },
    {
        id: 'marathon_runner',
        title: 'Marathon Runner',
        description: 'Complete a monthly challenge',
        icon: Trophy,
        color: 'text-orange-500'
    }
];
