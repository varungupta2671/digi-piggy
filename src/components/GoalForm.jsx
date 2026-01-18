import { useState, useEffect } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Target, Calendar, ArrowRight, Clock, X, Type } from 'lucide-react';

export default function GoalForm() {
    const { createGoal, goal, isEditing, cancelEditing } = usePiggy();
    const navigate = useNavigate();
    const location = useLocation();

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [durationValue, setDurationValue] = useState('1');
    const [durationUnit, setDurationUnit] = useState('months');
    const [frequency, setFrequency] = useState('daily');
    const [estimatedSlots, setEstimatedSlots] = useState(0);

    const isCreating = location.pathname === '/create';

    useEffect(() => {
        if (isEditing && goal) {
            setName(goal.name || '');
            setAmount(goal.targetAmount);
            setFrequency(goal.frequency);
            if (goal.durationValue) setDurationValue(goal.durationValue);
            if (goal.durationUnit) setDurationUnit(goal.durationUnit);
        } else if (!isEditing) {
            setName('');
            setAmount('');
            setDurationValue('1');
            setDurationUnit('months');
            setFrequency('daily');
        }
    }, [isEditing, goal]);

    useEffect(() => {
        if (!durationValue) {
            setEstimatedSlots(0);
            return;
        }

        const val = parseInt(durationValue);
        let days = 0;

        switch (durationUnit) {
            case 'days': days = val; break;
            case 'weeks': days = val * 7; break;
            case 'months': days = val * 30; break;
            case 'years': days = val * 365; break;
            default: days = val;
        }

        let interval = 1;
        switch (frequency) {
            case 'daily': interval = 1; break;
            case 'weekly': interval = 7; break;
            case 'monthly': interval = 30; break;
            case 'yearly': interval = 365; break;
            default: interval = 1;
        }

        const slots = Math.ceil(days / interval);
        setEstimatedSlots(slots > 0 ? slots : 0);

    }, [durationValue, durationUnit, frequency]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || estimatedSlots <= 0) {
            alert("Please check amount and duration to ensure valid deposits.");
            return;
        }

        const safeName = name.trim();

        try {
            await createGoal(safeName, amount, estimatedSlots, frequency, durationValue, durationUnit);
        } catch (error) {
            console.error("Goal creation error:", error);
        }

        if (isEditing) {
            cancelEditing();
        } else {
            navigate('/', { replace: true });
        }
    };

    const handleClose = () => {
        if (isEditing) {
            cancelEditing();
        } else {
            navigate('/');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-3xl shadow-xl animate-fade-in relative z-50">
            {(isEditing || isCreating) && (
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            )}

            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                    {isEditing ? 'Edit Goal' : 'New Goal'}
                </h2>
                <div className="h-1 w-12 mx-auto bg-emerald-500 rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Type className="w-4 h-4 text-emerald-500" />
                        Goal Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input text-lg font-medium placeholder:font-normal"
                        placeholder="e.g. Dream Car"
                        autoFocus={!isEditing}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Target className="w-4 h-4 text-emerald-500" />
                        Target Amount
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="input pl-10 text-lg font-medium placeholder:font-normal"
                            placeholder="50000"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-500" />
                            Duration
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={durationValue}
                                onChange={(e) => setDurationValue(e.target.value)}
                                className="input text-center font-bold px-1"
                                required
                            />
                            <select
                                value={durationUnit}
                                onChange={(e) => setDurationUnit(e.target.value)}
                                className="input px-2 text-sm"
                            >
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                                <option value="years">Years</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-emerald-500" />
                            Frequency
                        </label>
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="input"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                </div>

                <div className="text-center text-sm text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-100">
                    Estimated: <span className="text-emerald-600 font-bold text-base">{estimatedSlots}</span> deposits
                </div>

                <button
                    type="submit"
                    className="w-full py-3.5 btn-primary flex items-center justify-center gap-2 group mt-4"
                >
                    {isEditing ? 'Save Changes' : 'Create Goal'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        </div>
    );
}
