import React, { useMemo } from 'react';
import { usePiggy } from '../context/PiggyContext';
import {
    TrendingUp,
    PieChart as PieIcon,
    BarChart3,
    ArrowUpRight,
    DollarSign,
    Calendar,
    Activity,
    Radar,
    Zap,
    Shield
} from 'lucide-react';
import SavingsHeatmap from '../components/analytics/SavingsHeatmap';
import CategoryRadar from '../components/analytics/CategoryRadar';
import SavingsForecast from '../components/analytics/d3/ForecastAreaChart';
import SavingsTrendChart from '../components/analytics/d3/SavingsTrendChart';
import PortfolioDonutChart from '../components/analytics/d3/PortfolioDonutChart';
import MonthlyBarChart from '../components/analytics/d3/MonthlyBarChart';
import SavingsSimulator from '../components/SavingsSimulator';
import ErrorBoundary from '../components/ErrorBoundary';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#ef4444', '#f59e0b', '#10b981', '#3b82f6'];

const ChartErrorFallback = ({ title }) => (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 h-full">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title} Unavailable</p>
        <p className="text-[10px] text-slate-500 text-center">Charts are shy today. Try reloading.</p>
    </div>
);

const AnalyticsPage = () => {
    const { goals, transactions } = usePiggy();

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
                        <ErrorBoundary fallback={<ChartErrorFallback title="Heatmap" />}>
                            <SavingsHeatmap transactions={transactions} />
                        </ErrorBoundary>
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
                            <ErrorBoundary fallback={<ChartErrorFallback title="Forecast" />}>
                                <SavingsForecast goals={goals} transactions={transactions} />
                            </ErrorBoundary>
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
                            <ErrorBoundary fallback={<ChartErrorFallback title="Radar" />}>
                                <CategoryRadar />
                            </ErrorBoundary>
                        </div>
                    </div>
                </div>

                {/* Legacy Charts Grid (Replaced by D3) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* D3 Trend Chart */}
                    <div className="card bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 col-span-1 lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-indigo-500" />
                                Total Growth Trend
                            </h3>
                        </div>
                        <div className="h-[300px] w-full">
                            <ErrorBoundary fallback={<ChartErrorFallback title="Trend" />}>
                                <SavingsTrendChart transactions={transactions} />
                            </ErrorBoundary>
                        </div>
                    </div>

                    {/* D3 Donut Chart (Allocation) */}
                    <div className="card bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <PieIcon className="w-5 h-5 text-pink-500" />
                                Goal Allocation
                            </h3>
                        </div>
                        <div className="h-[300px] w-full relative">
                            <ErrorBoundary fallback={<ChartErrorFallback title="Allocation" />}>
                                <PortfolioDonutChart goals={goals} />
                            </ErrorBoundary>
                        </div>
                    </div>

                    {/* D3 Monthly Bar Chart */}
                    <div className="card bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-emerald-500" />
                                Monthly Activity
                            </h3>
                        </div>
                        <div className="h-[300px] w-full">
                            <ErrorBoundary fallback={<ChartErrorFallback title="Activity" />}>
                                <MonthlyBarChart transactions={transactions} />
                            </ErrorBoundary>
                        </div>
                    </div>

                    {/* Savings Simulator */}
                    <div className="col-span-1 lg:col-span-2">
                        <SavingsSimulator goal={goals[0]} />
                    </div>

                    {/* Credit Score Tracking Integration */}
                    <div className="card bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 col-span-1 lg:col-span-2 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 text-indigo-500/5 pointer-events-none group-hover:scale-110 transition-transform">
                            <Shield size={180} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2 mb-8 uppercase tracking-tighter">
                                <Shield className="w-6 h-6 text-indigo-500" />
                                Credit Score Tracking
                            </h3>

                            <div className="flex flex-col md:flex-row items-center gap-12">
                                {/* Gauge */}
                                <div className="relative w-48 h-48 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-700" />
                                        <circle
                                            cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent"
                                            strokeDasharray={2 * Math.PI * 80}
                                            strokeDashoffset={2 * Math.PI * 80 * (1 - 748 / 900)}
                                            className="text-emerald-500"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">748</span>
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Excellent</span>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Update</p>
                                            <p className="font-bold text-slate-900 dark:text-white">Oct 24, 2025</p>
                                        </div>
                                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                                            <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Trend</p>
                                            <p className="font-bold text-emerald-600 dark:text-emerald-400">+12 Points</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                        Your consistent savings and on-time simulated "bill payments" have improved your score by 2% this month. Keep it up!
                                    </p>
                                    <button className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                                        View Full Report <ArrowUpRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
