import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { useTheme } from '../../context/ThemeContext';

export default function SavingsHeatmap({ transactions }) {
    const svgRef = useRef(null);
    const { theme } = useTheme();

    const data = useMemo(() => {
        // Aggregate savings by date
        const counts = {};
        transactions.forEach(tx => {
            if (tx.type === 'deposit') {
                const date = tx.date.split('T')[0];
                counts[date] = (counts[date] || 0) + tx.amount;
            }
        });
        return counts;
    }, [transactions]);

    useEffect(() => {
        if (!svgRef.current || Object.keys(data).length === 0) return;

        // Clear previous render
        d3.select(svgRef.current).selectAll("*").remove();

        // Config
        const width = 800; // Fixed width for scroll container handles resizing better
        const cellSize = 12;
        const cellMargin = 2;
        const yearHeight = cellSize * 7 + 20; // 7 days + padding

        // Date range (Last 365 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 365);

        // Generate full date range
        const dates = d3.timeDays(startDate, endDate);

        // Scales
        const maxVal = d3.max(Object.values(data)) || 100;
        const colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateEmerald)
            .domain([0, maxVal]);

        // Tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "heatmap-tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", theme === 'dark' ? '#1e293b' : '#fff')
            .style("color", theme === 'dark' ? '#fff' : '#0f172a')
            .style("padding", "8px")
            .style("border-radius", "6px")
            .style("font-size", "12px")
            .style("box-shadow", "0 4px 6px -1px rgba(0, 0, 0, 0.1)")
            .style("pointer-events", "none")
            .style("z-index", "50");

        // SVG Container
        const svg = d3.select(svgRef.current)
            .attr("width", "100%")
            .attr("viewBox", `0 0 ${width} ${yearHeight + 20}`)
            .append("g")
            .attr("transform", "translate(40, 20)");

        // Render Cells
        svg.selectAll("rect")
            .data(dates)
            .enter()
            .append("rect")
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("x", d => d3.timeWeek.count(startDate, d) * (cellSize + cellMargin))
            .attr("y", d => d.getDay() * (cellSize + cellMargin))
            .attr("rx", 2)
            .attr("fill", d => {
                const dayStr = d.toISOString().split('T')[0];
                const val = data[dayStr] || 0;
                return val > 0 ? colorScale(val) : (theme === 'dark' ? '#334155' : '#e2e8f0');
            })
            .on("mouseover", function (event, d) {
                const dayStr = d.toISOString().split('T')[0];
                const val = data[dayStr] || 0;
                d3.select(this).attr("stroke", "#6366f1").attr("stroke-width", 2);
                tooltip.style("visibility", "visible")
                    .html(`<strong>${d.toLocaleDateString()}</strong><br/>Saved: ₹${val.toLocaleString()}`);
            })
            .on("mousemove", function (event) {
                tooltip.style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function () {
                d3.select(this).attr("stroke", "none");
                tooltip.style("visibility", "hidden");
            });

        // Add Month Labels
        const months = d3.timeMonths(startDate, endDate);
        svg.selectAll("text.month")
            .data(months)
            .enter()
            .append("text")
            .attr("x", d => d3.timeWeek.count(startDate, d) * (cellSize + cellMargin))
            .attr("y", -6)
            .text(d => d.toLocaleString('default', { month: 'short' }))
            .attr("fill", theme === 'dark' ? '#94a3b8' : '#64748b')
            .style("font-size", "10px");

        // Add Day Labels
        const dayLabels = ["Mon", "Wed", "Fri"];
        svg.selectAll("text.day")
            .data(dayLabels)
            .enter()
            .append("text")
            .attr("x", -5)
            .attr("y", (d, i) => (i * 2 + 1) * (cellSize + cellMargin) + 9)
            .attr("text-anchor", "end")
            .text(d => d)
            .attr("fill", theme === 'dark' ? '#94a3b8' : '#64748b')
            .style("font-size", "9px");

        return () => tooltip.remove();

    }, [data, theme]);

    return (
        <div className="w-full overflow-x-auto">
            <svg ref={svgRef}></svg>
        </div>
    );
}
