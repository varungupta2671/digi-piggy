import GoalForm from '../components/GoalForm';

export default function CreateGoal() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
            <GoalForm />
        </div>
    );
}
