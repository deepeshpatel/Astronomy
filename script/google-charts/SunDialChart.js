
function drawSundialChart(points) {

    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Altitude');
    data.addColumn('number', 'Shadow Length');
    data.addRows(points);

    var options = {
        title: 'Sundial (Extent of shadow for a 1 meter pole',
        //backgroundColor: { fill:'transparent' },
        //pointsVisible: true,
        //is3D: true,
        curveType: 'line',
        legend: {position: 'none'},

        vAxis: {
            title: 'Depth of shadow (meters)',
            //ticks : [ 0,10,20,30,40,50,60,70,80,90,100],
            viewWindowMode:'maximized',
            viewWindow: {
                max:1,
                min:-1
            }
        },

        hAxis: {
            title: 'WEST <--- Horizontal Distance (Meters) ---> EAST',
            pointSize: 1,
            //ticks : [ 30,60,90,120,150,180,210,240,270,300,330,360 ],
            dataOpacity: 0.3,
            viewWindow: {
                max:1,
                min:-1
            }
        },
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_Sundial'));
    chart.draw(data, options);
}



