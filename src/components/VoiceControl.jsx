import { useState } from 'react';
import { Mic, MicOff, Volume2, X, Zap, TrendingUp, Target, Home, BarChart3 } from 'lucide-react';
import { usePiggy } from '../context/PiggyContext';
import { useNavigate } from 'react-router-dom';

const AVAILABLE_COMMANDS = [
    { trigger: 'how much', icon: TrendingUp, label: 'Check total saved', example: '"How much have I saved?"' },
    { trigger: 'streak', icon: Zap, label: 'Check streak', example: '"What\'s my streak?"' },
    { trigger: 'goal', icon: Target, label: 'View goals', example: '"Show my goals"' },
    { trigger: 'analytics', icon: BarChart3, label: 'Open analytics', example: '"Go to analytics"' },
    { trigger: 'home', icon: Home, label: 'Go home', example: '"Go home"' },
];

export default function VoiceControl() {
    const [isListening, setIsListening] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const { goals, transactions, savingsStreak, addNotification } = usePiggy();
    const navigate = useNavigate();

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setResponse('❌ Voice commands not supported in your browser. Try Chrome!');
            return;
        }

        setShowModal(true);
        setTranscript('');
        setResponse('');

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript('🎤 Listening...');
        };

        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            setTranscript(`You said: "${command}"`);
            processCommand(command);
        };

        recognition.onerror = () => {
            setIsListening(false);
            setTranscript('');
            setResponse('❌ Error listening. Please try again!');
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const stopListening = () => {
        setIsListening(false);
        setShowModal(false);
        setTranscript('');
        setResponse('');
    };

    const processCommand = (command) => {
        // Command: "How much have I saved?"
        if (command.includes('how much') || command.includes('total saved') || command.includes('balance')) {
            const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
            const message = `You have saved ₹${total.toLocaleString()}`;
            setResponse(`✅ ${message}`);
            speak(message);
            setTimeout(stopListening, 3000);
            return;
        }

        // Command: "What's my streak?"
        if (command.includes('streak')) {
            const message = `Your current streak is ${savingsStreak} days`;
            setResponse(`✅ ${message}`);
            speak(message);
            setTimeout(stopListening, 3000);
            return;
        }

        // Command: "Show my goals" / "Go to goals"
        if (command.includes('show') && command.includes('goal')) {
            setResponse('✅ Opening your goals');
            speak('Showing your goals');
            setTimeout(() => {
                navigate('/');
                stopListening();
            }, 1000);
            return;
        }

        // Command: "Go to analytics" / "Show analytics"
        if (command.includes('analytics') || command.includes('stats')) {
            setResponse('✅ Opening analytics');
            speak('Opening analytics');
            setTimeout(() => {
                navigate('/analytics');
                stopListening();
            }, 1000);
            return;
        }

        // Command: "Go home"
        if (command.includes('home') || command.includes('dashboard')) {
            setResponse('✅ Going home');
            speak('Taking you home');
            setTimeout(() => {
                navigate('/');
                stopListening();
            }, 1000);
            return;
        }

        // Command: "Go to challenges"
        if (command.includes('challenge')) {
            setResponse('✅ Opening challenges');
            speak('Opening challenges');
            setTimeout(() => {
                navigate('/challenges');
                stopListening();
            }, 1000);
            return;
        }

        // Command: "Go to achievements" / "Show achievements"
        if (command.includes('achievement') || command.includes('trophy')) {
            setResponse('✅ Opening achievements');
            speak('Opening achievements');
            setTimeout(() => {
                navigate('/achievements');
                stopListening();
            }, 1000);
            return;
        }

        // Unknown command
        setResponse('❌ Sorry, I didn\'t understand that command. Try another!');
        speak('Sorry, I didn\'t understand that command');
    };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <>
            {/* Microphone Button */}
            <button
                onClick={startListening}
                className="p-2 rounded-full transition-all text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Voice Commands"
                title="Voice Commands"
            >
                <Mic className="w-5 h-5" />
            </button>

            {/* Voice Command Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-full ${isListening ? 'bg-red-100 dark:bg-red-900/30 animate-pulse' : 'bg-indigo-100 dark:bg-indigo-900/30'}`}>
                                    {isListening ? <MicOff className="w-6 h-6 text-red-600 dark:text-red-400" /> : <Mic className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Voice Commands</h2>
                                    <p className="text-xs text-slate-500">
                                        {isListening ? 'Listening...' : 'Click mic to start'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={stopListening}
                                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Status */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-900/50">
                            {transcript && (
                                <div className="mb-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{transcript}</p>
                                </div>
                            )}
                            {response && (
                                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{response}</p>
                                </div>
                            )}
                            {!transcript && !response && (
                                <p className="text-sm text-slate-500 text-center">Speak a command or choose from below</p>
                            )}
                        </div>

                        {/* Available Commands */}
                        <div className="p-6">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                <Volume2 className="w-4 h-4" />
                                Available Commands
                            </h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {AVAILABLE_COMMANDS.map((cmd, idx) => {
                                    const Icon = cmd.icon;
                                    return (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <Icon className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">{cmd.label}</p>
                                                <p className="text-xs text-slate-500">{cmd.example}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                            <button
                                onClick={stopListening}
                                className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={startListening}
                                disabled={isListening}
                                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${isListening
                                        ? 'bg-red-500 text-white cursor-not-allowed opacity-75'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    }`}
                            >
                                {isListening ? 'Listening...' : 'Start Listening'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
