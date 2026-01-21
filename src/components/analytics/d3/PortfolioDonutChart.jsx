import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { useTheme } from '../../../context/ThemeContext';

export default function PortfolioDonutChart({ goals }) {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const { theme } = useTheme();

    const data = useMemo(() => {
        return goals
            .map(g => {
                const saved = g.savingsPlan
                    .filter(bit => bit.status === 'paid')
                    .reduce((sum, bit) => sum + bit.amount, 0);
                return { name: g.name, value: saved };
            })
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);
    }, [goals]);

    useEffect(() => {
        if (!containerRef.current || data.length === 0) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = 300;
        const radius = Math.min(width, height) / 2;

        // Clear previous
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.name))
            .range(['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#ef4444', '#f59e0b', '#10b981', '#3b82f6']);

        const pie = d3.pie()
            .value(d => d.value)
            .padAngle(0.02)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(radius * 0.6)
            .outerRadius(radius * 0.9);

        const arcHover = d3.arc()
            .innerRadius(radius * 0.6)
            .outerRadius(radius * 0.95);

        // Tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "d3-donut-tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", theme === 'dark' ? '#1e293b' : '#fff')
            .style("color", theme === 'dark' ? '#fff' : '#0f172a')
            .style("padding", "8px 12px")
            .style("border-radius", "8px")
            .style("box-shadow", "0 4px 6px -1px rgba(0, 0, 0, 0.1)")
            .style("pointer-events", "none")
            .style("font-size", "12px")
            .style("z-index", 100);

        // Draw Arcs
        svg.selectAll('path')
            .data(pie(data))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.name))
            .style("cursor", "pointer")
            .on("mouseover", function (event, d) {
                d3.select(this).transition().duration(200).attr('d', arcHover);
                tooltip.style("visibility", "visible")
                    .html(`<strong>${d.data.name}</strong><br/>₹${d.data.value.toLocaleString()}`);
            })
            .on("mousemove", function (event) {
                tooltip.style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function () {
                d3.select(this).transition().duration(200).attr('d', arc);
                tooltip.style("visibility", "hidden");
            });

        // Center Text
        const totalSaved = data.reduce((acc, curr) => acc + curr.value, 0);

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "-0.5em")
            .style("font-size", "14px")
            .style("fill", theme === 'dark' ? '#94a3b8' : '#64748b')
            .text("Total Saved");

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "1em")
            .style("font-size", "24px")
            .style("font-weight", "bold")
            .style("fill", theme === 'dark' ? '#fff' : '#1e293b')
            .text(`₹${totalSaved.toLocaleString()}`);

        return () => tooltip.remove();

    }, [data, theme]);

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                No savings data yet
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center">
            <svg ref={svgRef}></svg>
        </div>
    );
}
