import { useContext } from "react";

import SunCalc from "suncalc";

import { ViewportSizeContext } from "./viewport-size-context";
import { UpdateNowContext } from "./update-now-context";
import CircularClock from "./circular-clock";
import { HourOf } from "./seasonal-hours";

export interface Location {
  lat: number;
  lon: number;
}

// How should a clock present the time?
export interface ClockProps {
  utc_offset: number;
  loc: Location | null;
  highlighted_hours: Set<number>; // indexes (0 = candle) of hours to highlight
  hourTable: Record<number, HourOf>;
}

// Everything you need to render a clock at a certain point in time.
// *All times are normalized between 0 and 1*.
export interface ClockUiProps {
  width: number; // in px
  height: number; // in px
  utc_offset: number; // offset from the current timezone to utc, normalized between 0 and 1.
  time: number; // current time
  sun_hours: SunHours | null;
  highlighted_hours: Set<number>; // indexes (0 = candle) of hours to highlight
  hourTable: Record<number, HourOf>;
}

export interface SunHours {
  sunrise: number;
  sunset: number;
  dusk: number; // civil
  dawn: number; // civil
  nautical_dusk: number;
  nautical_dawn: number;
}

// given a date, return the fraction of the way it is through the day in utc
// from midnight to midnight, range 0-1.
export let dayPct = (date: Date): number => {
  return (
    date.getUTCHours() / 24 +
    date.getUTCMinutes() / 24 / 60 +
    date.getUTCSeconds() / 24 / 60 / 60
  );
};

const computeSunTimes = (now: Date, loc: Location | null) => {
  if (loc) {
    const times = SunCalc.getTimes(now, loc.lat, loc.lon);
    return {
      sunrise: dayPct(times.sunrise),
      sunset: dayPct(times.sunset),
      dusk: dayPct(times.dusk),
      dawn: dayPct(times.dawn),
      nautical_dusk: dayPct(times.nauticalDusk),
      nautical_dawn: dayPct(times.nauticalDawn)
    };
  } else {
    return null;
  }
};

export function Clock(props: ClockProps) {
  const dimensions = useContext(ViewportSizeContext);
  const now = useContext(UpdateNowContext);

  const sun_hours = computeSunTimes(now, props.loc);

  return (
    <CircularClock
      width={dimensions.width}
      height={dimensions.height}
      utc_offset={props.utc_offset}
      time={dayPct(now)}
      sun_hours={sun_hours}
      highlighted_hours={props.highlighted_hours}
      hourTable={props.hourTable}
    />
  );
}
