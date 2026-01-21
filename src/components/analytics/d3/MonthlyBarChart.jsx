import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { useTheme } from '../../../context/ThemeContext';

export default function MonthlyBarChart({ transactions }) {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const { theme } = useTheme();

    const data = useMemo(() => {
        const months = {};
        transactions.forEach(tx => {
            const date = new Date(tx.date);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
            if (!months[monthKey]) months[monthKey] = { name: monthKey, deposits: 0, withdrawals: 0 };
            if (tx.type === 'deposit') months[monthKey].deposits += tx.amount;
            else if (tx.type === 'withdraw') months[monthKey].withdrawals += tx.amount;
        });
        return Object.values(months).slice(-6); // Last 6 months
    }, [transactions]);

    useEffect(() => {
        if (!containerRef.current || data.length === 0) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const x0 = d3.scaleBand()
            .domain(data.map(d => d.name))
            .rangeRound([margin.left, width - margin.right])
            .paddingInner(0.1);

        const x1 = d3.scaleBand()
            .domain(['deposits', 'withdrawals'])
            .rangeRound([0, x0.bandwidth()])
            .padding(0.05);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.deposits, d.withdrawals)) * 1.1])
            .nice()
            .rangeRound([height - margin.bottom, margin.top]);

        const color = d3.scaleOrdinal()
            .domain(['deposits', 'withdrawals'])
            .range(['#10b981', '#ef4444']);

        // Grid
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickSize(-(width - margin.left - margin.right)).tickFormat('').ticks(5))
            .style("stroke-dasharray", "3 3")
            .style("color", theme === 'dark' ? '#334155' : '#e2e8f0')
            .style("opacity", 0.5);

        // Bars
        const barGroup = svg.append("g")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("transform", d => `translate(${x0(d.name)},0)`);

        barGroup.selectAll("rect")
            .data(d => ['deposits', 'withdrawals'].map(key => ({ key, value: d[key] })))
            .join("rect")
            .attr("x", d => x1(d.key))
            .attr("y", d => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", d => y(0) - y(d.value))
            .attr("fill", d => color(d.key))
            .attr("rx", 4);

        // Axes
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x0).tickSize(0))
            .call(g => g.select(".domain").remove())
            .attr("color", theme === 'dark' ? '#94a3b8' : '#64748b');

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(5).tickFormat(d => `₹${d}`))
            .call(g => g.select(".domain").remove())
            .attr("color", theme === 'dark' ? '#94a3b8' : '#64748b');

        // Tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "d3-bar-tooltip")
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

        barGroup.selectAll("rect")
            .on("mouseover", function (event, d) {
                d3.select(this).style("opacity", 0.8);
                tooltip.style("visibility", "visible")
                    .html(`<strong>${d.key === 'deposits' ? 'Deposited' : 'Withdrawn'}</strong><br/>₹${d.value.toLocaleString()}`);
            })
            .on("mousemove", function (event) {
                tooltip.style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function () {
                d3.select(this).style("opacity", 1);
                tooltip.style("visibility", "hidden");
            });

        return () => tooltip.remove();

    }, [data, theme]);

    return (
        <div ref={containerRef} className="w-full h-full">
            <svg ref={svgRef}></svg>
        </div>
    );
}
