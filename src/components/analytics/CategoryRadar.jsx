import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { usePiggy } from '../../context/PiggyContext';
import { useTheme } from '../../context/ThemeContext';

export default function CategoryRadar() {
    const { goals } = usePiggy();
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const { theme } = useTheme();

    const data = useMemo(() => {
        const categories = {};
        goals.forEach(goal => {
            const cat = goal.category ? goal.category.charAt(0).toUpperCase() + goal.category.slice(1) : 'Other';
            if (!categories[cat]) categories[cat] = 0;
            const saved = goal.savingsPlan
                .filter(bit => bit.status === 'paid')
                .reduce((sum, bit) => sum + bit.amount, 0);
            categories[cat] += saved;
        });

        const maxVal = Math.max(...Object.values(categories), 1); // Avoid 0
        return Object.keys(categories).map(key => ({
            axis: key,
            value: categories[key],
            normalized: categories[key] / maxVal
        }));
    }, [goals]);

    useEffect(() => {
        if (!containerRef.current || data.length < 3) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = 300;
        const margin = 40;
        const radius = Math.min(width, height) / 2 - margin;
        const angleSlice = (Math.PI * 2) / data.length;

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        // Draw Grid Circles
        const levels = 5;
        const rScale = d3.scaleLinear().range([0, radius]).domain([0, 1]);

        for (let i = 0; i < levels; i++) {
            const levelFactor = radius * ((i + 1) / levels);
            svg.selectAll(".levels")
                .data([1])
                .enter()
                .append("circle")
                .attr("r", levelFactor)
                .style("fill", "none")
                .style("stroke", theme === 'dark' ? '#334155' : '#e2e8f0')
                .style("stroke-opacity", "0.7");
        }

        // Draw Axes
        const axis = svg.selectAll(".axis")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "axis");

        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d, i) => rScale(1.1) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("y2", (d, i) => rScale(1.1) * Math.sin(angleSlice * i - Math.PI / 2))
            .attr("class", "line")
            .style("stroke", theme === 'dark' ? '#334155' : '#e2e8f0')
            .style("stroke-width", "1px");

        axis.append("text")
            .attr("class", "legend")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", (d, i) => rScale(1.2) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("y", (d, i) => rScale(1.2) * Math.sin(angleSlice * i - Math.PI / 2))
            .text(d => d.axis)
            .style("fill", theme === 'dark' ? '#94a3b8' : '#64748b');

        // Draw Radar Blob
        const radarLine = d3.lineRadial()
            .curve(d3.curveLinearClosed)
            .radius(d => rScale(d.normalized))
            .angle((d, i) => i * angleSlice);

        svg.append("path")
            .datum(data)
            .attr("d", radarLine)
            .style("fill", "#8b5cf6")
            .style("fill-opacity", 0.5)
            .style("stroke", "#8b5cf6")
            .style("stroke-width", 2);

        // Tooltip interaction points
        svg.selectAll(".radarCircle")
            .data(data)
            .enter().append("circle")
            .attr("class", "radarCircle")
            .attr("r", 4)
            .attr("cx", (d, i) => rScale(d.normalized) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("cy", (d, i) => rScale(d.normalized) * Math.sin(angleSlice * i - Math.PI / 2))
            .style("fill", "#8b5cf6")
            .style("fill-opacity", 0.8)
            .append("title")
            .text(d => `₹${d.value.toLocaleString()}`);

    }, [data, theme]);

    if (data.length < 3) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Need goals in at least 3 categories
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full h-full">
            <svg ref={svgRef}></svg>
        </div>
    );
}
