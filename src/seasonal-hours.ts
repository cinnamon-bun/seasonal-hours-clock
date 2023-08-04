export type Season = "winter" | "spring" | "summer" | "autumn";

export interface HourOf {
  shortName: string; // "ice"
  longName: string; // "hour of ice"
  season: Season;
  emoji: string;
}

/*
  Pretend that each 24 hour period is actually an entire year with seasons.
  UTC hour 0 is Jan 1, winter.
  UTC hour 6 is the first day of spring, etc.
  Give each of these hours a pretty name related to the season it's in.
  These "seasonal hours" will be synchronized for everyone around the world
  because they use UTC time.

  Hour names were brainstormed in this spreadsheet
    https://docs.google.com/spreadsheets/d/1uEnIJp2FFQYr2VexcZvJhKOMe898lOUDCrXZX2VlzDQ/edit?usp=sharing
*/
export let hourTable: Record<number, HourOf> = {
  0: {
    season: "winter",
    shortName: "candle",
    longName: "candle hour",
    emoji: "🕯"
  },
  1: {
    season: "winter",
    shortName: "ice",
    longName: "hour of ice",
    emoji: "❄️"
  },
  2: {
    season: "winter",
    shortName: "comet",
    longName: "hour of the comet",
    emoji: "☄️"
  },
  3: { season: "winter", shortName: "owl", longName: "owl hour", emoji: "🦉" },
  4: {
    season: "winter",
    shortName: "yarn",
    longName: "yarn hour",
    emoji: "🧶"
  },
  5: {
    season: "winter",
    shortName: "mist",
    longName: "hour of mist",
    emoji: "🌫"
  },
  6: {
    season: "spring",
    shortName: "sprout",
    longName: "sprout hour",
    emoji: "🌱"
  },
  7: {
    season: "spring",
    shortName: "rainbow",
    longName: "rainbow hour",
    emoji: "🌈"
  },
  8: {
    season: "spring",
    shortName: "worm",
    longName: "worm hour",
    emoji: "🪱"
  },
  9: {
    season: "spring",
    shortName: "rabbit",
    longName: "rabbit hour",
    emoji: "🐇"
  },
  10: {
    season: "spring",
    shortName: "blossom",
    longName: "blossom hour",
    emoji: "🌸"
  },
  11: {
    season: "spring",
    shortName: "nest",
    longName: "nest hour",
    emoji: "🪺"
  },
  12: {
    season: "summer",
    shortName: "coral",
    longName: "coral hour",
    emoji: "🪸"
  },
  13: {
    season: "summer",
    shortName: "cherry",
    longName: "cherry hour",
    emoji: "🍒"
  },
  14: { season: "summer", shortName: "bee", longName: "bee hour", emoji: "🐝" },
  15: {
    season: "summer",
    shortName: "melon",
    longName: "melon hour",
    emoji: "🍉"
  },
  16: {
    season: "summer",
    shortName: "seashell",
    longName: "seashell hour",
    emoji: "🐚"
  },
  17: {
    season: "summer",
    shortName: "dragon",
    longName: "hour of the dragon",
    emoji: "🐉"
  },
  18: {
    season: "autumn",
    shortName: "chestnut",
    longName: "chestnut hour",
    emoji: "🌰"
  },
  19: {
    season: "autumn",
    shortName: "kite",
    longName: "hour of the kite",
    emoji: "🪁"
  },
  20: {
    season: "autumn",
    shortName: "mushroom",
    longName: "mushroom hour",
    emoji: "🍄"
  },
  21: {
    season: "autumn",
    shortName: "lightning",
    longName: "lightning hour",
    emoji: "⚡️"
  },
  22: {
    season: "autumn",
    shortName: "mountain",
    longName: "hour of the mountain",
    emoji: "⛰"
  },
  23: {
    season: "autumn",
    shortName: "lantern",
    longName: "lantern hour",
    emoji: "🏮"
  }
};

export let getUtcHour = (): number => {
  // Return the current hour of the day in UTC time,
  // including fractional hours.
  // Example: 03:20 --> 3.33333
  // Range: 0 to 23.99999
  let now = new Date();
  return (
    now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 60 / 60
  );
};

export let getHourOf = (): HourOf => {
  let intHour = Math.floor(getUtcHour());
  return hourTable[intHour];
};
