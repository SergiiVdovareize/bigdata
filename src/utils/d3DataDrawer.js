import * as d3 from 'd3';

const d3DataDrawer = {
    drawPie: (data, root, w = 928, h = 500) => {
        const width = w;
        const height = Math.min(width, h);

        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.name))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

        // Create the pie layout and arc generator.
        const pie = d3.pie()
            .sort(null)
            .value(d => d.value);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(width, height) / 2 - 1);

        const labelRadius = arc.outerRadius()() * 0.8;

        // A separate arc generator for labels.
        const arcLabel = d3.arc()
            .innerRadius(labelRadius)
            .outerRadius(labelRadius);

        const arcs = pie(data);

        const svg = d3.select(root)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

        // Add a sector path for each value.
        svg.append("g")
            .attr("stroke", "white")
        .selectAll()
        .data(arcs)
        .join("path")
            .attr("fill", d => color(d.data.name))
            .attr("d", arc)
        .append("title")
            .text(d => `${d.data.name}: ${d.data.value}`);

        // Create a new arc generator to place a label close to the edge.
        // The label shows the value if there is enough room.
        svg.append("g")
            .attr("text-anchor", "middle")
        .selectAll()
        .data(arcs)
        .join("text")
            .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
            .call(text => text.append("tspan")
                .attr("y", "-0.4em")
                .attr("font-weight", "bold")
                .text(d => d.data.name))
            .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                .attr("x", 0)
                .attr("y", "0.7em")
                .attr("fill-opacity", 0.7)
                .text(d => d.data.value));

        // return svg.node();
    },

    drawStackedBar: (data, root, width = 928, height = 500) => {
        const margin = { top: 20, right: 30, bottom: 50, left: 60 };

        // Clear existing content in the SVG
        const svg = d3.select(root)
            .attr('viewBox', `0 0 ${width} ${height+90}`) // Set viewBox for scaling
            .attr('preserveAspectRatio', 'xMidYMid meet') // Preserve aspect ratio on resize
            .style('width', width) // Responsive width
            .style('max-width', '100%') // Responsive width
            .style('height', 'auto') // Responsive height
            .style('background', '#f0f0f0')
            .style('overflow', 'visible');
            
        svg.selectAll('*').remove(); // Clear previous chart content

        // Extract unique age groups
        const ageGroups = Array.from(new Set(data.map(d => d.ageGroup)));
        ageGroups.sort((a, b) => (parseInt(a) - parseInt(b)))

     // Group data by city and calculate the total value for sorting
        const groupedData = d3.groups(data, d => d.name).map(([name, values]) => {
            const totalValue = d3.sum(values, d => d.value);
            const cityData = { name, totalValue };
            ageGroups.forEach(ageGroup => {
            const found = values.find(d => d.ageGroup === ageGroup);
            cityData[ageGroup] = found ? found.value : 0;
            });
            return cityData;
        });

        // Sort groupedData by total value
        groupedData.sort((a, b) => b.totalValue - a.totalValue);

        // Set up scales
        const xScale = d3.scaleBand()
            .domain(groupedData.map(d => d.name)) // Use sorted city names
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(groupedData, d => d.totalValue)])
            .range([height - margin.bottom, margin.top]);

        const colorScale = d3.scaleOrdinal()
            .domain(ageGroups)
            .range(d3.schemeCategory10);

        // Stack data
        const stackedData = d3.stack()
            .keys(ageGroups)(groupedData);

        // Draw bars
        svg.selectAll('.layer')
            .data(stackedData)
            .join('g')
            .attr('class', 'layer')
            .attr('fill', ({ key }) => colorScale(key))
            .selectAll('rect')
            .data(d => d)
            .join('rect')
            .attr('x', d => xScale(d.data.name))
            .attr('y', d => yScale(d[1]))
            .attr('height', d => yScale(d[0]) - yScale(d[1]))
            .attr('width', xScale.bandwidth());

        // Add X axis
        svg.append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale));

        // Add Legend
        const legend = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${height - margin.bottom + 80})`);

        ageGroups.forEach((ageGroup, index) => {
            legend.append("rect")
            .attr("x", index * 120)
            .attr("y", 0)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", colorScale(ageGroup));

            legend.append("text")
            .attr("x", index * 120 + 25)
            .attr("y", 12)
            .text(ageGroup)
            .attr("alignment-baseline", "middle");
        });
    }
}

export default d3DataDrawer;