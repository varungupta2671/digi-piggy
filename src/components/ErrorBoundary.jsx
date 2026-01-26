import React from 'react';
import { cn } from '../utils/cn';
import { AlertCircle, RefreshCw, Home, ChevronLeft } from 'lucide-react';
import PiggyAvatar from './PiggyAvatar';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            // Check if a custom fallback was provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
                    <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-700 backdrop-blur-xl relative overflow-hidden group">
                        {/* Decorative Background Elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            {/* Piggy in "Concerned" or Default State */}
                            <div className="w-32 h-32 mx-auto mb-8 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
                                <PiggyAvatar className="w-full h-full grayscale opacity-70" />
                            </div>

                            <div className="flex items-center justify-center gap-2 mb-4">
                                <AlertCircle className="text-pink-500 w-6 h-6" />
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                    Oops!
                                </h1>
                            </div>

                            <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
                                Something went a bit "oink" in the system. Don't worry, your savings are safe!
                            </p>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={this.handleRetry}
                                    className="w-full py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl"
                                >
                                    <RefreshCw className="w-4 h-4" /> Try Again
                                </button>

                                <button
                                    onClick={this.handleGoHome}
                                    className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Home className="w-4 h-4" /> Go to Dashboard
                                </button>
                            </div>

                            {process.env.NODE_ENV === 'development' && (
                                <details className="mt-8 text-left text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <summary className="cursor-pointer font-bold uppercase tracking-widest mb-2">Technical Details</summary>
                                    <p className="whitespace-pre-wrap break-all">{this.state.error && this.state.error.toString()}</p>
                                </details>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
