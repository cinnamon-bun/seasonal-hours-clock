export let config = {
    // use 12 hour am/pm format for local time?  otherwise show local time in 24 hour format.
    useAmPm: true,
  
    // show sunrise & sunset times?  this also causes a geolocation request.
    showSunTimes: true,
  
    // update the hour hand this often
    redrawEveryNSeconds: 30,
  
    // recalculate sun times this often
    recalcSunEveryNHours: 6
  };
  