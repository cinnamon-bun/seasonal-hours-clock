
export let config = {
    // overall pixel size of the clock
    res: 700,

    // show debug border around clock
    showDebug: false,

    // use 12 hour am/pm format for local time?  otherwise show local time in 24 hour format.
    useAmPm: true,

    // show sunrise & sunset times?  this also causes a geolocation request.
    showSunTimes: true,

    // update the hour hand this often
    redrawEveryNSeconds: 30,

    // recalculate sun times this often
    recalcSunEveryNHours: 6,
}
