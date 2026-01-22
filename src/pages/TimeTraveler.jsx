import React, { useState, useMemo, useEffect } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Calendar, TrendingUp, DollarSign, Rocket, Target } from 'lucide-react';

const TimeTraveler = () => {
    const { goals, goal: currentGoal } = usePiggy();
    const navigate = useNavigate();

    // State
    const [selectedGoalId, setSelectedGoalId] = useState(currentGoal?.id || (goals[0]?.id || 'hypothetical'));
    const [monthlyContribution, setMonthlyContribution] = useState(1000);
    const [inflationRate, setInflationRate] = useState(0);
    const [oneTimeBoost, setOneTimeBoost] = useState(0);
    const [durationMonths, setDurationMonths] = useState(12);

    // Get selected goal details
    const selectedGoal = goals.find(g => g.id === selectedGoalId);

    // Initialize defaults when goal changes
    useEffect(() => {
        if (selectedGoal) {
            // Estimate current monthly contribution based on savings plan
            const planAmount = selectedGoal.targetAmount / selectedGoal.totalSlots;
            // Rough estimate: planAmount * (slots per month)
            // We'll just default to a reasonable value or the goal's frequency equivalent
            let baseMonthly = planAmount;
            if (selectedGoal.frequency === 'weekly') baseMonthly *= 4;
            if (selectedGoal.frequency === 'daily') baseMonthly *= 30;
            if (selectedGoal.frequency === 'yearly') baseMonthly /= 12;

            setMonthlyContribution(Math.round(baseMonthly / 100) * 100 || 1000);

            // Set duration to goal's remaining time or default
            setDurationMonths(12);
        }
    }, [selectedGoalId]);

    // Simulation Logic
    const simulationData = useMemo(() => {
        const data = [];
        let currentBalance = selectedGoal
            ? selectedGoal.savingsPlan.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0)
            : 0;

        let target = selectedGoal ? selectedGoal.targetAmount : 100000;
        let projectedBalance = currentBalance + parseFloat(oneTimeBoost || 0);

        // Generate monthly points
        // We'll project out for `durationMonths` or until target is hit (plus some buffer)

        const monthsToSimulate = 60; // Max 5 years projection
        const activeMonthlyContribution = parseFloat(monthlyContribution);

        let goalHitMonth = -1;

        for (let i = 0; i <= monthsToSimulate; i++) {
            // Apply Inflation to value of money (effectively reducing contribution power, 
            // but for simplicity we'll just track raw numbers)

            // Compound Interest? Let's assume a standard savings account rate 
            // changing strictly based on contribution for now, as this is "Piggy Bank" not "Stock Market"
            // But maybe we add a small interest rate? Let's stick to simple savings for clarity first.

            data.push({
                month: i,
                balance: projectedBalance,
                target: target
            });

            if (projectedBalance >= target && goalHitMonth === -1) {
                goalHitMonth = i;
            }

            projectedBalance += activeMonthlyContribution;
        }

        return { data, goalHitMonth, currentBalance, target };
    }, [selectedGoalId, monthlyContribution, oneTimeBoost, inflationRate]);

    const { data, goalHitMonth, currentBalance, target } = simulationData;

    // Simple Chart Component (SVG)
    const Chart = ({ data }) => {
        const height = 200;
        const width = 600; // viewbox units
        const padding = 20;

        const maxY = Math.max(target * 1.2, data[data.length - 1].balance);
        const maxX = data.length - 1;

        const getX = (index) => padding + (index / maxX) * (width - 2 * padding);
        const getY = (value) => height - padding - (value / maxY) * (height - 2 * padding);

        // Path for Balance
        const balancePath = data.map((d, i) =>
            `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.balance)}`
        ).join(' ');

        // Path for Target Line
        const targetY = getY(target);
        const targetPath = `M ${padding} ${targetY} L ${width - padding} ${targetY}`;

        return (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                {/* Grid Lines (Simple) */}
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

                {/* Target Area Shading */}
                <path d={`M ${padding} ${targetY} L ${width - padding} ${targetY} L ${width - padding} 0 L ${padding} 0 Z`} className="fill-emerald-500/5 dark:fill-emerald-500/10" />

                {/* Target Line */}
                <path d={targetPath} className="stroke-emerald-500 stroke-2" strokeDasharray="5,5" />
                <text x={width - padding} y={targetY - 5} textAnchor="end" className="text-xs fill-emerald-600 dark:fill-emerald-400 font-medium">Target: ₹{target.toLocaleString()}</text>

                {/* Balance Line */}
                <path d={balancePath} className="fill-none stroke-indigo-500 stroke-[3]" strokeLinecap="round" strokeLinejoin="round" />

                {/* Goal Hit Point */}
                {goalHitMonth !== -1 && (
                    <circle
                        cx={getX(goalHitMonth)}
                        cy={getY(target)}
                        r="6"
                        className="fill-white stroke-indigo-600 stroke-4 animate-pulse"
                    />
                )}
            </svg>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 md:pb-8 animate-fade-in">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 sticky top-0 z-30 shadow-sm px-4 py-3 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-purple-500" />
                        Time Traveler
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Peak into your financial future</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">

                {/* Main Card: Controls & Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                    <div className="grid md:grid-cols-[1fr_1.5fr] gap-8">

                        {/* Controls */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Simulate Goal</label>
                                <select
                                    value={selectedGoalId}
                                    onChange={(e) => setSelectedGoalId(e.target.value)}
                                    className="input"
                                >
                                    <option value="hypothetical">Test Goal (₹1,00,000)</option>
                                    {goals.map(g => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4 text-slate-400" />
                                    Adjust Variables
                                </h3>

                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-600 dark:text-slate-400">Monthly Contribution</span>
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">₹{monthlyContribution.toLocaleString()}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="100"
                                        max="50000"
                                        step="100"
                                        value={monthlyContribution}
                                        onChange={(e) => setMonthlyContribution(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                                        <span>₹100</span>
                                        <span>₹50,000</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-600 dark:text-slate-400">One-time Boost</span>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{oneTimeBoost.toLocaleString()}</span>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</div>
                                        <input
                                            type="number"
                                            value={oneTimeBoost}
                                            onChange={(e) => setOneTimeBoost(parseFloat(e.target.value) || 0)}
                                            className="input pl-8 py-2"
                                            placeholder="Add extra amount..."
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">What if you saved a bonus today?</p>
                                </div>
                            </div>
                        </div>

                        {/* Visualization */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 flex flex-col">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-indigo-500" />
                                Projected Growth
                            </h3>

                            <div className="flex-1 min-h-[200px] mb-4">
                                <Chart data={data} />
                            </div>

                            {/* Result Summary */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                                {goalHitMonth !== -1 ? (
                                    <div className="text-center">
                                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Goal Reached In</div>
                                        <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-2">
                                            {goalHitMonth} <span className="text-lg text-slate-400 font-normal">Months</span>
                                        </div>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                                            🎉 You can do it!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Projected Balance (5 Yrs)</div>
                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                            ₹{data[data.length - 1].balance.toLocaleString()}
                                        </div>
                                        <p className="text-xs text-orange-500 mt-1">
                                            Boost contribution to finish sooner!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Insight Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="card p-5 flex flex-col items-center text-center">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-3">
                            <Target className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">Consistency Key</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Saving <strong>₹{monthlyContribution}</strong> monthly totals <strong>₹{(monthlyContribution * 12).toLocaleString()}</strong> in a year.
                        </p>
                    </div>

                    <div className="card p-5 flex flex-col items-center text-center">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 mb-3">
                            <Rocket className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">Boost Power</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            A one-time boost of <strong>₹5,000</strong> can shave off approx <strong>{Math.ceil(5000 / monthlyContribution)}</strong> months!
                        </p>
                    </div>

                    <div className="card p-5 flex flex-col items-center text-center">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400 mb-3">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">Total Impact</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Keep this up and you'll save <strong>₹{(monthlyContribution * 60).toLocaleString()}</strong> in 5 years.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeTraveler;
