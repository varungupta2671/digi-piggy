import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { useTheme } from '../../../context/ThemeContext';

export default function ForecastAreaChart({ goals, transactions }) {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const { theme } = useTheme();

    const data = useMemo(() => {
        if (transactions.length < 2) return [];

        // 1. Calculate Velocity
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        const recentTx = transactions.filter(tx => new Date(tx.date) >= thirtyDaysAgo && tx.type === 'deposit');
        const recentSavings = recentTx.reduce((sum, tx) => sum + tx.amount, 0);
        const days = Math.max(1, (now - thirtyDaysAgo) / (1000 * 60 * 60 * 24));
        const dailyRate = recentSavings / days;

        if (dailyRate === 0) return [];

        let currentTotal = goals.reduce((acc, g) => {
            const saved = g.savingsPlan
                .filter(bit => bit.status === 'paid')
                .reduce((sum, bit) => sum + bit.amount, 0);
            return acc + saved;
        }, 0);

        const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);

        // Generate points
        const points = [];
        let projectedAmount = currentTotal;
        let currentDate = new Date();

        points.push({ date: new Date(currentDate), value: Math.round(projectedAmount), type: 'current' });

        let loops = 0;
        while (projectedAmount < totalTarget && loops < 12) {
            loops++;
            currentDate.setMonth(currentDate.getMonth() + 1);
            projectedAmount += dailyRate * 30;
            points.push({ date: new Date(currentDate), value: Math.round(projectedAmount), type: 'projected' });
        }

        return { points, totalTarget };
    }, [goals, transactions]);

    useEffect(() => {
        if (!containerRef.current || !data.points || data.points.length === 0) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const x = d3.scaleTime()
            .domain(d3.extent(data.points, d => d.date))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, Math.max(data.totalTarget, d3.max(data.points, d => d.value) * 1.1)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Gradient
        const defs = svg.append("defs");
        const gradient = defs.append("linearGradient")
            .attr("id", "forecast-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        gradient.append("stop").attr("offset", "0%").attr("stop-color", "#10b981").attr("stop-opacity", 0.5);
        gradient.append("stop").attr("offset", "100%").attr("stop-color", "#10b981").attr("stop-opacity", 0);

        // Area
        const area = d3.area()
            .x(d => x(d.date))
            .y0(y(0))
            .y1(d => y(d.value))
            .curve(d3.curveMonotoneX);

        // Line
        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value))
            .curve(d3.curveMonotoneX);

        // Draw Area
        svg.append("path")
            .datum(data.points)
            .attr("fill", "url(#forecast-gradient)")
            .attr("d", area);

        // Draw Line (Dashed)
        svg.append("path")
            .datum(data.points)
            .attr("fill", "none")
            .attr("stroke", "#10b981")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5 5")
            .attr("d", line);

        // Target Line
        svg.append("line")
            .attr("x1", margin.left)
            .attr("x2", width - margin.right)
            .attr("y1", y(data.totalTarget))
            .attr("y2", y(data.totalTarget))
            .attr("stroke", "#ef4444")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "3 3");

        svg.append("text")
            .attr("x", width - margin.right)
            .attr("y", y(data.totalTarget) - 5)
            .attr("text-anchor", "end")
            .attr("fill", "#ef4444")
            .style("font-size", "10px")
            .text("Goal Target");

        // Axes
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat("%b %Y")))
            .attr("color", theme === 'dark' ? '#94a3b8' : '#64748b');

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(5).tickFormat(d => `₹${d}`))
            .attr("color", theme === 'dark' ? '#94a3b8' : '#64748b');

    }, [data, theme]);

    if (!data.points || data.points.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Need more history to forecast
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full h-full">
            <svg ref={svgRef}></svg>
        </div>
    );
}
