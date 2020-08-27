function drawAnalemmaChart(eqOfTime, declination, dayOfYear) {

    var data = new google.visualization.DataTable();

    data.addColumn('number', 'Eq OF Time'); //X-Axis
    data.addColumn('number', 'Declination'); //Y-Axis
    data.addColumn({type:'string', role:'style'});
    //data.addColumn({type:'string', role:'tooltip'});
    //data.addColumn({type:'string', role:'style'});


    for (var i = 0; i < eqOfTime.length; i++) {
        var point = null;

        if(i== dayOfYear) {
            point = 'point { size:6 ; visible:true; fill-color: orange; }';
        }

        var v = [eqOfTime[i], declination[i], point];
        data.addRow(v);
    }

    // var v = [rowData[1][0],rowData[0][0], rowData[2][0],null];
    // data.addRow(v);


    var options = {
        title: "Sun's Analemma",
        //pointsVisible: true,
        //is3D: true,
        curveType: 'line',
        legend: {position: 'none'},

        vAxis: {
            title: 'Declination (Degrees)',
            //ticks : [ 0,10,20,30,40,50,60,70,80,90,100],
            viewWindowMode:'maximized',
            viewWindow: {
                max:24,
                min:-24
            }
        },

        hAxis: {
            title: 'Equation Of Time (Minutes)',
            pointSize: 1,
            viewWindow: {
                max:18,
                min:-18
            },
            // ticks : [ 30,60,90,120,150,180,210,240,270,300,330,360 ],
            dataOpacity: 0.3
        },
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_Analemma'));
    chart.draw(data, options);

}



