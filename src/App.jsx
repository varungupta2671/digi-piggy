import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { usePiggy, PiggyProvider } from './context/PiggyContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { SpeedInsights } from "@vercel/speed-insights/react";
import Header from './components/Header';
import GoalForm from './components/GoalForm';
import CreateGoal from './pages/CreateGoal';
import GoalsList from './pages/GoalsList';
import LearningHub from './pages/LearningHub';
import GoalDetail from './pages/GoalDetail';
import Achievements from './pages/Achievements';
import History from './pages/History';
import About from './pages/About';
import Contact from './pages/Contact';
import BottomNav from './components/BottomNav';
import MilestoneCelebration from './components/MilestoneCelebration';
import ChallengesPage from './pages/ChallengesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TimeTraveler from './pages/TimeTraveler';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
    const { goal, isEditing, isLoading, celebratingMilestone, closeMilestone } = usePiggy();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-800 dark:text-slate-200">
                <div className="animate-pulse">Loading Savings...</div>
            </div>
        );
    }

    // Show goal form if editing (modal mode)
    if (isEditing) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
                <GoalForm />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 md:pb-0">
            <Header />
            <Routes>
                <Route path="/" element={<GoalsList />} />
                <Route path="/create" element={<CreateGoal />} />
                <Route path="/goal/:id" element={<GoalDetail />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/challenges" element={<ChallengesPage />} />
                <Route path="/learn" element={<LearningHub />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/time-travel" element={<TimeTraveler />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <BottomNav />

            {/* Milestone Celebration Modal */}
            {celebratingMilestone && (
                <MilestoneCelebration
                    milestone={celebratingMilestone.milestone}
                    goalName={celebratingMilestone.goalName}
                    currentAmount={celebratingMilestone.currentAmount}
                    targetAmount={celebratingMilestone.targetAmount}
                    onClose={closeMilestone}
                />
            )}
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <ToastProvider>
                    <PiggyProvider>
                        <AppContent />
                    </PiggyProvider>
                    <SpeedInsights />
                </ToastProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
