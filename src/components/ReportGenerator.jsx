import { Download, FileJson, FileText, FileSpreadsheet } from 'lucide-react';
import { usePiggy } from '../context/PiggyContext';
import { exportToJSON, exportToCSV, generateSummaryReport } from '../utils/exportUtils';

export default function ReportGenerator() {
    const { goals, transactions, unlockedAchievements } = usePiggy();

    const handleJSONExport = () => {
        const data = {
            goals,
            transactions,
            achievements: unlockedAchievements
        };
        exportToJSON(data);
    };

    const handleCSVExport = () => {
        exportToCSV(transactions);
    };

    const handleSummaryExport = () => {
        const report = generateSummaryReport(goals, transactions, unlockedAchievements);
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `summary-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-6">
                <Download className="w-6 h-6 text-emerald-500" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Export & Reports</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={handleJSONExport}
                    className="flex flex-col items-center p-6 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl border-2 border-blue-200 dark:border-blue-800 transition-all group"
                >
                    <FileJson className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Full Backup</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                        Export all data as JSON
                    </p>
                </button>

                <button
                    onClick={handleCSVExport}
                    className="flex flex-col items-center p-6 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 transition-all group"
                >
                    <FileSpreadsheet className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Transactions CSV</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                        Export for spreadsheets
                    </p>
                </button>

                <button
                    onClick={handleSummaryExport}
                    className="flex flex-col items-center p-6 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-xl border-2 border-amber-200 dark:border-amber-800 transition-all group"
                >
                    <FileText className="w-12 h-12 text-amber-600 dark:text-amber-400 mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Summary Report</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                        Stats and insights
                    </p>
                </button>
            </div>

            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                    💡 Backup your data regularly to keep your savings journey safe!
                </p>
            </div>
        </div>
    );
}
