import * as d3 from 'd3';

const dataDrawer = {
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
        .attr('viewBox', `0 0 ${width} ${height}`) // Set viewBox for scaling
        .attr('preserveAspectRatio', 'xMidYMid meet') // Preserve aspect ratio on resize
        .style('width', width) // Responsive width
        .style('max-width', '100%') // Responsive width
        .style('height', 'auto') // Responsive height
        .style('background', '#f0f0f0')
        .style('overflow', 'visible');

        svg.selectAll('*').remove(); // Clear previous chart content
      
        // Extract unique city names and age groups
        const cities = Array.from(new Set(data.map(d => d.name)));
        const ageGroups = Array.from(new Set(data.map(d => d.ageGroup)));
      
        // Set up scales
        const xScale = d3.scaleBand()
          .domain(cities)
          .range([margin.left, width - margin.right])
          .padding(0.2);
      
        // Calculate the maximum y-axis value from the stacked values
        const maxValue = d3.max(
          cities.map(city => d3.sum(data.filter(d => d.name === city), d => d.value))
        );
      
        const yScale = d3.scaleLinear()
          .domain([0, maxValue]) // Set domain to [0, maxValue] without padding
          .range([height - margin.bottom, margin.top]); // Ensure bars stay within the chart height
      
        const colorScale = d3.scaleOrdinal()
          .domain(ageGroups)
          .range(d3.schemeCategory10);
      
        // Group data by city and stack age groups
        const groupedData = cities.map(city => {
          const cityData = data.filter(d => d.name === city);
          const cityObject = { name: city };
          ageGroups.forEach(ageGroup => {
            const found = cityData.find(d => d.ageGroup === ageGroup);
            cityObject[ageGroup] = found ? found.value : 0;
          });
          return cityObject;
        });
      
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
          .attr('y', d => yScale(d[1])) // Corrected y positioning based on yScale
          .attr('height', d => yScale(d[0]) - yScale(d[1])) // Ensure height is calculated correctly
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
          .attr("transform", `translate(${margin.left}, ${height - margin.bottom + 40})`); // Position below the chart
      
        ageGroups.forEach((ageGroup, index) => {
          legend.append("rect")
            .attr("x", index * 120) // Adjust horizontal spacing as needed
            .attr("y", 0)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", colorScale(ageGroup));
      
          legend.append("text")
            .attr("x", index * 120 + 25) // Position text beside the rect
            .attr("y", 15)
            .text(ageGroup)
            .attr("alignment-baseline", "middle");
        }); 
        
        // ----------------------------

            // Specify the chart’s dimensions.
        // const marginTop = 10;
        // const marginRight = 10;
        // const marginBottom = 20;
        // const marginLeft = 40;

        // console.log('data', data)
        // // Determine the series that need to be stacked.
        // const series = d3.stack()
        //     .keys(d3.union(data.map(d => d.ageGroup))) // distinct series keys, in input order
        //     .value(([, D], key) => D.get(key).values.length) // get value for each series key and stack
        //     (d3.index(data, d => d.city, d => d.ageGroup)); // group by stack then series key

        // // Prepare the scales for positional and color encodings.
        // const x = d3.scaleBand()
        //     .domain(d3.groupSort(data, D => -d3.sum(D, d => d.values.length), d => d.city))
        //     .range([marginLeft, width - marginRight])
        //     .padding(0.1);

        // const y = d3.scaleLinear()
        //     .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        //     .rangeRound([height - marginBottom, marginTop]);

        // const color = d3.scaleOrdinal()
        //     .domain(series.map(d => d.key))
        //     .range(d3.schemeSpectral[series.length])
        //     .unknown("#ccc");

        // // A function to format the value in the tooltip.
        // const formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

        // // Create the SVG container.
        // const svg = d3.select(root)
        //     .attr("width", width)
        //     .attr("height", height)
        //     .attr("viewBox", [0, 0, width, height])
        //     .attr("style", "max-width: 100%; height: auto;");

        // // Append a group for each series, and a rect for each element in the series.
        // svg.append("g")
        //     .selectAll()
        //     .data(series)
        //     .join("g")
        //     .attr("fill", d => color(d.key))
        //     .selectAll("rect")
        //     .data(D => D.map(d => (d.key = D.key, d)))
        //     .join("rect")
        //     .attr("x", d => x(d.data[0]))
        //     .attr("y", d => y(d[1]))
        //     .attr("height", d => y(d[0]) - y(d[1]))
        //     .attr("width", x.bandwidth())
        //     .append("title")
        //     .text(d => `${d.data[0]} ${d.key}\n${formatValue(d.data[1].get(d.key).values.length)}`);

        // // Append the horizontal axis.
        // svg.append("g")
        //     .attr("transform", `translate(0,${height - marginBottom})`)
        //     .call(d3.axisBottom(x).tickSizeOuter(0))
        //     .call(g => g.selectAll(".domain").remove());

        // // Append the vertical axis.
        // svg.append("g")
        //     .attr("transform", `translate(${marginLeft},0)`)
        //     .call(d3.axisLeft(y).ticks(null, "s"))
        //     .call(g => g.selectAll(".domain").remove());

        // Object.assign(svg.node(), {scales: {color}});
    }
}

export default dataDrawer;