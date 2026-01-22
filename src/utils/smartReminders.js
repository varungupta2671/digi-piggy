// Smart reminder logic for contextual notifications
import { differenceInDays, format, isAfter, parseISO } from 'date-fns';

export const REMINDER_TYPES = {
    INACTIVITY: 'inactivity',
    DEADLINE: 'deadline',
    PATTERN: 'pattern',
    PAYDAY: 'payday',
    STREAK_RISK: 'streak_risk'
};

// Analyze user saving patterns
export function analyzeSavingPattern(transactions) {
    if (transactions.length < 5) return null;

    // Group by day of week
    const dayFrequency = {};
    transactions.forEach(tx => {
        const day = new Date(tx.date).getDay();
        dayFrequency[day] = (dayFrequency[day] || 0) + 1;
    });

    // Find most common day
    const mostCommonDay = Object.entries(dayFrequency)
        .sort(([, a], [, b]) => b - a)[0];

    if (!mostCommonDay || mostCommonDay[1] < 3) return null;

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return {
        day: parseInt(mostCommonDay[0]),
        dayName: dayNames[mostCommonDay[0]],
        frequency: mostCommonDay[1]
    };
}

// Check if user is inactive
export function checkInactivity(transactions) {
    if (transactions.length === 0) return { isInactive: true, daysSince: Infinity };

    const lastTransaction = transactions[0]; // Assumes sorted by date desc
    const daysSince = differenceInDays(new Date(), new Date(lastTransaction.date));

    return {
        isInactive: daysSince >= 3,
        daysSince
    };
}

// Check approaching deadlines
export function checkDeadlines(goals) {
    const today = new Date();
    const upcomingDeadlines = [];

    goals.forEach(goal => {
        if (!goal.targetDate) return;

        const deadline = parseISO(goal.targetDate);
        const daysUntil = differenceInDays(deadline, today);

        // Alert for deadlines within 7 days
        if (daysUntil > 0 && daysUntil <= 7) {
            const progress = goal.savingsPlan
                ? (goal.savingsPlan.filter(b => b.status === 'paid').length / goal.savingsPlan.length) * 100
                : 0;

            upcomingDeadlines.push({
                goal,
                daysUntil,
                progress,
                isAtRisk: progress < 70 && daysUntil <= 3
            });
        }
    });

    return upcomingDeadlines;
}

// Check if streak is at risk
export function checkStreakRisk(transactions, currentStreak) {
    if (currentStreak === 0) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (transactions.length === 0) return true;

    const lastTx = new Date(transactions[0].date);
    lastTx.setHours(0, 0, 0, 0);

    const daysSince = differenceInDays(today, lastTx);

    // Streak at risk if no transaction today
    return daysSince === 0 && new Date().getHours() >= 18; // After 6 PM
}

// Generate reminder notifications
export function generateReminders(transactions, goals, currentStreak, userPreferences = {}) {
    const reminders = [];

    // 1. Inactivity reminder
    const inactivity = checkInactivity(transactions);
    if (inactivity.isInactive && !userPreferences.disableInactivity) {
        reminders.push({
            type: REMINDER_TYPES.INACTIVITY,
            title: 'Missing your savings streak! 📉',
            message: `It's been ${inactivity.daysSince} days since your last save. Keep the momentum going!`,
            priority: 'medium',
            action: { type: 'navigate', to: '/dashboard' }
        });
    }

    // 2. Pattern-based reminder
    const pattern = analyzeSavingPattern(transactions);
    if (pattern && new Date().getDay() === pattern.day && !userPreferences.disablePattern) {
        const hasTransactionToday = transactions.some(tx => {
            const txDate = new Date(tx.date);
            const today = new Date();
            return txDate.toDateString() === today.toDateString();
        });

        if (!hasTransactionToday) {
            reminders.push({
                type: REMINDER_TYPES.PATTERN,
                title: `It's ${pattern.dayName}! 🗓️`,
                message: `You usually save on ${pattern.dayName}s. Ready to continue the habit?`,
                priority: 'high',
                action: { type: 'quickSave' }
            });
        }
    }

    // 3. Deadline reminders
    const deadlines = checkDeadlines(goals);
    deadlines.forEach(({ goal, daysUntil, progress, isAtRisk }) => {
        if (!userPreferences.disableDeadlines) {
            reminders.push({
                type: REMINDER_TYPES.DEADLINE,
                title: isAtRisk ? `⚠️ ${goal.name} deadline soon!` : `📅 ${goal.name} reminder`,
                message: `${daysUntil} day${daysUntil > 1 ? 's' : ''} left • ${progress.toFixed(0)}% complete`,
                priority: isAtRisk ? 'high' : 'medium',
                action: { type: 'navigate', to: `/goal/${goal.id}` }
            });
        }
    });

    // 4. Streak risk reminder
    if (checkStreakRisk(transactions, currentStreak) && !userPreferences.disableStreak) {
        reminders.push({
            type: REMINDER_TYPES.STREAK_RISK,
            title: `Don't break your ${currentStreak}-day streak! 🔥`,
            message: 'Make a save before midnight to keep your streak alive!',
            priority: 'high',
            action: { type: 'quickSave' }
        });
    }

    return reminders;
}

// Check if enough time has passed since last reminder of this type
export function shouldShowReminder(reminderType, lastShown, cooldownHours = 24) {
    if (!lastShown) return true;

    const hoursSince = (Date.now() - new Date(lastShown).getTime()) / (1000 * 60 * 60);
    return hoursSince >= cooldownHours;
}
