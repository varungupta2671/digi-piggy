import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { usePiggy, PiggyProvider } from './context/PiggyContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import GoalForm from './components/GoalForm';
import CreateGoal from './pages/CreateGoal';
import GoalsList from './pages/GoalsList';
import GoalDetail from './pages/GoalDetail';
import Achievements from './pages/Achievements';
import About from './pages/About';
import Contact from './pages/Contact';

function AppContent() {
    const { goal, isEditing, isLoading } = usePiggy();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="animate-pulse">Loading Savings...</div>
            </div>
        );
    }

    // Show goal form if editing (modal mode)
    if (isEditing) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
                <GoalForm />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950">
            <Header />
            <Routes>
                <Route path="/" element={<GoalsList />} />
                <Route path="/create" element={<CreateGoal />} />
                <Route path="/goal/:id" element={<GoalDetail />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
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
                </ToastProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
