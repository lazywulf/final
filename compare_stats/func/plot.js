export function setupCanvas(barChartData, chartContainerName, title = "", xLabel = "", color = "dodgerblue") {
    const svg_width = 700;
    const svg_height = 300;
    const chart_margin = {top:80,right:40,bottom:40,left:80};
    const chart_width = svg_width - (chart_margin.left + chart_margin.right);
    const chart_height = svg_height - (chart_margin.top + chart_margin.bottom);
    
    const this_svg = d3.select(`.${chartContainerName}`).append("svg")
    .attr("width", svg_width).attr("height", svg_height)
    .append("g")
    .attr('transform', `translate(${chart_margin.left}, ${chart_margin.top})`);
    
    const xExtent = d3.extent(barChartData, d=>d.val);
    const xMax = d3.max(barChartData, d=>d.val);
    const xScale_v3 = d3.scaleLinear([0, xMax * 1.1], [0, chart_width]);
    
    const yScale = d3.scaleBand().domain(barChartData.map(d=>d.danceability))
    .rangeRound([1, chart_height])
    .paddingInner(0.05);
    
    const bars = this_svg.selectAll('.bar')
    .data(barChartData)
    .enter()
    .append('rect')
    .attr('class','bar')
    .attr('x',0)
    .attr('y',d => yScale(d.danceability))
    .attr('width',d => xScale_v3(d.val))
    .attr('height',yScale.bandwidth())
    .style('fill', color);

    const header = this_svg.append('g').attr('class','bar-header')
                .attr('transform',`translate(0,${-chart_margin.top/ 2})`)
                .append('text');
    header.append('tspan').text(`${title}`);


    const xAxis = d3.axisTop(xScale_v3)
                    .tickSizeInner(-chart_height)
                    .tickSizeOuter(0); // the boarder line (boarderless)
    const xAxisDraw = this_svg.append('g')
                            .attr('class','x axis')
                            .call(xAxis);
    const yAxis = d3.axisLeft(yScale).tickSize(0);
    const yAxisDraw = this_svg.append('g')
                            .attr('class','y axis')
                            .call(yAxis);
    yAxisDraw.selectAll('text').attr('dx','-0.6em');

    this_svg.append("text")
        .attr("x", chart_width / 2)
        .attr("y", -chart_margin.top / 2 + 25)
        .style("text-anchor", "middle")
        .text(`${xLabel}`);

    this_svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chart_margin.left + 30)
        .attr("x",0 - (chart_height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Danceability (* 0.1)");
}


/////



export function setupCanvas_teach(barChartData, moviesClean) {
    let metric = 'energy'; // let

    
    function click() {
        metric = this.dataset.name;
        update(barChartData);
    }

    function formatTicks(d){
        return d;
    }

    function update(data) {
        xMax = d3.max(data, d => d[metric]);
        xScale_v3 = d3.scaleLinear([0, xMax], [0, chart_width]);
        yScale = d3.scaleBand().domain(data.map(d => d.danceability))
                    .rangeRound([0, chart_height])
                    .paddingInner(0.25);

        const defaultDelay = 1000;
        const transitionDelay = d3.transition().duration(defaultDelay);

        xAxisDraw.transition(transitionDelay).call(xAxis.scale(xScale_v3));
        yAxisDraw.transition(transitionDelay).call(yAxis.scale(yScale));

        header.select('tspan').text(`Top 15 ${metric} movies ${metric === 'popularity'? '': 'in USD'}`);

        bars.selectAll('.bar').data(data, d=>d.danceability).join(
            enter => {
                enter.append('rect').attr('class','bar')
                    .attr('x',0).attr('y',d => yScale(d.danceability))
                    .attr('height',yScale.bandwidth())
                    .style('fill','lightcyan').transition(transitionDelay)
                    .delay((d,i)=>i*20).attr('width',d=>xScale_v3(d[metric])).style('fill', 'dodgerblue')},
            update => {
                update.transition(transitionDelay)
                   .delay((d,i)=>i*20).attr('y', d => yScale(d.danceability))
                    .attr('width',d=>xScale_v3(d[metric]))}, 
            exit => {
                exit.transition()
                .duration(defaultDelay/2).style('fill-opacity',0).remove()});

        d3.selectAll('.bar')
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout);
    }

    d3.selectAll('button').on('click', click);

    console.log(barChartData);
    const svg_width = 700;
    const svg_height = 500;
    const chart_margin = {top: 80, right: 80, bottom: 40, left: 250};
    const chart_width = svg_width - (chart_margin.left + chart_margin.right);
    const chart_height = svg_height - (chart_margin.top + chart_margin.bottom);

    const this_svg = d3.select('.bar-chart-container').append("svg")
                        .attr("width", svg_width).attr("height", svg_height)
                        .append("g")
                        .attr('transform', `translate(${chart_margin.left},${chart_margin.top})`);

    const xExtent = d3.extent(barChartData, d => d[metric]);
    let xMax = d3.max(barChartData, d => d[metric]);
    let xScale_v3 = d3.scaleLinear([0, xMax], [0, chart_width]);

    let yScale = d3.scaleBand().domain(barChartData.map(d=>d["danceability"]))
                    .rangeRound([0, chart_height])
                    .paddingInner(0.25);

    const bars = this_svg.append('g').attr('class','bars');

    let header = this_svg.append('g').attr('class','bar-header')
                .attr('transform',`translate(0,${-chart_margin.top/2})`)
                .append('text');
    header.append('tspan').text('Top 15 xxx movies');
    header.append('tspan').text('Years:2000-2009')
                .attr('x',0).attr('y',20).style('font-size','0.8em').style('fill','#555');


    let xAxis = d3.axisTop(xScale_v3).ticks(5)
                    .tickFormat(formatTicks)
                    .tickSizeInner(-chart_height)
                    .tickSizeOuter(0); // the boarder line (boarderless)
    let xAxisDraw = this_svg.append('g').attr('class','x axis');
    let yAxis = d3.axisLeft(yScale).tickSize(0);
    let yAxisDraw = this_svg.append('g').attr('class','y axis');
    yAxisDraw.selectAll('text').attr('dx','-0.6em');

    update(barChartData);
    

    const tip = d3.select('.tooltip');

    function mouseover(e){
    }

    function mousemove(e){
    }

    function mouseout(e) {
    }
}