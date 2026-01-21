import { createContext, useContext, useState, useEffect } from 'react';
import { db, STORES_CONSTANTS } from '../utils/db';
import { useToast } from './ToastContext';
import { Trophy, Target, TrendingUp, Star, Zap, Award } from 'lucide-react';
import { CHALLENGE_ACHIEVEMENTS } from '../utils/challenges';
import { soundManager } from '../utils/SoundManager';

const PiggyContext = createContext();

export const ACHIEVEMENT_DEFINITIONS = [
    {
        id: 'beginners_luck',
        title: "Beginner's Luck",
        description: "Create your first savings goal.",
        icon: Star,
        color: "text-yellow-400"
    },
    {
        id: 'first_drop',
        title: "First Drop",
        description: "Save your first ticket.",
        icon: Zap,
        color: "text-blue-400"
    },
    {
        id: 'high_five',
        title: "High Five",
        description: "Save 5 tickets total.",
        icon: TrendingUp,
        color: "text-green-400"
    },
    {
        id: 'on_a_roll',
        title: "On A Roll",
        description: "Save 10 tickets total.",
        icon: TrendingUp,
        color: "text-purple-400"
    },
    {
        id: 'big_spender',
        title: "Big Spender",
        description: "Save a single ticket worth over ₹1000.",
        icon: Award,
        color: "text-orange-400"
    },
    {
        id: 'halfway_hero',
        title: "Halfway Hero",
        description: "Reach 50% completion on a goal.",
        icon: Target,
        color: "text-indigo-400"
    },
    {
        id: 'goal_crusher',
        title: "Goal Crusher",
        description: "Complete a savings goal (100%).",
        icon: Trophy,
        color: "text-amber-500"
    },
    {
        id: 'piggy_master',
        title: "Piggy Master",
        description: "Complete 3 savings goals.",
        icon: Trophy,
        color: "text-red-500"
    },
    {
        id: 'week_long',
        title: "Week Long",
        description: "Maintain a 7-day savings streak.",
        icon: Zap,
        color: "text-orange-500"
    },
    {
        id: 'month_strong',
        title: "Month Strong",
        description: "Maintain a 30-day savings streak.",
        icon: Zap,
        color: "text-red-600"
    },
    {
        id: 'century_club',
        title: "Century Club",
        description: "Maintain a 100-day savings streak!",
        icon: Trophy,
        color: "text-purple-600"
    }
];

// Merge with challenge achievements
export const ALL_ACHIEVEMENTS = [...ACHIEVEMENT_DEFINITIONS, ...CHALLENGE_ACHIEVEMENTS];

export function usePiggy() {
    return useContext(PiggyContext);
}

export function PiggyProvider({ children }) {
    // State
    const [goals, setGoals] = useState([]);
    const [activeGoalId, setActiveGoalId] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [defaultAccountId, setDefaultAccountId] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [unlockedAchievements, setUnlockedAchievements] = useState([]);
    const [savingsStreak, setSavingsStreak] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [celebratingMilestone, setCelebratingMilestone] = useState(null); // Active milestone celebration
    const [triggeredMilestones, setTriggeredMilestones] = useState({}); // Track which milestones have been shown per goal
    const [challenges, setChallenges] = useState([]); // Active and completed challenges
    const [piggyMood, setPiggyMood] = useState('neutral'); // neutral, happy, excited, sad
    const [isMuted, setIsMuted] = useState(soundManager.isMuted);

    const { addToast } = useToast();

    // Derived State: Active Goal & Plan
    const activeGoal = goals.find(g => g.id === activeGoalId) || null;
    const savingsPlan = activeGoal ? activeGoal.savingsPlan : [];

    // Initialization & Migration
    useEffect(() => {
        const init = async () => {
            try {
                // Load Data from IDB
                const dbGoals = await db.getAll(STORES_CONSTANTS.GOALS);
                const dbAccounts = await db.getAll(STORES_CONSTANTS.ACCOUNTS);
                const dbTransactions = await db.getAll(STORES_CONSTANTS.TRANSACTIONS);
                const dbAchievements = await db.getAll(STORES_CONSTANTS.ACHIEVEMENTS);
                const activeId = await db.get(STORES_CONSTANTS.META, 'activeGoalId');
                const dbTriggeredMilestones = await db.get(STORES_CONSTANTS.META, 'triggeredMilestones') || {};
                const dbChallenges = await db.getAll(STORES_CONSTANTS.CHALLENGES);

                // HEALER: Check for duplicate Bit IDs in loaded goals
                const healedGoals = dbGoals.map(g => {
                    const ids = new Set();
                    let hasDupes = false;
                    const cleanPlan = g.savingsPlan.map(bit => {
                        if (ids.has(bit.id)) {
                            hasDupes = true;
                            return { ...bit, id: crypto.randomUUID() }; // Regenerate ID
                        }
                        ids.add(bit.id);
                        return bit;
                    });

                    if (hasDupes) {
                        console.log(`Healed goal ${g.name}: Fixed duplicate IDs`);
                        return { ...g, savingsPlan: cleanPlan };
                    }
                    return g;
                });

                if (JSON.stringify(healedGoals) !== JSON.stringify(dbGoals)) {
                    await Promise.all(healedGoals.map(g => db.set(STORES_CONSTANTS.GOALS, g)));
                    setGoals(healedGoals);
                } else {
                    setGoals(dbGoals);
                }

                setAccounts(dbAccounts);
                setTransactions(dbTransactions);
                setUnlockedAchievements(dbAchievements.map(a => a.id));
                setActiveGoalId(activeId || (dbGoals.length > 0 ? dbGoals[0].id : null));
                setTriggeredMilestones(dbTriggeredMilestones);
                setChallenges(dbChallenges);

                // Load default account
                const dbDefaultAccount = await db.get(STORES_CONSTANTS.META, 'defaultAccountId');
                setDefaultAccountId(dbDefaultAccount);
            } catch (error) {
                console.error("Failed to initialize DB:", error);
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, []);

    // Update streak when transactions change
    useEffect(() => {
        setSavingsStreak(calculateStreak());
    }, [transactions]);

    // Helper to persist Goal updates efficiently
    const saveGoal = async (updatedGoal) => {
        setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
        await db.set(STORES_CONSTANTS.GOALS, updatedGoal);
    };

    // Calculate savings streak from all transactions
    const calculateStreak = () => {
        if (transactions.length === 0) return 0;

        // Sort transactions by date (most recent first)
        const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastTx = new Date(sorted[0].date);
        lastTx.setHours(0, 0, 0, 0);

        // Check if streak is broken (no transaction today or yesterday)
        const daysSinceLastTx = Math.floor((today - lastTx) / (1000 * 60 * 60 * 24));
        if (daysSinceLastTx > 1) return 0;

        // Count consecutive days
        let streak = 0;
        let currentDate = new Date(lastTx);

        for (const tx of sorted) {
            const txDate = new Date(tx.date);
            txDate.setHours(0, 0, 0, 0);

            const diff = Math.floor((currentDate - txDate) / (1000 * 60 * 60 * 24));

            if (diff === 0) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (diff === 1) {
                continue; // Skip to next transaction
            } else {
                break; // Streak broken
            }
        }

        return streak;
    };

    // Achievement Check Logic
    const checkAchievements = async (triggerType, data) => {
        const newUnlocks = [];
        const unlockedSet = new Set(unlockedAchievements);

        const unlock = async (id) => {
            if (!unlockedSet.has(id)) {
                const achievement = ACHIEVEMENT_DEFINITIONS.find(a => a.id === id);
                if (achievement) {
                    const record = { id, unlockedAt: new Date().toISOString() };
                    await db.set(STORES_CONSTANTS.ACHIEVEMENTS, record);
                    setUnlockedAchievements(prev => [...prev, id]);
                    setUnlockedAchievements(prev => [...prev, id]);
                    unlockedSet.add(id);
                    addToast(`🏆 Unlocked: ${achievement.title}!`, 'success');
                    soundManager.playSuccess();
                }
            }
        };

        if (triggerType === 'GOAL_CREATED') {
            await unlock('beginners_luck');
        }

        if (triggerType === 'PAYMENT_MADE') {
            const { amount, goal } = data;

            await unlock('first_drop');

            // Recalculate total transactions across all goals (optimistic updated state)
            // Note: transactions state might not be updated yet if called immediately, so we use current transactions + 1
            const totalTx = transactions.length + 1;

            if (totalTx >= 5) await unlock('high_five');
            if (totalTx >= 10) await unlock('on_a_roll');
            if (amount > 1000) await unlock('big_spender');

            // Streak Checks 
            const newStreak = calculateStreak() + 1; // +1 for optimistic current transaction
            if (newStreak >= 7) await unlock('week_long');
            if (newStreak >= 30) await unlock('month_strong');
            if (newStreak >= 100) await unlock('century_club');

            // Goal Progress Checks
            const totalSaved = goal.savingsPlan
                .filter(bit => bit.status === 'paid' || bit.id === data.bitId) // Include current bit
                .reduce((sum, bit) => sum + bit.amount, 0);

            const progress = (totalSaved / goal.targetAmount) * 100;

            if (progress >= 50) await unlock('halfway_hero');
            if (progress >= 100) {
                await unlock('goal_crusher');

                // Check if 3 goals are completed
                const completedGoals = goals.filter(g => {
                    const saved = g.savingsPlan
                        .filter(b => b.status === 'paid')
                        .reduce((s, b) => s + b.amount, 0);
                    return saved >= g.targetAmount;
                }).length;

                // If this is the 3rd goal (current goal becomes complete)
                if (completedGoals + 1 >= 3) await unlock('piggy_master');
            }
        }
    };

    // Actions
    const startEditing = () => setIsEditing(true);
    const cancelEditing = () => setIsEditing(false);

    const createGoal = async (name, amount, slots, frequency, durationValue, durationUnit, category = 'other') => {
        // Ensure strictly unique ID for Goal
        const newId = Date.now() + Math.floor(Math.random() * 1000);
        const plan = generatePlanLogic(amount, slots, frequency);

        const newGoal = {
            id: newId,
            name: name || `Goal ${goals.length + 1}`,
            targetAmount: parseFloat(amount),
            totalSlots: parseInt(slots),
            frequency: frequency,
            durationValue: durationValue,
            durationUnit: durationUnit,
            category: category,
            createdAt: new Date().toISOString(),
            status: 'active',
            savingsPlan: plan
        };

        const updatedGoals = [...goals, newGoal];
        setGoals(updatedGoals);
        setActiveGoalId(newId);
        setIsEditing(false);

        await db.set(STORES_CONSTANTS.GOALS, newGoal);
        await db.set(STORES_CONSTANTS.META, newId, 'activeGoalId');

        // Check Achievements
        checkAchievements('GOAL_CREATED');

        return newId;
    };

    // Extracted logic for plan generation to be reused
    const generatePlanLogic = (amount, slots, frequency) => {
        const dayMs = 86400000;
        let interval = dayMs;
        if (frequency === 'weekly') interval = dayMs * 7;
        if (frequency === 'monthly') interval = dayMs * 30;
        if (frequency === 'yearly') interval = dayMs * 365;

        let minAmount = 50;
        const avgSlotAmount = amount / slots;
        let chunks = [50, 100, 200, 500];

        if (avgSlotAmount > 50000) { minAmount = 5000; chunks = [5000, 10000, 20000, 50000]; }
        else if (avgSlotAmount > 5000) { minAmount = 500; chunks = [500, 1000, 2000, 5000]; }
        else if (avgSlotAmount > 500) { minAmount = 100; chunks = [100, 200, 500, 1000]; }

        const plan = [];
        if (amount < minAmount * slots) {
            const bitAmount = Math.floor(amount / slots);
            let rem = amount - (bitAmount * slots);
            for (let i = 0; i < slots; i++) {
                plan.push({
                    id: crypto.randomUUID(),
                    index: i + 1,
                    amount: i < rem ? bitAmount + 1 : bitAmount,
                    status: 'pending',
                    dueDate: new Date(Date.now() + i * interval).toISOString()
                });
            }
            return plan;
        }

        const rawPlan = new Array(parseInt(slots)).fill(minAmount);
        let remaining = amount - (minAmount * slots);
        while (remaining >= minAmount) {
            const slotIdx = Math.floor(Math.random() * slots);
            let chunk = chunks[0];
            const r = Math.random();
            if (remaining >= chunks[3] && r > 0.9) chunk = chunks[3];
            else if (remaining >= chunks[2] && r > 0.7) chunk = chunks[2];
            else if (remaining >= chunks[1] && r > 0.4) chunk = chunks[1];

            rawPlan[slotIdx] += chunk;
            remaining -= chunk;
        }
        if (remaining > 0) rawPlan[Math.floor(Math.random() * slots)] += remaining;

        for (let i = 0; i < slots; i++) {
            plan.push({
                id: crypto.randomUUID(),
                index: i + 1,
                amount: rawPlan[i],
                status: 'pending',
                dueDate: new Date(Date.now() + i * interval).toISOString()
            });
        }
        // Shuffle
        for (let i = plan.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [plan[i], plan[j]] = [plan[j], plan[i]];
        }
        return plan;
    };

    const updateGoal = async (updatedGoalData) => {
        if (!activeGoal) return;

        // If amount/slots changed, we need to regenerate the plan.
        const shouldRegenerate =
            parseFloat(updatedGoalData.amount) !== parseFloat(activeGoal.targetAmount) ||
            parseInt(updatedGoalData.slots) !== parseInt(activeGoal.totalSlots) ||
            updatedGoalData.frequency !== activeGoal.frequency;

        let newSavingsPlan = activeGoal.savingsPlan;
        if (shouldRegenerate) {
            newSavingsPlan = generatePlanLogic(updatedGoalData.amount, updatedGoalData.slots, updatedGoalData.frequency);
        }

        const updatedGoal = {
            ...activeGoal,
            name: updatedGoalData.name || activeGoal.name,
            targetAmount: parseFloat(updatedGoalData.amount),
            totalSlots: parseInt(updatedGoalData.slots),
            frequency: updatedGoalData.frequency,
            durationValue: updatedGoalData.durationValue,
            durationUnit: updatedGoalData.durationUnit,
            savingsPlan: newSavingsPlan
        };

        // Update In-Place
        await saveGoal(updatedGoal);
        setIsEditing(false);
    };

    const switchGoal = async (goalId) => {
        setActiveGoalId(goalId);
        await db.set(STORES_CONSTANTS.META, goalId, 'activeGoalId');
    };

    const addAccount = async (upiId, name, isDefault = false) => {
        const newAccount = { id: Date.now(), upiId, name };
        setAccounts(prev => [...prev, newAccount]);
        await db.set(STORES_CONSTANTS.ACCOUNTS, newAccount);

        if (isDefault || accounts.length === 0) {
            setDefaultAccountId(newAccount.id);
            await db.set(STORES_CONSTANTS.META, newAccount.id, 'defaultAccountId');
        }
    };

    const deleteAccount = async (accountId) => {
        setAccounts(prev => prev.filter(a => a.id !== accountId));
        await db.delete(STORES_CONSTANTS.ACCOUNTS, accountId);
        if (defaultAccountId === accountId) {
            setDefaultAccountId(null);
            await db.delete(STORES_CONSTANTS.META, 'defaultAccountId');
        }
    };

    const setGlobalDefaultAccount = async (accountId) => {
        setDefaultAccountId(accountId);
        await db.set(STORES_CONSTANTS.META, accountId, 'defaultAccountId');
    };

    const makePayment = async (bitId, accountId) => {
        if (!activeGoal) return;

        const updatedPlan = savingsPlan.map(bit =>
            bit.id === bitId ? { ...bit, status: 'paid', paidAt: new Date().toISOString(), paidBy: accountId } : bit
        );

        const updatedGoal = { ...activeGoal, savingsPlan: updatedPlan };
        saveGoal(updatedGoal);

        // Trigger Happy Mood
        setPiggyMood('happy');
        soundManager.playCoin();
        setTimeout(() => setPiggyMood('neutral'), 3000);

        const bit = savingsPlan.find(b => b.id === bitId);
        if (bit) {
            const newTx = {
                id: Date.now(),
                amount: bit.amount,
                type: 'debit',
                accountId: accountId,
                description: `Saved ₹${bit.amount} for ${activeGoal.name}`,
                date: new Date().toISOString()
            };
            setTransactions(prev => [...prev, newTx]);
            await db.set(STORES_CONSTANTS.TRANSACTIONS, newTx);

            // Check for Milestone Celebrations
            const totalSaved = updatedPlan
                .filter(b => b.status === 'paid')
                .reduce((sum, b) => sum + b.amount, 0);
            const progress = (totalSaved / activeGoal.targetAmount) * 100;

            // Check if we've hit a milestone (25%, 50%, 75%, 100%)
            const milestones = [25, 50, 75, 100];
            const hitMilestone = milestones.find(m => {
                const goalMilestones = triggeredMilestones[activeGoal.id] || [];
                return progress >= m && !goalMilestones.includes(m);
            });

            if (hitMilestone) {
                // Mark this milestone as triggered for this goal
                const updatedTriggered = {
                    ...triggeredMilestones,
                    [activeGoal.id]: [...(triggeredMilestones[activeGoal.id] || []), hitMilestone]
                };
                setTriggeredMilestones(updatedTriggered);
                await db.set(STORES_CONSTANTS.META, updatedTriggered, 'triggeredMilestones');

                // Show celebration modal
                setCelebratingMilestone({
                    milestone: hitMilestone,
                    goalName: activeGoal.name,
                    currentAmount: totalSaved,
                    targetAmount: activeGoal.targetAmount
                });
                soundManager.playMilestone();
                setPiggyMood('excited');
            }

            // Check Achievements
            checkAchievements('PAYMENT_MADE', { amount: bit.amount, goal: updatedGoal, bitId });
        }
    };

    const deleteGoal = async () => {
        if (!activeGoalId) return;
        // Delete current goal
        const remainingGoals = goals.filter(g => g.id !== activeGoalId);
        await db.delete(STORES_CONSTANTS.GOALS, activeGoalId);

        // Clean up triggered milestones for this goal
        const updatedTriggered = { ...triggeredMilestones };
        delete updatedTriggered[activeGoalId];
        setTriggeredMilestones(updatedTriggered);
        await db.set(STORES_CONSTANTS.META, updatedTriggered, 'triggeredMilestones');

        setGoals(remainingGoals);
        if (remainingGoals.length > 0) {
            switchGoal(remainingGoals[0].id);
        } else {
            setActiveGoalId(null);
            await db.delete(STORES_CONSTANTS.META, 'activeGoalId');
        }
    };

    const closeMilestone = () => {
        setCelebratingMilestone(null);
    };

    const exportAllData = async () => {
        try {
            // Collect all data from IndexedDB
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                goals: goals,
                accounts: accounts,
                transactions: transactions,
                achievements: unlockedAchievements.map(id => {
                    const def = ALL_ACHIEVEMENTS.find(a => a.id === id);
                    return {
                        id,
                        title: def?.title || 'Unknown',
                        unlockedAt: new Date().toISOString()
                    };
                }),
                triggeredMilestones: triggeredMilestones,
                savingsStreak: savingsStreak,
                challenges: challenges
            };

            return exportData;
        } catch (error) {
            console.error('Export failed:', error);
            throw error;
        }
    };

    // Challenge Functions
    const createChallenge = async (template) => {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + template.durationDays);

        const newChallenge = {
            id: Date.now(),
            type: template.type,
            title: template.title,
            description: template.description,
            targetAmount: template.targetAmount || null,
            targetCount: template.targetCount || null,
            currentAmount: 0,
            currentCount: 0,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            status: 'active',
            reward: template.reward,
            icon: template.icon
        };

        setChallenges(prev => [...prev, newChallenge]);
        await db.set(STORES_CONSTANTS.CHALLENGES, newChallenge);
        addToast(`🎯 Challenge Started: ${newChallenge.title}!`, 'success');
        return newChallenge.id;
    };

    const updateChallengeProgress = async (challengeId, amount = 0, incrementCount = false) => {
        const challenge = challenges.find(c => c.id === challengeId);
        if (!challenge || challenge.status !== 'active') return;

        const updatedChallenge = {
            ...challenge,
            currentAmount: challenge.currentAmount + amount,
            currentCount: incrementCount ? challenge.currentCount + 1 : challenge.currentCount
        };

        // Check if challenge is completed
        const isCompleted =
            (challenge.targetAmount && updatedChallenge.currentAmount >= challenge.targetAmount) ||
            (challenge.targetCount && updatedChallenge.currentCount >= challenge.targetCount);

        if (isCompleted) {
            updatedChallenge.status = 'completed';
            updatedChallenge.completedAt = new Date().toISOString();

            // Unlock reward achievement
            if (challenge.reward) {
                const achievement = ALL_ACHIEVEMENTS.find(a => a.id === challenge.reward);
                if (achievement && !unlockedAchievements.includes(challenge.reward)) {
                    const record = { id: challenge.reward, unlockedAt: new Date().toISOString() };
                    await db.set(STORES_CONSTANTS.ACHIEVEMENTS, record);
                    setUnlockedAchievements(prev => [...prev, challenge.reward]);
                    addToast(`🏆 Unlocked: ${achievement.title}!`, 'success');
                }
            }

            addToast(`🎉 Challenge Completed: ${challenge.title}!`, 'success');

            // Check for challenge master achievement
            const completedChallenges = challenges.filter(c => c.status === 'completed').length + 1;
            if (completedChallenges === 1) {
                await checkAchievements('CHALLENGE_COMPLETED', { isFirst: true });
            }
            if (completedChallenges >= 5) {
                await checkAchievements('CHALLENGE_COMPLETED', { isMaster: true });
            }
        }

        setChallenges(prev => prev.map(c => c.id === challengeId ? updatedChallenge : c));
        await db.set(STORES_CONSTANTS.CHALLENGES, updatedChallenge);
    };

    // Update challenges when transactions are made
    useEffect(() => {
        const updateActiveChallenges = async () => {
            if (transactions.length === 0) return;

            const lastTx = transactions[transactions.length - 1];
            if (!lastTx) return;

            const activeChallenges = challenges.filter(c => c.status === 'active');

            for (const challenge of activeChallenges) {
                // Check if transaction is within challenge timeframe
                const txDate = new Date(lastTx.date);
                const startDate = new Date(challenge.startDate);
                const endDate = new Date(challenge.endDate);

                if (txDate >= startDate && txDate <= endDate) {
                    await updateChallengeProgress(challenge.id, lastTx.amount, true);
                }
            }
        };

        updateActiveChallenges();
    }, [transactions.length]);

    // Check for expired challenges
    useEffect(() => {
        const checkExpiredChallenges = async () => {
            const now = new Date();
            const expiredChallenges = challenges.filter(c => {
                if (c.status !== 'active') return false;
                const endDate = new Date(c.endDate);
                return now > endDate;
            });

            for (const challenge of expiredChallenges) {
                const updatedChallenge = { ...challenge, status: 'failed' };
                setChallenges(prev => prev.map(c => c.id === challenge.id ? updatedChallenge : c));
                await db.set(STORES_CONSTANTS.CHALLENGES, updatedChallenge);
            }
        };

        const interval = setInterval(checkExpiredChallenges, 60000); // Check every minute
        checkExpiredChallenges(); // Initial check

        return () => clearInterval(interval);
    }, [challenges]);

    const toggleMute = () => {
        const newState = soundManager.toggleMute();
        setIsMuted(newState);
    };

    const value = {
        goals,
        goal: activeGoal, // Expose as 'goal' for backward compatibility with components
        savingsPlan,
        accounts,
        transactions,
        unlockedAchievements,
        savingsStreak,
        isLoading,
        createGoal,
        updateGoal,
        switchGoal,
        addAccount,
        deleteAccount,
        defaultAccountId,
        setGlobalDefaultAccount,
        makePayment,
        deleteGoal, // Renamed from resetGoal
        isEditing,
        startEditing,
        cancelEditing,
        celebratingMilestone,
        closeMilestone,
        exportAllData,
        challenges,
        createChallenge,
        piggyMood,
        isMuted,
        toggleMute
    };

    return (
        <PiggyContext.Provider value={value}>
            {children}
        </PiggyContext.Provider>
    );
}
