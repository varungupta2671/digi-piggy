// Evolution levels for the Piggy companion
export const EVOLUTION_LEVELS = [
    {
        id: 'baby',
        name: 'Baby Piggy',
        threshold: 0,
        emoji: '🐷',
        gradient: 'from-pink-400 to-rose-500',
        message: 'Your piggy journey begins! Start saving to help me grow!',
        unlockMessage: 'Welcome to DigiPiggy! 🎉'
    },
    {
        id: 'teen',
        name: 'Growing Piggy',
        threshold: 10000,
        emoji: '🐖',
        gradient: 'from-rose-500 to-pink-600',
        message: 'Great progress! Keep feeding me with those savings!',
        unlockMessage: 'Your piggy is growing stronger! 💪'
    },
    {
        id: 'adult',
        name: 'Mature Piggy',
        threshold: 50000,
        emoji: '🐽',
        gradient: 'from-purple-500 to-fuchsia-600',
        message: 'Wow! Look how far we\\'ve come together!',
        unlockMessage: 'Your piggy has matured beautifully! ✨'
    },
    {
        id: 'master',
        name: 'Piggy Master',
        threshold: 100000,
        emoji: '👑',
        gradient: 'from-amber-400 to-yellow-500',
        message: 'You\\'re a savings master! I\\'m so proud!',
        unlockMessage: 'Crown achieved! You\\'re a Piggy Master! 👑'
    },
    {
        id: 'legend',
        name: 'Legendary Piggy',
        threshold: 500000,
        emoji: '✨',
        gradient: 'from-violet-600 via-fuchsia-500 to-pink-500',
        message: 'Legendary status! You\\'ve unlocked the ultimate piggy!',
        unlockMessage: 'LEGENDARY! You\\'ve achieved piggy greatness! 🌟'
    }
];

export function getCurrentEvolutionLevel(totalSaved) {
    // Find the highest level the user has unlocked
    const levels = [...EVOLUTION_LEVELS].reverse();
    return levels.find(level => totalSaved >= level.threshold) || EVOLUTION_LEVELS[0];
}

export function getNext EvolutionLevel(totalSaved) {
    const current = getCurrentEvolutionLevel(totalSaved);
    const currentIndex = EVOLUTION_LEVELS.findIndex(l => l.id === current.id);

    if (currentIndex === EVOLUTION_LEVELS.length - 1) {
        return null; // Max level reached
    }

    return EVOLUTION_LEVELS[currentIndex + 1];
}

export function getEvolutionProgress(totalSaved) {
    const current = getCurrentEvolutionLevel(totalSaved);
    const next = getNextEvolutionLevel(totalSaved);

    if (!next) {
        return 100; // Max level
    }

    const progress = ((totalSaved - current.threshold) / (next.threshold - current.threshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
}
