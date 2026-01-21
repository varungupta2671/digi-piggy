import { usePiggy } from '../context/PiggyContext';
import { useState, useMemo } from 'react';
import { Calendar, Search, Filter, TrendingDown, Clock, Wallet } from 'lucide-react';
import { getCategoryById } from '../utils/categories';

export default function History() {
    const { transactions, goals, accounts } = usePiggy();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterGoal, setFilterGoal] = useState('all');
    const [sortBy, setSortBy] = useState('recent'); // recent, oldest, amount-high, amount-low

    // Enhanced transactions with goal/account info
    const enrichedTransactions = useMemo(() => {
        return transactions.map(tx => {
            const goalName = tx.description?.match(/for (.+)$/)?.[1] || 'Unknown Goal';
            const goal = goals.find(g => g.name === goalName);
            const account = accounts.find(a => a.id === tx.accountId);

            return {
                ...tx,
                goalName,
                goalCategory: goal?.category || 'other',
                accountName: account?.name || 'Manual',
                accountUpi: account?.upiId || 'N/A'
            };
        });
    }, [transactions, goals, accounts]);

    // Filter and sort
    const filteredTransactions = useMemo(() => {
        let result = enrichedTransactions;

        // Search filter
        if (searchQuery) {
            result = result.filter(tx =>
                tx.goalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tx.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tx.amount.toString().includes(searchQuery)
            );
        }

        // Goal filter
        if (filterGoal !== 'all') {
            result = result.filter(tx => tx.goalName === filterGoal);
        }

        // Sort
        switch (sortBy) {
            case 'recent':
                result.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'amount-high':
                result.sort((a, b) => b.amount - a.amount);
                break;
            case 'amount-low':
                result.sort((a, b) => a.amount - b.amount);
                break;
        }

        return result;
    }, [enrichedTransactions, searchQuery, filterGoal, sortBy]);

    // Stats
    const totalSaved = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const avgTransaction = transactions.length > 0 ? totalSaved / transactions.length : 0;

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 md:pb-8 animate-fade-in">
            {/* Header */}
            <div className="bg-white px-6 pt-6 pb-6 rounded-b-[2rem] shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Transaction History</h1>
                        <p className="text-sm text-slate-500">{transactions.length} total deposits</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-2xl">
                        <p className="text-xs text-emerald-700 font-bold uppercase tracking-wide mb-1">Total Saved</p>
                        <p className="text-2xl font-bold text-emerald-900">₹{totalSaved.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl">
                        <p className="text-xs text-blue-700 font-bold uppercase tracking-wide mb-1">Avg/Deposit</p>
                        <p className="text-2xl font-bold text-blue-900">₹{Math.round(avgTransaction).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="px-4 max-w-4xl mx-auto space-y-4">
                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                        />
                    </div>

                    {/* Filters Row */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        <select
                            value={filterGoal}
                            onChange={(e) => setFilterGoal(e.target.value)}
                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            <option value="all">All Goals</option>
                            {goals.map(goal => (
                                <option key={goal.id} value={goal.name}>{goal.name}</option>
                            ))}
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="oldest">Oldest First</option>
                            <option value="amount-high">Highest Amount</option>
                            <option value="amount-low">Lowest Amount</option>
                        </select>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="space-y-3">
                    {filteredTransactions.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl text-center border border-slate-100">
                            <Wallet className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p className="text-slate-500 font-medium">
                                {searchQuery || filterGoal !== 'all' ? 'No matching transactions' : 'No transactions yet'}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                {searchQuery || filterGoal !== 'all' ? 'Try adjusting your filters' : 'Start saving to see your history'}
                            </p>
                        </div>
                    ) : (
                        filteredTransactions.map((tx, index) => (
                            <div
                                key={tx.id}
                                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all animate-fade-in"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <span className="text-2xl flex-shrink-0 mt-0.5">
                                            {getCategoryById(tx.goalCategory).icon}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-slate-900 truncate">{tx.goalName}</h3>
                                            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(tx.date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right ml-3 flex-shrink-0">
                                        <p className="text-lg font-bold text-emerald-600">₹{tx.amount.toLocaleString()}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{tx.accountName}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Results count */}
                {filteredTransactions.length > 0 && (
                    <p className="text-center text-xs text-slate-400 pt-2">
                        Showing {filteredTransactions.length} of {transactions.length} transactions
                    </p>
                )}
            </div>
        </div>
    );
}
