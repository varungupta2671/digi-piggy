import { useState } from 'react';
import { BookOpen, Award, ChevronRight, CheckCircle, Lock } from 'lucide-react';
import { LESSONS } from '../utils/lessons';
import ReactMarkdown from 'react-markdown';

export default function LearningHub() {
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState(() => {
        const saved = localStorage.getItem('completedLessons');
        return saved ? JSON.parse(saved) : [];
    });
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const isCompleted = (lessonId) => completedLessons.includes(lessonId);

    const handleQuizSubmit = () => {
        const lesson = selectedLesson;
        const score = lesson.quiz.reduce((acc, q, idx) => {
            return quizAnswers[idx] === q.correct ? acc + 1 : acc;
        }, 0);

        const passed = score >= lesson.quiz.length * 0.7; // 70% to pass

        if (passed && !isCompleted(lesson.id)) {
            const updated = [...completedLessons, lesson.id];
            setCompletedLessons(updated);
            localStorage.setItem('completedLessons', JSON.stringify(updated));
        }

        setShowResults(true);
    };

    if (selectedLesson) {
        const Icon = selectedLesson.icon;
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 md:pb-8">
                <div className="max-w-4xl mx-auto p-4 md:p-8">
                    <button
                        onClick={() => {
                            setSelectedLesson(null);
                            setQuizAnswers({});
                            setShowResults(false);
                        }}
                        className="mb-6 text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2"
                    >
                        ← Back to Lessons
                    </button>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                                <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    {selectedLesson.title}
                                </h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {selectedLesson.duration} min read • {selectedLesson.difficulty}
                                </p>
                            </div>
                        </div>

                        <div className="prose dark:prose-invert max-w-none mb-8">
                            <ReactMarkdown>{selectedLesson.content}</ReactMarkdown>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Award className="w-6 h-6 text-amber-500" />
                                Knowledge Check
                            </h3>

                            <div className="space-y-6">
                                {selectedLesson.quiz.map((q, idx) => (
                                    <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6">
                                        <p className="font-medium text-slate-900 dark:text-white mb-4">
                                            {idx + 1}. {q.question}
                                        </p>
                                        <div className="space-y-2">
                                            {q.options.map((option, optIdx) => (
                                                <button
                                                    key={optIdx}
                                                    onClick={() => setQuizAnswers({ ...quizAnswers, [idx]: optIdx })}
                                                    disabled={showResults}
                                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${showResults
                                                            ? optIdx === q.correct
                                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                                                : quizAnswers[idx] === optIdx
                                                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                                                    : 'border-slate-200 dark:border-slate-700'
                                                            : quizAnswers[idx] === optIdx
                                                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!showResults ? (
                                <button
                                    onClick={handleQuizSubmit}
                                    disabled={Object.keys(quizAnswers).length !== selectedLesson.quiz.length}
                                    className="mt-6 btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Submit Quiz
                                </button>
                            ) : (
                                <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
                                    <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                        🎉 Lesson Complete! Earned: {selectedLesson.badge}
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Score: {Object.keys(quizAnswers).filter((k) => quizAnswers[k] === selectedLesson.quiz[k].correct).length}/{selectedLesson.quiz.length}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 md:pb-8">
            <div className="max-w-6xl mx-auto p-4 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-indigo-500" />
                        Learning Hub
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Master personal finance with bite-sized lessons
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {LESSONS.map((lesson) => {
                        const Icon = lesson.icon;
                        const completed = isCompleted(lesson.id);

                        return (
                            <button
                                key={lesson.id}
                                onClick={() => setSelectedLesson(lesson)}
                                className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:scale-[1.02] transition-all text-left"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                        <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    {completed && (
                                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                    {lesson.title}
                                </h3>

                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">{lesson.difficulty}</span>
                                    <span>•</span>
                                    <span>{lesson.duration} min</span>
                                </div>

                                {completed && (
                                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                                        {lesson.badge}
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-medium">
                                    <span className="text-sm">{completed ? 'Review' : 'Start Learning'}</span>
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
