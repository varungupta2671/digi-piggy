import { Settings, CreditCard, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePiggy } from '../context/PiggyContext';

export default function AccountSetup() {
    const { accounts, defaultAccountId } = usePiggy();
    const defaultAccount = accounts.find(a => a.id === defaultAccountId);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-500" />
                    Payment Method
                </h3>
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Manage your UPI accounts in the global settings to use them for this goal.
            </p>

            <Link
                to="/settings"
                className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-slate-200 dark:border-slate-600 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                        <Settings className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white">Configure Accounts</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {accounts.length} linked • {defaultAccount ? `Default: ${defaultAccount.name}` : 'No default set'}
                        </p>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all text-slate-300">
                    <ArrowRight className="w-4 h-4" />
                </div>
            </Link>
        </div>
    );
}
