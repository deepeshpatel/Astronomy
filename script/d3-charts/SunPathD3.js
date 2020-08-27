var svg;

function drawSolarPathDayD3(azimuth, altitude, time, selectedData) {

    var margin = {top: 5, right: 20, bottom: 50, left: 50};
    var element = d3.select('#chart_sunPath').node();
    var width = element.getBoundingClientRect().width - margin.left - margin.right;
    var height = element.getBoundingClientRect().height - margin.top - margin.bottom;

    if(svg != null) {
        //svg.remove();
        d3.select("svg").remove();
    }


    svg = d3.select("#chart_sunPath").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    //xAxis
    var xScale = d3.scaleLinear().domain([0,360]).range([0, width]);
    var xAxis = d3.axisBottom(xScale);
    xAxis.ticks(12);
    svg.append('g').attr("transform", "translate(0," + height + ")").call(xAxis);

    //yAxis
    var yScale = d3.scaleLinear().domain([-100, 100]).range([height, 0]);
    var yAxis = d3.axisLeft().scale(yScale);
    svg.append('g').call(yAxis);


    //xGridLines
    var xAxis2 = d3.axisBottom().scale(xScale);
    xAxis2.ticks(12).tickSize(-height).tickFormat("");
    svg.append('g').attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis2);

    // text label for the x axis
    svg.append("text")
        .attr("transform",
            "translate(" + (width/2) + " ," +
            (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Azimuth (Degree)");

    //yGridLines
    var yAxis2 = d3.axisLeft().scale(yScale);
    yAxis2.ticks(2).tickSize(-width).tickFormat("");
    svg.append('g').call(yAxis2);

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Altitude (Degree)");

    function gradientColor() {
        return "steelblue";
    }

    // Add the line
    svg.append("path")
        .datum(azimuth,altitude)
        .attr("fill", "none")
        //.attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr('stroke',gradientColor())
        .attr("d", d3.line()
            .x(function(d,i) { return xScale(azimuth[i]) })
            .y(function(d,i) { return yScale(altitude[i]) })
        );

    // var path = svg.selectAll("svg");
    // path.exit().remove();
    svg.append("circle")
        .attr("cx", xScale(selectedData[0])).attr("cy", yScale(selectedData[1])).attr("r", 8).style("fill", "orange");

   // d3.selectAll("svg").remove();

}

