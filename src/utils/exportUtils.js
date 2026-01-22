// Export and reporting utilities
export function exportToJSON(data) {
    const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        ...data
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `digi-piggy-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

export function exportToCSV(transactions) {
    const headers = ['Date', 'Goal', 'Amount', 'Type', 'Note', 'Mood'];
    const rows = transactions.map(tx => [
        new Date(tx.date).toLocaleDateString(),
        tx.goalName || '-',
        tx.amount,
        tx.type,
        tx.note || '-',
        tx.mood || '-'
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

export function generateSummaryReport(goals, transactions, achievements) {
    const totalSaved = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const avgTransaction = totalSaved / (transactions.length || 1);
    const completedGoals = goals.filter(g => {
        const saved = g.savingsPlan?.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0) || 0;
        return saved >= g.targetAmount;
    }).length;

    return {
        summary: {
            totalSaved,
            totalGoals: goals.length,
            completedGoals,
            activeGoals: goals.length - completedGoals,
            totalTransactions: transactions.length,
            avgTransaction: Math.round(avgTransaction),
            achievements: achievements.length
        },
        goals: goals.map(g => ({
            name: g.name,
            target: g.targetAmount,
            saved: g.savingsPlan?.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0) || 0,
            progress: ((g.savingsPlan?.filter(b => b.status === 'paid').length || 0) / (g.savingsPlan?.length || 1)) * 100
        })),
        recentTransactions: transactions.slice(0, 10)
    };
}
