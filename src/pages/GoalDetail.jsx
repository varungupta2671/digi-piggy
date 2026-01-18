import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePiggy } from '../context/PiggyContext';
import Dashboard from '../components/Dashboard';

export default function GoalDetail() {
    const { id } = useParams();
    const { switchGoal, goal, isLoading, goals } = usePiggy();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && id) {
            const targetId = parseInt(id, 10);

            // Check if goal exists
            const exists = goals.some(g => g.id === targetId);
            if (!exists && goals.length > 0) {
                navigate('/'); // Go home if goal doesn't exist
                return;
            }

            if (goal?.id !== targetId && exists) {
                switchGoal(targetId);
            }
        }
    }, [id, isLoading, goal, goals, switchGoal, navigate]);

    if (!goal) return null; // Handle loading/redirect

    return (
        <div className="animate-fade-in">
            <Dashboard />
        </div>
    );
}
