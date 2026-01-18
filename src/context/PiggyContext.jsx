import { createContext, useContext, useState, useEffect } from 'react';
import { db, STORES_CONSTANTS } from '../utils/db';
import { useToast } from './ToastContext';
import { Trophy, Target, TrendingUp, Star, Zap, Award } from 'lucide-react';

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
    }
];

export function usePiggy() {
    return useContext(PiggyContext);
}

export function PiggyProvider({ children }) {
    // State
    const [goals, setGoals] = useState([]);
    const [activeGoalId, setActiveGoalId] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [unlockedAchievements, setUnlockedAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

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
            } catch (error) {
                console.error("Failed to initialize DB:", error);
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, []);

    // Helper to persist Goal updates efficiently
    const saveGoal = async (updatedGoal) => {
        setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
        await db.set(STORES_CONSTANTS.GOALS, updatedGoal);
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
                    unlockedSet.add(id);
                    addToast(`🏆 Unlocked: ${achievement.title}!`, 'success');
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

    const createGoal = async (name, amount, slots, frequency, durationValue, durationUnit) => {
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

    const addAccount = async (upiId, name) => {
        const newAccount = { id: Date.now(), upiId, name };
        setAccounts(prev => [...prev, newAccount]);
        await db.set(STORES_CONSTANTS.ACCOUNTS, newAccount);
    };

    const deleteAccount = async (accountId) => {
        setAccounts(prev => prev.filter(a => a.id !== accountId));
        await db.delete(STORES_CONSTANTS.ACCOUNTS, accountId);
    };

    const makePayment = async (bitId, accountId) => {
        if (!activeGoal) return;

        const updatedPlan = savingsPlan.map(bit =>
            bit.id === bitId ? { ...bit, status: 'paid', paidAt: new Date().toISOString(), paidBy: accountId } : bit
        );

        const updatedGoal = { ...activeGoal, savingsPlan: updatedPlan };
        saveGoal(updatedGoal);

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

            // Check Achievements
            checkAchievements('PAYMENT_MADE', { amount: bit.amount, goal: updatedGoal, bitId });
        }
    };

    const deleteGoal = async () => {
        if (!activeGoalId) return;
        // Delete current goal
        const remainingGoals = goals.filter(g => g.id !== activeGoalId);
        await db.delete(STORES_CONSTANTS.GOALS, activeGoalId);

        setGoals(remainingGoals);
        if (remainingGoals.length > 0) {
            switchGoal(remainingGoals[0].id);
        } else {
            setActiveGoalId(null);
            await db.delete(STORES_CONSTANTS.META, 'activeGoalId');
        }
    };

    const value = {
        goals,
        goal: activeGoal, // Expose as 'goal' for backward compatibility with components
        savingsPlan,
        accounts,
        transactions,
        unlockedAchievements,
        isLoading,
        createGoal,
        updateGoal,
        switchGoal,
        addAccount,
        deleteAccount,
        makePayment,
        deleteGoal, // Renamed from resetGoal
        isEditing,
        startEditing,
        cancelEditing
    };

    return (
        <PiggyContext.Provider value={value}>
            {children}
        </PiggyContext.Provider>
    );
}
