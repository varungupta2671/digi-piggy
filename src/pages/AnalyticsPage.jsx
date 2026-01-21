import React, { useMemo } from 'react';
import { usePiggy } from '../context/PiggyContext';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, BarChart3, ArrowUpRight, DollarSign, Calendar, Activity, Radar, Zap } from 'lucide-react';
import SavingsHeatmap from '../components/analytics/SavingsHeatmap';
import CategoryRadar from '../components/analytics/CategoryRadar';
import SavingsForecast from '../components/analytics/SavingsForecast';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#ef4444', '#f59e0b', '#10b981', '#3b82f6'];

const AnalyticsPage = () => {
    const { goals, transactions } = usePiggy();

    // 1. Savings Trend Data (Balance over time)
    const trendData = useMemo(() => {
        // Sort transactions by date
        const sortedTx = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

        // Create cumulative balance
        let currentBalance = 0;
        const dataPoints = [];

        // Add initial point
        if (sortedTx.length > 0) {
            dataPoints.push({
                date: new Date(sortedTx[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                balance: 0
            });
        }

        sortedTx.forEach(tx => {
            if (tx.type === 'deposit') currentBalance += tx.amount;
            else if (tx.type === 'withdraw') currentBalance -= tx.amount;

            dataPoints.push({
                date: new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                balance: currentBalance
            });
        });

        // If no transactions, show empty state or flat line
        if (dataPoints.length === 0) return [{ date: 'Start', balance: 0 }];

        // Limit points for performance if too many
        if (dataPoints.length > 20) {
            return dataPoints.filter((_, i) => i % Math.ceil(dataPoints.length / 20) === 0);
        }

        return dataPoints;
    }, [transactions]);

    // 2. Goal Distribution Data
    const distributionData = useMemo(() => {
        return goals
            .map(g => {
                const saved = g.savingsPlan
                    .filter(bit => bit.status === 'paid')
                    .reduce((sum, bit) => sum + bit.amount, 0);
                return { name: g.name, value: saved };
            })
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);
    }, [goals]);

    // 3. Monthly Activity (Deposits vs Withdrawals)
    const monthlyData = useMemo(() => {
        const months = {};

        transactions.forEach(tx => {
            const date = new Date(tx.date);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short' });

            if (!months[monthKey]) months[monthKey] = { name: monthKey, deposits: 0, withdrawals: 0 };

            if (tx.type === 'deposit') months[monthKey].deposits += tx.amount;
            else if (tx.type === 'withdraw') months[monthKey].withdrawals += tx.amount;
        });

        // Sort by actual date order (needs logic if spanning years, but simplified for now)
        return Object.values(months).slice(-6); // Last 6 months
    }, [transactions]);

    // Key Metrics
    const totalSaved = goals.reduce((acc, g) => {
        const goalSaved = g.savingsPlan
            .filter(bit => bit.status === 'paid')
            .reduce((sum, bit) => sum + bit.amount, 0);
        return acc + goalSaved;
    }, 0);
    const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
    const progress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
    const avgTransaction = transactions.length > 0
        ? transactions.reduce((acc, tx) => acc + tx.amount, 0) / transactions.length
        : 0;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 md:pb-8 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 pt-4 md:pt-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-800 dark:text-white flex items-center gap-3">
                            <BarChart3 className="w-8 h-8 text-indigo-500" />
                            Financial Analytics
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">Visual insights into your savings journey</p>
                    </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Saved</p>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">₹{totalSaved.toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Overall Progress</p>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{progress.toFixed(1)}%</h3>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                                <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Avg. Transaction</p>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">₹{Math.round(avgTransaction).toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advanced Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">

                    {/* D3 Heatmap (Full Width) */}
                    <div className="card bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 col-span-1 md:col-span-2 lg:col-span-3 overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-emerald-500" />
                                Savings Consistency (Last 365 Days)
                            </h3>
                        </div>
                        <SavingsHeatmap transactions={transactions} />
                    </div>

                    {/* Savings Forecast */}
                    <div className="card bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 col-span-1 md:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Zap className="w-5 h-5 text-indigo-500" />
                                Savings Forecast
                            </h3>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                                Based on last 30 days
                            </span>
                        </div>
                        <div className="h-[300px] w-full">
                            <SavingsForecast />
                        </div>
                    </div>

                    {/* Category Radar */}
                    <div className="card bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 col-span-1">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Radar className="w-5 h-5 text-purple-500" />
                                Diversification
                            </h3>
                        </div>
                        <div className="h-[300px] w-full relative">
                            <CategoryRadar />
                        </div>
                    </div>
                </div>

                {/* Legacy Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Savings Trend */}
                    <div className="card bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 col-span-1 lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-indigo-500" />
                                Total Growth
                            </h3>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} opacity={0.5} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `₹${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="balance"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Goal Distribution */}
                    <div className="card bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <PieIcon className="w-5 h-5 text-pink-500" />
                                Goal Allocation
                            </h3>
                        </div>
                        <div className="h-[300px] w-full relative">
                            {distributionData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={distributionData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {distributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                    No savings data yet
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Monthly Activity */}
                    <div className="card bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-emerald-500" />
                                Monthly Activity
                            </h3>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                                    <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                    <Bar dataKey="deposits" name="Deposits" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    <Bar dataKey="withdrawals" name="Withdrawals" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
