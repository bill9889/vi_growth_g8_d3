// CSV File
const csvFile = "NY_GDP_PCAP_Interpolated_v3.csv"

// Selecting the element
const element = document.getElementById('line-chart');

// Setting dimensions
const margin = {top: 40, right: 30, bottom: 7, left: 50},
    width = 1280 - margin.left - margin.right,
    height = 720 - margin.top - margin.bottom;


var svg = d3.select(element)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv(csvFile, function(data) {

    // group the data
    var sumstat = d3.nest()
    .key(function(d) { return d.Country;})
    .entries(data);

    // Add X axis 
    var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.Period; }))
    .range([ 0, width ]);
    svg.append("g")
    .attr("transform", "translate(0," + height / 2 + ")")
    .call(d3.axisBottom(x).ticks(21));

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return +d.GPD; }), 
            d3.max(data, function(d) { return +d.GPD; })])
    .range([ height, 0 ]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // color palette
    var res = sumstat.map(function(d){ return d.key }) // list of group names
    var color = d3.scaleOrdinal()
    .domain(res)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

    const chartSvg = svg.selectAll('.line')
    .data(sumstat)
    .enter();


    // Defining the line path
    const path = chartSvg.append('path')
        .attr("d", function(d){
            return d3.line()
            .x(function(d) { return x(d.Period); })
            .y(function(d) { return y(+d.GPD); })
            (d.values)
        })
        .attr('stroke-width', '2')
        .style('fill', 'none')
        .attr("stroke", function(d){ return color(d.key) });

    const length = path.node().getTotalLength(); // Get line length

    // Drawing animated line
    path.attr("stroke-dasharray", length + " " + length)
        .attr("stroke-dashoffset", length)
        .transition()
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .delay(1500)
        .duration(3000)

    // Drawing animated area
    chartSvg.append("path")
        .style('fill', 'rgba(255,111,60,0.15)')
        .transition()
        .duration(1500)
        .style('fill', 'rgba(255,111,60,0.15)');

    // Adding the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Adding the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
})
