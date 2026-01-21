import { usePiggy } from '../context/PiggyContext';
import { Trophy, Target, Clock, CheckCircle, XCircle, Plus, Flame } from 'lucide-react';
import { useState } from 'react';
import { CHALLENGE_TEMPLATES } from '../utils/challenges';
import ChallengeCard from '../components/ChallengeCard';

export default function ChallengesPage() {
    const { challenges, createChallenge } = usePiggy();
    const [showTemplates, setShowTemplates] = useState(false);

    const activeChallenges = challenges.filter(c => c.status === 'active');
    const completedChallenges = challenges.filter(c => c.status === 'completed');
    const failedChallenges = challenges.filter(c => c.status === 'failed');

    const handleStartChallenge = async (template) => {
        await createChallenge(template);
        setShowTemplates(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 md:pb-8">
            {/* Header */}
            <div className="bg-white pt-8 pb-6 px-6 rounded-b-[2.5rem] shadow-sm mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Challenges</h1>
                        <p className="text-sm text-slate-500">Push your savings to the next level</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex items-center justify-center shadow-lg transform rotate-6">
                        <Trophy className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                        <div className="text-lg font-bold text-slate-900">{activeChallenges.length}</div>
                        <div className="text-xs text-slate-500">Active</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-3 text-center">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                        <div className="text-lg font-bold text-slate-900">{completedChallenges.length}</div>
                        <div className="text-xs text-slate-500">Completed</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <Target className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-slate-900">{challenges.length}</div>
                        <div className="text-xs text-slate-500">Total</div>
                    </div>
                </div>
            </div>

            <div className="px-4 space-y-6">
                {/* Active Challenges */}
                {activeChallenges.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 mb-3 px-2">Active Challenges</h2>
                        <div className="space-y-3">
                            {activeChallenges.map(challenge => (
                                <ChallengeCard key={challenge.id} challenge={challenge} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Start New Challenge Button */}
                <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-5 h-5" />
                    Start New Challenge
                </button>

                {/* Challenge Templates */}
                {showTemplates && (
                    <div className="space-y-3 animate-fade-in">
                        <h3 className="text-sm font-bold text-slate-600 px-2">Choose a Challenge:</h3>
                        {CHALLENGE_TEMPLATES.map(template => (
                            <button
                                key={template.id}
                                onClick={() => handleStartChallenge(template)}
                                className="w-full bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-orange-300 hover:bg-orange-50 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-3 bg-orange-100 rounded-xl">
                                        <template.icon className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900">{template.title}</h4>
                                        <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {template.durationDays} days
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Trophy className="w-3 h-3" />
                                                Reward badge
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Completed Challenges */}
                {completedChallenges.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 mb-3 px-2">Completed</h2>
                        <div className="space-y-3">
                            {completedChallenges.map(challenge => (
                                <ChallengeCard key={challenge.id} challenge={challenge} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Failed Challenges */}
                {failedChallenges.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 mb-3 px-2">Expired</h2>
                        <div className="space-y-3">
                            {failedChallenges.map(challenge => (
                                <ChallengeCard key={challenge.id} challenge={challenge} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {challenges.length === 0 && !showTemplates && (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No Challenges Yet</h3>
                        <p className="text-sm text-slate-500 mb-6">Start a challenge to boost your savings!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
