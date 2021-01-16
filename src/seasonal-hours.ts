
export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export interface HourOf {
  shortName: string,  // "ice"
  longName: string,  // "hour of ice"
  season: Season,
}

/*
  Pretend that each 24 hour period is actually an entire year with seasons.
  UTC hour 0 is Jan 1, winter.
  UTC hour 6 is the first day of spring, etc.
  Give each of these hours a pretty name related to the season it's in.
  These "seasonal hours" will be synchronized for everyone around the world
  because they use UTC time.

  Hour names were brainstormed in this spreadsheet
  and are not final yet.
    https://docs.google.com/spreadsheets/d/1uEnIJp2FFQYr2VexcZvJhKOMe898lOUDCrXZX2VlzDQ/edit?usp=sharing
*/
export let hourTable: Record<number, HourOf> = {
  0:  {season: 'winter', shortName: 'candle',   longName: 'candle hour',         },
  1:  {season: 'winter', shortName: 'ice',      longName: 'hour of ice',         },
  2:  {season: 'winter', shortName: 'comet',    longName: 'hour of the comet',   },
  3:  {season: 'winter', shortName: 'thimble',  longName: 'hour of the thimble', },
  4:  {season: 'winter', shortName: 'root',     longName: 'hour of roots',       },
  5:  {season: 'winter', shortName: 'mist',     longName: 'hour of mist',        },
  6:  {season: 'spring', shortName: 'sprout',   longName: 'sprout hour',         },
  7:  {season: 'spring', shortName: 'rainbow',  longName: 'rainbow hour',        },
  8:  {season: 'spring', shortName: 'worm',     longName: 'worm hour',           },
  9:  {season: 'spring', shortName: 'bud',      longName: 'bud hour',            },
  10: {season: 'spring', shortName: 'blossom',  longName: 'blossom hour',        },
  11: {season: 'spring', shortName: 'ladybug',  longName: 'ladybug hour',        },
  12: {season: 'summer', shortName: 'geese',    longName: 'hour of geese',       },
  13: {season: 'summer', shortName: 'dust',     longName: 'hour of dust',        },
  14: {season: 'summer', shortName: 'peach',    longName: 'hour of peach',       },
  15: {season: 'summer', shortName: 'fog',      longName: 'hour of fog',         },
  16: {season: 'summer', shortName: 'acorn',    longName: 'hour of acorn',       },
  17: {season: 'summer', shortName: 'gourd',    longName: 'hour of gourd',       },
  18: {season: 'autumn', shortName: 'soup',     longName: 'soup hour',           },
  19: {season: 'autumn', shortName: 'crow',     longName: 'crow hour',           },
  20: {season: 'autumn', shortName: 'mushroom', longName: 'mushroom hour',       },
  21: {season: 'autumn', shortName: 'thunder',  longName: 'thunder hour',        },
  22: {season: 'autumn', shortName: 'frost',    longName: 'frost hour',          },
  23: {season: 'autumn', shortName: 'lantern',  longName: 'lantern hour',        },   
};

export let getUtcHour = () : number => {
  // Return the current hour of the day in UTC time,
  // including fractional hours.
  // Example: 03:20 --> 3.33333
  // Range: 0 to 23.99999
  let now = new Date();
  return now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 60 / 60;
}

export let getHourOf = () : HourOf => {
  let intHour = Math.floor(getUtcHour());
  return hourTable[intHour];
}
