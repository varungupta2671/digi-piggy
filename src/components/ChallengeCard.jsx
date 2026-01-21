import { Clock, CheckCircle, XCircle, Trophy, TrendingUp } from 'lucide-react';

export default function ChallengeCard({ challenge }) {
    const getTimeRemaining = () => {
        const now = new Date();
        const end = new Date(challenge.endDate);
        const diff = end - now;

        if (diff <= 0) return 'Expired';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days}d ${hours}h left`;
        return `${hours}h left`;
    };

    const getProgress = () => {
        if (challenge.targetAmount) {
            return Math.min((challenge.currentAmount / challenge.targetAmount) * 100, 100);
        }
        if (challenge.targetCount) {
            return Math.min((challenge.currentCount / challenge.targetCount) * 100, 100);
        }
        return 0;
    };

    const progress = getProgress();
    const isActive = challenge.status === 'active';
    const isCompleted = challenge.status === 'completed';
    const isFailed = challenge.status === 'failed';

    const statusColors = {
        active: 'border-orange-200 bg-orange-50',
        completed: 'border-emerald-200 bg-emerald-50',
        failed: 'border-slate-200 bg-slate-50'
    };

    const progressColors = {
        active: 'bg-orange-500',
        completed: 'bg-emerald-500',
        failed: 'bg-slate-300'
    };

    return (
        <div className={`bg-white border-2 ${statusColors[challenge.status]} rounded-2xl p-4 transition-all`}>
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                <div className="p-3 bg-slate-100 rounded-xl">
                    <challenge.icon className="w-8 h-8 text-slate-700" />
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-slate-900">{challenge.title}</h3>
                        {isActive && (
                            <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                <Clock className="w-3 h-3" />
                                {getTimeRemaining()}
                            </div>
                        )}
                        {isCompleted && (
                            <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                Done!
                            </div>
                        )}
                        {isFailed && (
                            <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                <XCircle className="w-3 h-3" />
                                Expired
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{challenge.description}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>Progress</span>
                    <span className="font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${progressColors[challenge.status]} transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
                {challenge.targetAmount && (
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">
                            ₹{challenge.currentAmount.toLocaleString()} / ₹{challenge.targetAmount.toLocaleString()}
                        </span>
                    </div>
                )}
                {challenge.targetCount && (
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">
                            {challenge.currentCount} / {challenge.targetCount} deposits
                        </span>
                    </div>
                )}
                {isCompleted && challenge.completedAt && (
                    <div className="text-emerald-600 flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        <span className="text-xs">Reward Unlocked!</span>
                    </div>
                )}
            </div>
        </div>
    );
}
