import React, { useMemo } from 'react';
import { usePiggy } from '../../context/PiggyContext';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

export default function SavingsForecast() {
    const { goals, transactions } = usePiggy();

    const forecastData = useMemo(() => {
        if (transactions.length < 2) return [];

        // 1. Calculate Average Daily Savings Rate (Velocity) over last 30 days
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        const recentTx = transactions.filter(tx => new Date(tx.date) >= thirtyDaysAgo && tx.type === 'deposit');
        const recentSavings = recentTx.reduce((sum, tx) => sum + tx.amount, 0);
        const days = Math.max(1, (now - thirtyDaysAgo) / (1000 * 60 * 60 * 24));
        const dailyRate = recentSavings / days; // ₹ per day

        if (dailyRate === 0) return [];

        // 2. Current Total Savings
        let currentTotal = goals.reduce((acc, g) => {
            const saved = g.savingsPlan
                .filter(bit => bit.status === 'paid')
                .reduce((sum, bit) => sum + bit.amount, 0);
            return acc + saved;
        }, 0);

        // 3. Total Target
        const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);

        // 4. Project into future
        const points = [];
        let projectedAmount = currentTotal;
        let currentDate = new Date();

        // Add start point
        points.push({
            date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            amount: Math.round(projectedAmount),
            target: totalTarget
        });

        // Generate points until target is reached or max 1 year
        let loops = 0;
        while (projectedAmount < totalTarget && loops < 12) { // Monthly points for 1 year max
            loops++;
            currentDate.setMonth(currentDate.getMonth() + 1); // Jump 1 month

            projectedAmount += dailyRate * 30; // Add monthly savings

            points.push({
                date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                amount: Math.round(projectedAmount),
                target: totalTarget
            });
        }

        return points;
    }, [goals, transactions]);

    if (forecastData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Need more recent transaction history to forecast
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                <Tooltip
                    contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                />
                <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorAmt)"
                    name="Projected Savings"
                />
                <ReferenceLine y={forecastData[0]?.target} label="Total Goal" stroke="#ef4444" strokeDasharray="3 3" />
            </AreaChart>
        </ResponsiveContainer>
    );
}
