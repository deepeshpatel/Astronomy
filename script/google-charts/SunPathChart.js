function drawSolarPathDay(azimuth, altitude, time, selectedData) {

    var data = new google.visualization.DataTable();

    data.addColumn('number', 'Altitude'); // Implicit domain column.
    data.addColumn('number', 'Azimuth'); // Implicit data column.
    data.addColumn({type:'string', role:'tooltip'});
    data.addColumn({type:'string', role:'style'});
    //data.addColumn('number', 'Shadow Length'); // Implicit data column.


    for (var i = 0; i < azimuth.length; i++) {

            var v = [azimuth[i],altitude[i],HHMMSS(time[i]),null];
            data.addRow(v);

        //uncomment following if do not want to use d3
        // if(time[i] == selectedData[2]) {
        //     //alert("its time");
        //     var v = [azimuth[i],altitude[i], HHMMSS(selectedData[2]),'point { size:5 ; visible:true; fill-color: #a527ff; }'];
        //     data.addRow(v);
        // } else {
        //     var v = [azimuth[i],altitude[i],HHMMSS(time[i]),null];
        //     data.addRow(v);
        // }
    }

        // var v = [azimuth[i],altitude[i], HHMMSS(selectedData[2]),'point { size:10 ; visible:true; fill-color: #a527ff; }'];
        // data.addRow(v);


    var options = {
        title: 'Sun Path on a given day',
        //backgroundColor: { fill:'transparent' },
        //pointsVisible: true,
        //is3D: true,
        curveType: 'line',
        legend: {position: 'none'},

        vAxis: {
            title: 'Altitude (Degrees)',
            ticks : [ 0,10,20,30,40,50,60,70,80,90,100],
            viewWindowMode:'maximized',
            viewWindow: {
                max:100,
                min:-100
            }
        },

        hAxis: {
            title: 'Azimuth (Degrees)',
            pointSize: 1,
            ticks : [ 30,60,90,120,150,180,210,240,270,300,330,360 ],
            dataOpacity: 0.3
        },
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_sunPath'));
    chart.draw(data, options);

    var svg = d3.select("svg");
    var cli = chart.getChartLayoutInterface();
    var xLoc = cli.getXLocation(selectedData[0]);
    var yLoc = cli.getYLocation(selectedData[1]);
    svg.append("circle").attr("cx", xLoc).attr("cy", yLoc).attr("r", 6).style("fill", "orange");
    svg.empty();
}



