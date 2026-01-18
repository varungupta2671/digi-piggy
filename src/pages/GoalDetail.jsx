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

            // Validate existence
            const targetGoal = goals.find(g => g.id === targetId);

            if (!targetGoal && goals.length > 0) {
                // Goal ID invalid: Redirect to home
                navigate('/', { replace: true });
                return;
            }

            // If we have a valid target ID, but state is different, SWITCH
            if (targetGoal && goal?.id !== targetId) {
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
