import { usePiggy } from '../context/PiggyContext';
import { Trophy, Target, Clock, CheckCircle, Plus, Flame, Star, Award } from 'lucide-react';
import { useState } from 'react';
import { CHALLENGES, DIFFICULTY_COLORS } from '../utils/challenges';

export default function ChallengesPage() {
    const { activeChallenges, completedChallenges, startChallenge } = usePiggy();
    const [showTemplates, setShowTemplates] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');

    const filteredChallenges = selectedDifficulty === 'all'
        ? CHALLENGES
        : CHALLENGES.filter(c => c.difficulty === selectedDifficulty);

    const handleStartChallenge = async (challenge) => {
        await startChallenge(challenge);
        setShowTemplates(false);
    };

    const totalCompleted = completedChallenges?.length || 0;
    const totalActive = activeChallenges?.length || 0;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 md:pb-8">
            {/* Header */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 pt-8 pb-6 px-6 rounded-b-[2.5rem] shadow-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white mb-1">Challenges</h1>
                        <p className="text-sm text-orange-100">Push your savings to new heights</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
                        <Trophy className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30">
                        <Flame className="w-5 h-5 text-yellow-200 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{totalActive}</div>
                        <div className="text-xs text-orange-100">Active</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30">
                        <CheckCircle className="w-5 h-5 text-emerald-300 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{totalCompleted}</div>
                        <div className="text-xs text-orange-100">Completed</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30">
                        <Star className="w-5 h-5 text-amber-200 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{CHALLENGES.length}</div>
                        <div className="text-xs text-orange-100">Available</div>
                    </div>
                </div>
            </div>

            <div className="px-4 space-y-6">
                {/* Start New Challenge Button */}
                <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-5 h-5" />
                    {showTemplates ? 'Hide Challenges' : 'Browse Challenges'}
                </button>

                {/* Challenge Browser */}
                {showTemplates && (
                    <div className="space-y-4 animate-fade-in">
                        {/* Difficulty Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {['all', 'easy', 'medium', 'hard', 'expert'].map(diff => (
                                <button
                                    key={diff}
                                    onClick={() => setSelectedDifficulty(diff)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedDifficulty === diff
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                        }`}
                                >
                                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Challenge Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredChallenges.map(challenge => {
                                const Icon = challenge.icon;
                                const isActive = activeChallenges?.some(ac => ac.challengeId === challenge.id);
                                const isCompleted = completedChallenges?.some(cc => cc.challengeId === challenge.id);

                                return (
                                    <button
                                        key={challenge.id}
                                        onClick={() => !isActive && handleStartChallenge(challenge)}
                                        disabled={isActive}
                                        className={`relative bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 text-left transition-all ${isActive
                                            ? 'border-orange-400 dark:border-orange-600 opacity-75 cursor-not-allowed'
                                            : isCompleted
                                                ? 'border-emerald-400 dark:border-emerald-600'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg hover:scale-[1.02]'
                                            }`}
                                    >
                                        {isCompleted && (
                                            <div className="absolute top-3 right-3">
                                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                                            </div>
                                        )}
                                        {isActive && (
                                            <div className="absolute top-3 right-3">
                                                <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                                            </div>
                                        )}

                                        <div className={`w-12 h-12 bg-gradient-to-br ${challenge.color} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>

                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{challenge.title}</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{challenge.description}</p>

                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${DIFFICULTY_COLORS[challenge.difficulty]}`}>
                                                {challenge.difficulty.toUpperCase()}
                                            </span>
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {challenge.duration} days
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                                            <span className="text-xs text-slate-500">Reward: {challenge.badge}</span>
                                            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">+₹{challenge.reward}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Active Challenges */}
                {totalActive > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 px-2">Active Challenges</h2>
                        <div className="space-y-3">
                            {activeChallenges.map(activeChallenge => {
                                const challenge = CHALLENGES.find(c => c.id === activeChallenge.challengeId);
                                if (!challenge) return null;

                                const Icon = challenge.icon;
                                const progress = (activeChallenge.progress / challenge.target) * 100;

                                return (
                                    <div key={activeChallenge.id} className={`bg-gradient-to-br ${challenge.color} p-5 rounded-2xl shadow-lg`}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                                    <Icon className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white">{challenge.title}</h3>
                                                    <p className="text-xs text-white/80">{challenge.description}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-2">
                                            <div className="flex justify-between text-xs text-white/90 mb-1">
                                                <span>Progress</span>
                                                <span className="font-bold">{Math.min(progress, 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                                                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-white/90">
                                            <span>{activeChallenge.daysRemaining} days left</span>
                                            <span>{activeChallenge.progress} / {challenge.target}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {totalActive === 0 && !showTemplates && (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-10 h-10 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Ready for a Challenge?</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Take on exciting savings challenges and earn rewards!</p>
                    </div>
                )}
            </div>
        </div >
    );
}
