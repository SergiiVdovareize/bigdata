import * as d3 from 'd3';

const spendingBuilder = {
    draw: (data, root, w = 800, h = 500) => {
        // const groupedData = d3.rollups(
        //     data,
        //     v => d3.sum(v, d => d.spending),
        //     d => d.month,
        //     d => d.product
        // );

        // const preparedData = Array.from(groupedData, ([month, products]) => {
        //     const productSpending = Object.fromEntries(products);
        //     return { month, ...productSpending };
        // });


        // -----------------------------------

        const margin = { top: 20, right: 100, bottom: 50, left: 50 };
        const width = w - margin.left - margin.right;
        const height = h - margin.top - margin.bottom;

        const svg = d3.select(root)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Prepare data

        const groupedData = d3.rollups(
            data,
            v => d3.sum(v, d => d.spending),
            d => d.month,
            d => d.product
        );

        const preparedData = Array.from(groupedData, ([month, products]) => {
            const productSpending = Object.fromEntries(products);
            return { month, ...productSpending };
        });

        // Define months as categorical data
        const months = preparedData.map(d => d.month);

        // X and Y scales
        const xScale = d3.scaleBand()
            .domain(months)
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(preparedData, d => d3.max(Object.values(d).slice(1)))])
            .range([height, 0]);

        // X and Y axes
        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale).tickFormat(d => `Month ${d}`));

        svg.append('g')
            .call(d3.axisLeft(yScale));

        // Colors for each product line
        const colors = d3.scaleOrdinal(d3.schemeCategory10);

        // Line generator function
        const line = d3.line()
            .x(d => xScale(d.month) + xScale.bandwidth() / 2)
            .y(d => yScale(d.spending));

        // Draw lines for each product
        const products = Object.keys(preparedData[0]).slice(1);

        products.forEach(product => {
            const productData = preparedData.map(d => ({
                month: d.month,
                spending: d[product] || 0
            }));

            svg.append('path')
                .datum(productData)
                .attr('fill', 'none')
                .attr('stroke', colors(product))
                .attr('stroke-width', 2)
                .attr('d', line);
        });

        // Add labels for each line
        products.forEach((product) => {
            const lastPoint = preparedData[preparedData.length - 1];
            svg.append('text')
                .attr('x', width + 5)
                .attr('y', yScale(lastPoint[product] || 0))
                .attr('fill', colors(product))
                .text(product);
        });
    }
}

export default spendingBuilder