d3.csv("../data/Spotify_Youtube.csv").then(
    data => {
    // 資料處理
    data.forEach(function (d) {
        d.Artist = d.Artist.toString();;
        d.Views = +d.Views;
        d.Stream = d.Stream.toString();
    });

    // 加總每位artist的views
    const artistViews = data.reduce(function (acc, d) {
        if (acc[d.Artist]) {
            acc[d.Artist] += d.Views;
        } else {
            acc[d.Artist] = d.Views;
        }
        return acc;
    },{});

    // 輸出每位artist的總views數(檢查用)
    for (const artist in artistViews) {
        console.log("Artist:", artist, "Total views:", artistViews[artist]);
    }
    // 儲存top_10的artist及其views
    const top_10_data = Object.entries(artistViews)
        .map(([artist, views]) => ({ label: artist, value: views }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
    console.log(top_10_data);

    // SVG 圖表尺寸
    const width = 600;
    const height = 600;
    const radius = Math.min(width, height) / 2.5;

    // 顏色比例尺
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // 建立 SVG 元素
    const svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "chart-container") 
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // 繪製圓餅圖
    const pie = d3.pie()
        .value(d => d.value);
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
    const arcs = svg.selectAll("arc")
        .data(pie(top_10_data))
        .enter()
        .append("g")
        .on("mouseover", function (d) {
            d3.select(this)
                .select("path")
                .attr("transform", "scale(1.1)") 
                .transition()
                .duration(500)
                .style("filter", "drop-shadow(2px 4px 6px black)")
                .style('transform', 'scale(1.1)')
            d3.select(this)
                .select("text")
                .style("display", "block"); 
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .select("path")
                .attr("transform", "scale(1)") 
                .transition()
                .duration(500)
                .style("filter", "drop-shadow(0 0 0 black)")
                .style('transform', 'scale(1)')
            d3.select(this)
                .select("text")
                .style("display", "none"); 
        });
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i));

    // 加入圓餅圖標籤
    arcs.append("text")
        .attr("dy", "290px") 
        .attr("text-anchor", "middle")
        .style("display", "none") 
        .style("font-size", "20px")  
        .style("font-family", "Arial") 
        .style("font-weight", "bold") 
        .text(d => `Artist:  ${d.data.label},Views: ${d.data.value}`);
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")  
        .style("font-family", "Arial") 
        .style("font-weight", "bold") 
        .text((d, i) => `Top ${i + 1}`);

    // 加入圓餅圖標題
    const title = "Top 10 Artists' Views";
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-280px") 
        .style("font-family", "Arial") 
        .style("font-weight", "bold")
        .style("font-size", "20px")
        .text(title);
});






