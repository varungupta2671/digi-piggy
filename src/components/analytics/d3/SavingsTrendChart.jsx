import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { useTheme } from '../../../context/ThemeContext';

export default function SavingsTrendChart({ transactions }) {
    const svgRef = useRef(null);
    const containerRef = useRef(null); // Ref for the wrapper div to get responsive width
    const { theme } = useTheme();

    const data = useMemo(() => {
        const sortedTx = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
        let currentBalance = 0;
        const points = [];

        if (sortedTx.length > 0) {
            points.push({ date: new Date(sortedTx[0].date), value: 0 });
        } else {
            return [{ date: new Date(), value: 0 }];
        }

        sortedTx.forEach(tx => {
            if (tx.type === 'deposit') currentBalance += tx.amount;
            else if (tx.type === 'withdraw') currentBalance -= tx.amount;
            points.push({ date: new Date(tx.date), value: currentBalance });
        });

        return points;
    }, [transactions]);

    useEffect(() => {
        if (!containerRef.current || data.length === 0) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        // Clear previous
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .style("overflow", "visible");

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value) * 1.1])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Gradient
        const defs = svg.append("defs");
        const gradient = defs.append("linearGradient")
            .attr("id", "savings-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        gradient.append("stop").attr("offset", "0%").attr("stop-color", "#6366f1").attr("stop-opacity", 0.5);
        gradient.append("stop").attr("offset", "100%").attr("stop-color", "#6366f1").attr("stop-opacity", 0);

        // Area generator
        const area = d3.area()
            .x(d => x(d.date))
            .y0(y(0))
            .y1(d => y(d.value))
            .curve(d3.curveMonotoneX);

        // Line generator
        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value))
            .curve(d3.curveMonotoneX);

        // Gridlines
        const yAxisGrid = d3.axisLeft(y).tickSize(-(width - margin.left - margin.right)).tickFormat('').ticks(5);
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxisGrid)
            .style("stroke-dasharray", "3 3")
            .style("color", theme === 'dark' ? '#334155' : '#e2e8f0');

        // Draw Area
        svg.append("path")
            .datum(data)
            .attr("fill", "url(#savings-gradient)")
            .attr("d", area);

        // Draw Line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#6366f1")
            .attr("stroke-width", 3)
            .attr("d", line);

        // Axes
        const xAxis = d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat("%b %d"));
        const yAxis = d3.axisLeft(y).ticks(5).tickFormat(d => `₹${d}`);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(xAxis)
            .attr("color", theme === 'dark' ? '#94a3b8' : '#64748b');

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxis)
            .attr("color", theme === 'dark' ? '#94a3b8' : '#64748b');

        // Interactive Overlay for Tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "d3-tooltip")
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

        const focusCircle = svg.append("circle")
            .attr("r", 5)
            .attr("fill", "#6366f1")
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .style("visibility", "hidden");

        const bisectDate = d3.bisector(d => d.date).left;

        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("mousemove", function (event) {
                const x0 = x.invert(d3.pointer(event)[0]);
                const i = bisectDate(data, x0, 1);
                const d0 = data[i - 1];
                const d1 = data[i];
                const d = x0 - d0.date > d1.date - x0 ? d1 : d0;

                focusCircle
                    .attr("cx", x(d.date))
                    .attr("cy", y(d.value))
                    .style("visibility", "visible");

                tooltip
                    .style("visibility", "visible")
                    .html(`<strong>${d.date.toLocaleDateString()}</strong><br/>Balance: ₹${d.value.toLocaleString()}`)
                    .style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", () => {
                focusCircle.style("visibility", "hidden");
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
