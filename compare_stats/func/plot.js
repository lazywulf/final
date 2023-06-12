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

export function chooseData(metric, moviesClean) {
    const thisData = moviesClean.sort((a, b) => b[metric] - a[metric]).filter((d, i) => i < 15);
    return thisData;
}

export function setupCanvas_teach(barChartData, moviesClean) {
    let metric = 'energy'; // let

    
    function click() {
        metric = this.dataset.name;
        const thisData = chooseData(metric, moviesClean);
        update(thisData);
    }

    function formatTicks(d){
        // "~" is for large data '~s"
        return d3.format('.2s')(d)
            .replace('M','mil')
            .replace('G','bil')
            .replace('T','tri')
    }

    d3.selectAll('button').on('click', click);

    function update(data) {
        console.log(data[metric]);
        xMax = d3.max(data, d => d[metric]);
        xScale_v3 = d3.scaleLinear([0, xMax], [0, chart_width]);
        yScale = d3.scaleBand().domain(data.map(d => d.title))
                    .rangeRound([0, chart_height])
                    .paddingInner(0.25);

        const defaultDelay = 1000;
        const transitionDelay = d3.transition().duration(defaultDelay);

        xAxisDraw.transition(transitionDelay).call(xAxis.scale(xScale_v3));
        yAxisDraw.transition(transitionDelay).call(yAxis.scale(yScale));

        header.select('tspan').text(`Top 15 ${metric} movies ${metric === 'popularity'? '': 'in USD'}`);

        bars.selectAll('.bar').data(data, d=>d.title).join(
            enter => {
                enter.append('rect').attr('class','bar')
                    .attr('x',0).attr('y',d=>yScale(d.title))
                    .attr('height',yScale.bandwidth())
                    .style('fill','lightcyan').transition(transitionDelay)
                    .delay((d,i)=>i*20).attr('width',d=>xScale_v3(d[metric])).style('fill', 'dodgerblue')},
            update => {
                update.transition(transitionDelay)
                   .delay((d,i)=>i*20).attr('y',d=>yScale(d.title))
                    .attr('width',d=>xScale_v3(d[metric]))}, 
            exit => {
                exit.transition()
                .duration(defaultDelay/2).style('fill-opacity',0).remove()});

        d3.selectAll('.bar')
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout);
    }

    console.log(barChartData);
    let temp = chooseData("energy", moviesClean)
    const svg_width = 700;
    const svg_height = 500;
    const chart_margin = {top: 80, right: 80, bottom: 40, left: 250};
    const chart_width = svg_width - (chart_margin.left + chart_margin.right);
    const chart_height = svg_height - (chart_margin.top + chart_margin.bottom);

    // caution: this is important
    // '.' gets the class
    // g group here! 
    // mind the usage of `${<attr>}`: like py format
    const this_svg = d3.select('.bar-chart-container').append("svg")
                        .attr("width", svg_width).attr("height", svg_height)
                        .append("g")
                        .attr('transform', `translate(${chart_margin.left},${chart_margin.top})`);

    // scale
    const xExtent = d3.extent(barChartData, d=>d.revenue);
    // const xScale_v1 = d3.scaleLinear().domain(xExtent).range([0,chart_width]);
    let xMax = d3.max(barChartData, d=>d.revenue);
    // constxScale_v2 = d3.scaleLinear().domain([0, xMax]).range([0,chart_width]);
    let xScale_v3 = d3.scaleLinear([0,xMax],[0, chart_width]);

    // const yScale = d3.scaleBand().domain(barChartData.map(d=>d.genre))
    //                 .rangeRound([0, chart_height])
    //                 .paddingInner(0.25);
    let yScale = d3.scaleBand().domain(barChartData.map(d=>d.title))
                    .rangeRound([0, chart_height])
                    .paddingInner(0.25);

    // const bars = this_svg.selectAll('.bar')
    //                 .data(barChartData)
    //                 .enter()
    //                 .append('rect')
    //                 .attr('class','bar')
    //                 .attr('x',0)
    //                 .attr('y',d => yScale(d.genre))
    //                 .attr('width',d => xScale_v3(d.revenue))
    //                 .attr('height',yScale.bandwidth())
    //                 .style('fill', 'dodgerblue');
    
    const bars = this_svg.append('g').attr('class','bars');

    let header = this_svg.append('g').attr('class','bar-header')
                .attr('transform',`translate(0,${-chart_margin.top/2})`)
                .append('text');
    header.append('tspan').text('Top 15 xxx movies');
    header.append('tspan').text('Years:2000-2009')
                .attr('x',0).attr('y',20).style('font-size','0.8em').style('fill','#555');


    // tickSizeInner: the length of the tick lines
    //tickSizeOuter: the length of the square ends of the domain path
    let xAxis = d3.axisTop(xScale_v3).ticks(5)
                    .tickFormat(formatTicks)
                    .tickSizeInner(-chart_height)
                    .tickSizeOuter(0); // the boarder line (boarderless)
    // const xAxisDraw = this_svg.append('g')
    //                         .attr('class','x axis')
    //                         .call(xAxis);
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