var M = Math.PI/180;

//inputs
var latitude;
var longitude;
var timeZone;
var time;
var date;

//for entire year at constant time
var yearDeclination = [];
var yearEqOfTime    = [];
var yearHourAngle   = [];
var yearAltitude    = [];
var yearAzimuth     = [];

//for entire day
var dayHourAngle   = [];
var dayAltitude    = [];
var dayAzimuth     = [];
var dayTime        = [];
var sundialXY      = [];

//for specific day and time
var declination; //degrees
var eqOfTime; //minutes
var timeOffset; //minutes
var hourAngle; //degrees
var altitude; //degrees
var azimuth; //degrees

var solarNoon; //minutes
var solarTime; //minutes
var sunriseActual; //minutes
var sunsetActual; //minutes
var sunriseApparent; //minutes
var sunsetApparent;  //minutes

function calculate() {
    readInput();
    calculateForEntireDay();
    calculateSunDianForDay();
    calculateForEntireYear();
    calculateForSpecificDateAndTime();
    writeOutput();
    var selectedData = [azimuth,altitude, time];
    drawSolarPathDay(dayAzimuth, dayAltitude, dayTime, selectedData);
    //drawSolarPathDayD3(dayAzimuth, dayAltitude, dayTime, selectedData);
    //drawAnalemmaChart(yearAzimuth, yearAltitude, findDayOfYear(date));
    drawAnalemmaChart(yearEqOfTime, yearDeclination, findDayOfYear(date));
    drawSundialChart(sundialXY);
}

function calculateForTimeModification() {
    readInput();
    calculateForSpecificDateAndTime();
    writeOutput();
    var selectedData = [azimuth,altitude, time];
    drawSolarPathDay(dayAzimuth, dayAltitude, dayTime, selectedData);
}

function calculateForLatitudeModification() {
    readInput();
    calculateForEntireDay();
    calculateSunDianForDay();
    calculateForSpecificDateAndTime();
    writeOutput();
    var selectedData = [azimuth,altitude, time];
    drawSolarPathDay(dayAzimuth, dayAltitude, dayTime, selectedData);
    drawSundialChart(sundialXY);
}

function calculateForEntireDay() {

    dayHourAngle = [];
    dayAltitude = [];
    dayAzimuth = [];
    dayTime = [];

    var startTime = 0 ;
    var endTime   = (24*60);
    var dayOfYear = findDayOfYear(date);
    var selectedTime = time;

    /**
     * I am assuming declination and eqOfTime as same
     * for now. Take fractional dayOfYear for precise calculation
     */
    var dec = calculateDeclination(dayOfYear);
    var eq = calculateEqOfTime(dayOfYear);
    var offset = calculateTimeOffset(eq);

    var i=startTime;
    for(; i<selectedTime; i+=10) {
        calculateLHAAltAndAz(i, offset,dec);
    }
    calculateLHAAltAndAz(selectedTime, offset,dec);

    for(; i<endTime; i+=10) {
        calculateLHAAltAndAz(i, offset,dec);
    }
}


function calculateLHAAltAndAz(ttime, offset, dec) {
    var LHA = calculateHourAngle(ttime, offset);
    var alt = calculateAltitude(dec, LHA);
    var az = calculateAzimuth(dec, LHA, alt);

    dayHourAngle.push(LHA);
    dayAltitude.push(alt);
    dayAzimuth.push(az);
    dayTime.push(ttime);
}


//No need to calculate if only time is modified/
//calculate when date is modified
function calculateSunDianForDay() {
    sundialXY = [];
    var alt;
    for(var i=0; i< dayAltitude.length; i++) {

        if(dayAltitude[i] <0 || dayAltitude >180) {
            continue;
        }
        var azim =  dayAzimuth[i]-90;
        var shadowLength = 1/Math.tan(dayAltitude[i] * M);
        var x = shadowLength * Math.cos(azim*M);
        var y = shadowLength * Math.sin(azim*M);
        var point = [x,y];
        sundialXY.push(point);
    }
}

function calculateForEntireYear() {

    yearDeclination = [];
    yearEqOfTime    = [];
    yearHourAngle   = [];
    yearAltitude    = [];
    yearAzimuth     = [];

    var days = getNoOfDays(date);

    for(var i=1; i<=days; i++) {
        var dec = calculateDeclination(i);
        var eq = calculateEqOfTime(i);
        var offset = calculateTimeOffset(eq);
        var LHA = calculateHourAngle(time, offset);
        var alt = calculateAltitude(dec, LHA);
        var az = calculateAzimuth(dec, LHA, alt);
        yearDeclination.push(dec)
        yearEqOfTime.push(eq);
        yearHourAngle.push(LHA);
        yearAltitude.push(alt);
        yearAzimuth.push(az);
    }
}

function calculateForSpecificDateAndTime() {

    var dayOfYear = findDayOfYear(date);
    declination = calculateDeclination(dayOfYear);
    eqOfTime = calculateEqOfTime(dayOfYear);
    timeOffset = calculateTimeOffset(eqOfTime);
    hourAngle = calculateHourAngle(time,timeOffset);
    altitude = calculateAltitude(declination,hourAngle);
    azimuth = calculateAzimuth(declination, hourAngle, altitude);

    //showoff
    calculateSolarNoon();
    calculateSolarTime();
    calculateSunriseAndSunset();
}

function readInput() {
    latitude = document.formCalc.latitude.value;
    longitude = document.formCalc.longitude.value;
    timeZone = document.formCalc.timezone.value;

    var timeValues = document.formCalc.time.value.split(":");
    time = (timeValues[0]*60 ) +  (timeValues[1]*1);
    date = new Date(document.formCalc.date.value);
}

function findDayOfYear(dateUpto) {

    year = dateUpto.getFullYear();
    var dateStart = new Date(year, 0, 0);
    var diff = dateUpto - dateStart;
    var oneDay = 1000 * 60 * 60 * 24;
    var dayOfYear =  Math.floor(diff / oneDay)-1;
    return dayOfYear;
}

function calculateDeclination(dayOfYear) {
    var N = dayOfYear;
    var d2 = 1.914 * Math.sin(0.98565 * (N-2) * M);
    var d1 = 0.98565 * (N+10);
    var total =  0.39779 * Math.cos((d1 + d2) * M);
    var declination = -Math.asin(total) / M ;
    return declination;
}

//in minutes
function calculateEqOfTime(dayOfYear) {
    var  x=dayOfYear * 2 * Math.PI/365;
    var eqOfTime = 229.18*(0.000075+0.001868* Math.cos(x)-0.032077* Math.sin(x)-0.014615* Math.cos(2*x)-0.040849* Math.sin(2*x));
    return eqOfTime;
}

function calculateTimeOffset(eqOfTimeInMinutes) {
    var timeOffset = (longitude * 4) + eqOfTimeInMinutes - (timeZone * 60);
    return timeOffset;
}

function calculateHourAngle(currentTimeInMinutes, offset) {
    var noon = 12 * 60;
    var hourAngleInMinutes =  currentTimeInMinutes - noon + offset;
    var LHA = hourAngleInMinutes/4;
    return LHA;
}

/**
 * From
 * [1] Spherical law of cosines and
 * [2] sin(90-a) = cos(a)
 * [3] cos(90-a) = sin(a)
 * because altitude is 90-zenith
 */
function calculateAltitude(dec, LHA) {
    var sinα = Math.sin(dec * M)* Math.sin(latitude * M) +
        Math.cos(dec * M)* Math.cos(latitude * M)*Math.cos(LHA * M);
    var alt = Math.asin(sinα)/M;
    return alt;
}

function calculateAzimuth(dec, LHA, alt) {
    var cosα = Math.sin(dec*M)*Math.cos(latitude*M) -
        Math.cos(dec*M)*Math.sin(latitude*M)*Math.cos(LHA*M);

    cosα = cosα/Math.cos(alt*M);
    var azimuth = Math.acos(cosα)/M;
    if(LHA >0) {
        azimuth = 360-azimuth;
    }

    return azimuth;
}

function calculateSolarNoon() {
    solarNoon = (12*60)  - timeOffset;
}

function calculateSolarTime() {
    solarTime = timeOffset + time;
}

function calculateSunriseAndSunset() {
    var hourAngleDegree = hourAngleForRiseSetActual();
    //alert(hourAngleDegree);
    sunriseActual = sunriseOrset( -hourAngleDegree);
    sunsetActual =  sunriseOrset(hourAngleDegree);

    var hourAngleDegreeRefraction = hourAngleForRiseSetRefraction();
    sunriseApparent = sunriseOrset(-hourAngleDegreeRefraction);
    sunsetApparent =  sunriseOrset(hourAngleDegreeRefraction);
}

function sunriseOrset(hourAngleInDegree) {
    return minutes = 720 + 4 *(-longitude + hourAngleInDegree) - eqOfTime + (timeZone * 60);
}

/**
 *  For sunrise and sunset we need to set the altitude to zero.
 *  In that case we can rearrange the equation in method calculateAltitude()
 *  as follows
 */
function hourAngleForRiseSetActual() {
    var cosOfHRA =  -Math.tan(latitude * M)* Math.tan(declination * M);
    return Math.acos(cosOfHRA)/M;
}

/**
 For the special case of sunrise or sunset, the zenith is set to 90.833 (the approximate correction for
 atmospheric refraction at sunrise and sunset, and the solar disk diameter), and the hour angle
 becomes:
 */
function hourAngleForRiseSetRefraction() {
    var hourAngleRiseSet = Math.cos(M*90.833)/(Math.cos(M*latitude)* Math.cos(M*declination))
        - ( Math.tan(M*latitude)* Math.tan(M*declination));

    hourAngleRiseSet = Math.acos(hourAngleRiseSet)/M;
    return hourAngleRiseSet;
}

function writeOutput() {
    document.formCalc.declination.value = declination;
    document.formCalc.elevationAtSolarNoon.value = 90 - (latitude - declination);
    document.formCalc.hourAngle.value = hourAngle;
    document.formCalc.altitude.value = altitude;
    document.formCalc.zenith.value = 90-altitude;
    document.formCalc.azimuth.value = azimuth;

    document.formCalc.eqOfTime.value = eqOfTime;
    document.formCalc.solarNoon.value = HHMMSS(solarNoon);
    document.formCalc.offset.value = HHMMSS(timeOffset);
    document.formCalc.solarTime.value = HHMMSS(solarTime);

    document.formCalc.sunriseActual.value = HHMMSS(sunriseActual);
    document.formCalc.sunriseApparent.value = HHMMSS(sunriseApparent);
    document.formCalc.sunsetActual.value = HHMMSS(sunsetActual);
    document.formCalc.sunsetApparent.value = HHMMSS(sunsetApparent);
}

function HHMMSS(timeInMiutes) {
    var timeInSeconds = timeInMiutes * 60;
    var negative = timeInSeconds < 0;
    timeInSeconds = Math.abs(timeInSeconds);

    var h = Math.floor(timeInSeconds/3600);
    timeInSeconds = timeInSeconds % 3600;

    var m = Math.floor(timeInSeconds/60);
    timeInSeconds = timeInSeconds % 60;

    var s = Math.floor(timeInSeconds/60);
    var minStr = m<10 ? "0" + m : m;
    var str = h + ":" + minStr + ":" + s;
    return  negative ? "-" + str : str;
}

function getNoOfDays(date) {
    var y = date.getFullYear();
    if (parseInt(y)% 4 !=0) {
        return 365;
    }

    if (parseInt(y)% 400 ==0) {
        return 366;
    }

    if (parseInt(y)% 100 ==0) {
        return 365;
    }

    return 366;
}