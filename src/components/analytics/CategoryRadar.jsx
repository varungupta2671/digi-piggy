import React, { useMemo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { usePiggy } from '../../context/PiggyContext';

export default function CategoryRadar() {
    const { goals } = usePiggy();

    const data = useMemo(() => {
        const categories = {};

        goals.forEach(goal => {
            const cat = goal.category ? goal.category.charAt(0).toUpperCase() + goal.category.slice(1) : 'Other';
            if (!categories[cat]) categories[cat] = 0;

            // Calculate saved amount for this goal
            const saved = goal.savingsPlan
                .filter(bit => bit.status === 'paid')
                .reduce((sum, bit) => sum + bit.amount, 0);

            categories[cat] += saved;
        });

        return Object.keys(categories).map(key => ({
            subject: key,
            A: categories[key],
            fullMark: Math.max(...Object.values(categories))
        }));
    }, [goals]);

    if (data.length < 3) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Need goals in at least 3 diff categories
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid opacity={0.5} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                <Radar
                    name="Savings by Category"
                    dataKey="A"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="#8b5cf6"
                    fillOpacity={0.5}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
}
