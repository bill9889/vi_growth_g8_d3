// CSV File
const csvFile = "NY_GDP_PCAP_Interpolated_v3.csv"

// Selecting the element
const lineChart = document.getElementById('line-chart');
const legendChart = document.getElementById('line-chart');

// Setting dimensions
const margin = {top: 40, right: 30, bottom: 7, left: 50},
width = 1920 - margin.left - margin.right,
height = 1080 - margin.top - margin.bottom;


var svg = d3.select(lineChart)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


var svg2 = d3.select(legendChart)
    .append("svg")
    .attr("width", 600)
    .attr("height", 300)
    .attr("transform",
          "translate("+ -80 +"," + -450 + ")");

//Read the data
d3.csv(csvFile, function(data) {

    // group the data
    var sumstat = d3.nest()
        .key(function(d) { return d.Country;})
        .entries(data);

    console.log(sumstat)

    // Add X axis 
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.Period; }))
        .range([ 0, width]);


    console.log(x)

    svg.append("g")
        .attr("transform", "translate(0," + height / 2 + ")")
        .style("font-size","12px")
        .call(d3.axisBottom(x).ticks(22).tickFormat(x => `${x}`));

    const xAxisGrid = d3.axisBottom(x).tickSize(-height).tickFormat('').ticks(22);

    svg.append('g')
        .attr('class', 'grid')
        .style('stroke', 'lightgrey')
        .style('stroke-opacity', 0.2)
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxisGrid);    

    // Adjust Limits
    var minGPD = d3.min(data, function(d) { return +d.GPD; });
    var maxGPD = d3.max(data, function(d) { return +d.GPD; });
    var maxLimit = Math.max(Math.abs(minGPD),Math.abs(maxGPD));
    var limit = Math.round(maxLimit) + 1;

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([-limit, limit])
        .range([height, 0]);
    
    svg.append("g")
        .style("font-size","12px")
        .call(d3.axisLeft(y));

    const yAxisGrid = d3.axisLeft(y).tickSize(-width).tickFormat('').ticks(12);

    svg.append('g')
        .attr('class', 'grid')
        .style('stroke', 'lightgrey')
        .style('stroke-opacity', 0.2)
        .call(yAxisGrid);

    // color palette
    var res = sumstat.map(function(d){ return d.key })
    var color = d3.scaleOrdinal()
        .domain(res)
        .range(d3.schemeCategory10)

    const chartSvg = svg.selectAll('.line')
        .data(sumstat)
        .enter();

    // Defining the line path
    const path = chartSvg.append('path')
        .attr("d", function(d){
            return d3.line()
            .x(function(d) { return x(d.Period); })
            .y(function(d) { return y(d.GPD); })
            (d.values)
        })
        .attr('stroke-width', '2')
        .style('fill', 'none')
        .attr("stroke", function(d){ return color(d.key) });

    const length = path.node().getTotalLength(); // Get line length

    // Drawing animated line
    function repeat() {
        path.attr("stroke-dasharray", length + " " + length)
            .attr("stroke-dashoffset", length)
            .transition()
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
            .delay(0)
            .duration(3000)
            .on("end", () => setTimeout(repeat, 500));
    };

    // Run the first time
    repeat()

    svg2.selectAll("mydots")
        .data(sumstat)
        .enter()
        .append("circle")
        .attr("cx", 100)
        .attr("cy", function(d,i){ return 100 + i*25})
        .attr("r", 8)
        .style("fill", function(d){ return color(d.key)})
  
    // Add one dot in the legend for each name.
    svg2.selectAll("mylabels")
        .data(sumstat)
        .enter()
        .append("text")
        .attr("x", 120)
        .attr("y", function(d,i){ return 100 + i*25})
        .style("fill", function(d){ return color(d.key)})
        .text(function(d){ return d.key})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "20px")
        .style('font-family', '"Open Sans", sans-serif')
})
