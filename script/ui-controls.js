
function dateSliderMoved() {

    var days = $("#dateSlider").val();
    var maxDate = new Date(year, 0, days);

    $("#date").val(
        maxDate.getFullYear() + '-' + ('0' + (maxDate.getMonth() + 1)).slice(-2) +
        '-' + ('0' + maxDate.getDate()).slice(-2));
    calculate();

}

function timeSliderMoved() {
    var v= time;
    var sliderTime = $("#timeSlider").val();
    var timeValues = HHMMSS(sliderTime).split(":");

    if(timeValues[0] <10) {
        timeValues[0] = "0" + timeValues[0];
    }

    $("#time").val(timeValues[0]+":"+timeValues[1]);

    calculateForTimeModification();


}

function latSliderMoved() {
    var sliderLat = $("#latSlider").val();
    $("#latitude").val(sliderLat);
    calculateForLatitudeModification();

}

function longSliderMoved() {
    var sliderLong = $("#longSlider").val();
    $("#longitude").val(sliderLong);
}

function dateChanged() {
    //console.log("Date changed");
}

function init() {
    calculate();
}



