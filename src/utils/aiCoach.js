// AI-powered savings coach with behavioral analysis
export function analyzeSavingBehavior(transactions, goals) {
    const insights = [];

    // 1. Consistency Analysis
    const savingsFrequency = calculateSavingsFrequency(transactions);
    if (savingsFrequency.coefficient < 0.5) {
        insights.push({
            type: 'consistency',
            priority: 'high',
            title: 'Irregular Savings Pattern',
            message: 'Your savings are inconsistent. Try setting up automatic transfers.',
            action: 'Set a recurring save date',
            icon: '📅'
        });
    }

    // 2. Amount Optimization
    const avgSave = transactions.reduce((sum, tx) => sum + tx.amount, 0) / transactions.length;
    const recommendedSave = calculateOptimalSaveAmount(transactions, goals);

    if (recommendedSave > avgSave * 1.2) {
        insights.push({
            type: 'amount',
            priority: 'medium',
            title: 'You Can Save More!',
            message: `Based on your patterns, you could save ₹${Math.round(recommendedSave)} per transaction.`,
            action: 'Increase save amount',
            icon: '💪'
        });
    }

    // 3. Goal Velocity
    goals.forEach(goal => {
        const velocity = calculateGoalVelocity(goal, transactions);
        if (velocity.daysToCompletion > goal.targetDays * 1.3) {
            insights.push({
                type: 'velocity',
                priority: 'high',
                title: `"${goal.name}" is Behind Schedule`,
                message: `At current pace, you'll finish ${velocity.daysLate} days late.`,
                action: 'Increase contribution',
                icon: '⚠️'
            });
        }
    });

    // 4. Streak Encouragement
    const currentStreak = calculateCurrentStreak(transactions);
    if (currentStreak >= 7) {
        insights.push({
            type: 'positive',
            priority: 'low',
            title: `${currentStreak}-Day Streak! 🔥`,
            message: 'You\'re on fire! Keep up the amazing consistency.',
            action: null,
            icon: '🎉'
        });
    }

    // 5. Best Day Analysis
    const bestDay = findBestSavingDay(transactions);
    if (bestDay.confidence > 0.6) {
        insights.push({
            type: 'pattern',
            priority: 'medium',
            title: `${bestDay.dayName} is Your Power Day`,
            message: `You save ${bestDay.percentage}% more on ${bestDay.dayName}s!`,
            action: 'Schedule more saves on this day',
            icon: '⭐'
        });
    }

    return insights.sort((a, b) => {
        const priority = { high: 3, medium: 2, low: 1 };
        return priority[b.priority] - priority[a.priority];
    });
}

function calculateSavingsFrequency(transactions) {
    if (transactions.length < 3) return { coefficient: 1 };

    const intervals = [];
    for (let i = 1; i < transactions.length; i++) {
        const daysBetween = Math.abs(
            (new Date(transactions[i].date) - new Date(transactions[i - 1].date)) / (1000 * 60 * 60 * 24)
        );
        intervals.push(daysBetween);
    }

    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    // Coefficient of variation (lower = more consistent)
    return { coefficient: stdDev / mean, mean };
}

function calculateOptimalSaveAmount(transactions, goals) {
    const activeGoal = goals.find(g => g.isActive);
    if (!activeGoal) return 0;

    const remaining = activeGoal.targetAmount - activeGoal.saved;
    const daysLeft = Math.max(1, Math.floor((new Date(activeGoal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)));
    const avgFrequency = calculateSavingsFrequency(transactions).mean || 7;

    return remaining / (daysLeft / avgFrequency);
}

function calculateGoalVelocity(goal, transactions) {
    const goalTransactions = transactions.filter(tx => tx.goalId === goal.id);
    if (goalTransactions.length < 2) return { daysToCompletion: Infinity, daysLate: 0 };

    const daysSinceStart = Math.abs(
        (new Date() - new Date(goalTransactions[goalTransactions.length - 1].date)) / (1000 * 60 * 60 * 24)
    );
    const saved = goalTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const dailyRate = saved / daysSinceStart;

    const remaining = goal.targetAmount - saved;
    const daysToCompletion = remaining / dailyRate;
    const targetDays = Math.abs((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));

    return {
        daysToCompletion,
        daysLate: Math.max(0, daysToCompletion - targetDays),
        dailyRate
    };
}

function calculateCurrentStreak(transactions) {
    if (transactions.length === 0) return 0;

    const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = new Date(today);

    for (const tx of sorted) {
        const txDate = new Date(tx.date);
        txDate.setHours(0, 0, 0, 0);

        const diff = Math.floor((currentDate - txDate) / (1000 * 60 * 60 * 24));

        if (diff === 0) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (diff > 1) {
            break;
        }
    }

    return streak;
}

function findBestSavingDay(transactions) {
    const dayTotals = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const dayCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    transactions.forEach(tx => {
        const day = new Date(tx.date).getDay();
        dayTotals[day] += tx.amount;
        dayCounts[day]++;
    });

    const dayAverages = Object.keys(dayTotals).map(day => ({
        day: parseInt(day),
        avg: dayCounts[day] > 0 ? dayTotals[day] / dayCounts[day] : 0,
        count: dayCounts[day]
    }));

    const best = dayAverages.reduce((max, curr) => curr.avg > max.avg ? curr : max);
    const overallAvg = transactions.reduce((sum, tx) => sum + tx.amount, 0) / transactions.length;

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return {
        dayName: dayNames[best.day],
        percentage: Math.round(((best.avg - overallAvg) / overallAvg) * 100),
        confidence: best.count / transactions.length
    };
}
