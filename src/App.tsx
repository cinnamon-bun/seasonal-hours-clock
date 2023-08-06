import * as React from "react";
import "./styles.css";

import SunCalc from "suncalc";

import { config } from "./config";
import { dayPct, nop, range } from "./util";
import { Pie, Rec, Rotate } from "./svg-utils";
import { Dial } from "./dial";
import { sFillDebug, sFillSeasonLookup, sLineDebug } from "./styles";
import { useTimer } from "./hooks";
import { hourTable } from "./seasonal-hours";

let url = new URL(window.location.href);

//================================================================================
// LOCATION

interface Location {
  lat: number;
  lon: number;
}

let saveLocToStorage = (loc: Location) => {
  localStorage.setItem("seasonal-hours-location", JSON.stringify(loc));
};
let loadLocFromStorage = (): Location | null => {
  let val = localStorage.getItem("seasonal-hours-location");
  if (val === undefined || val === null) {
    return null;
  }
  return JSON.parse(val);
};

let requestLocFromBrowser = async (): Promise<Location | null> => {
  let prom = new Promise<Location | null>((res, rej) => {
    navigator.geolocation.getCurrentPosition(
      (result) => {
        let loc: Location = {
          lat: result.coords.latitude,
          lon: result.coords.longitude
        };
        res(loc);
      },
      (err) => {
        console.warn(err);
        res(null);
      }
    );
  });
  return prom;
};

let obtainLocSomehow = async (): Promise<Location | null> => {
  // first try to read from url
  const lat_string = url.searchParams.get("lat");
  const lon_string = url.searchParams.get("lon");

  const lat = lat_string ? parseFloat(lat_string) : NaN;
  const lon = lon_string ? parseFloat(lon_string) : NaN;

  if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
    return { lat, lon };
  }

  // otherwise try to load from localstorage
  let loc = loadLocFromStorage();
  if (loc !== null) {
    console.log("--- location: loaded from localstorage");
    return loc;
  } else {
    // otherwise request from user
    console.log("--- location: requesting");
    let loc = await requestLocFromBrowser();
    if (loc !== null) {
      console.log("--- location: saving");
      saveLocToStorage(loc);
    } else {
      console.log("--- location: failed");
    }
    return loc;
  }
};

let computeSunTimes = (loc: Location | null) => {
  console.log("=== calculating sun times for location ", loc);
  if (loc === null) {
    return null;
  }
  return SunCalc.getTimes(new Date(), loc.lat, loc.lon);
};

//================================================================================
// MAIN

let hourToString = (n: number): string => {
  const nToUse = (n + 12) % 24;

  if (nToUse < 10) {
    return `0${nToUse}`;
  }

  return `${nToUse}`;
};

function get_highlighted_hours(url: URL): Set<number> {
  const hours = new Set<number>();

  for (const highlight_string of url.searchParams.getAll("hl")) {
    const as_number = parseInt(highlight_string, 10);
    if (!isNaN(as_number) && 0 <= as_number && as_number < 24) {
      hours.add(as_number);
    } else {
      const low = highlight_string.toLowerCase();
      for (let i = 0; i < 24; i++) {
        if (low === hourTable[i].shortName) {
          hours.add(i);
        }
      }
    }
  }

  return hours;
}

const highlighted_hours = get_highlighted_hours(url);

export default function App() {
  let redrawTick = useTimer(config.redrawEveryNSeconds * 1000);
  let recalcSunTick = useTimer(1000 * 60 * 60 * 6); // recalc sun every 6 hours

  nop(redrawTick); // satisfy linter

  // get location from browser once at startup
  let [loc, setLoc] = React.useState<Location | null>(null);
  React.useEffect(() => {
    if (config.showSunTimes) {
      console.log("> calling getLocation");
      obtainLocSomehow().then((loc) => setLoc(loc));
    }
  }, []);
  console.log("        render: location = ", loc);

  // recalculate sun times
  let sunTimes = React.useMemo(() => {
    nop(recalcSunTick); // satisfy linter
    return computeSunTimes(loc);
  }, [loc, recalcSunTick]);
  console.log("        render: sunTimes = ", sunTimes);

  let res = config.res;
  let cx = res / 2;
  let cy = res / 2;
  let radMax = (res / 2) * 0.98;
  let now = new Date();
  let hoursOffset = now.getTimezoneOffset() / 60;
  const offset_string = url.searchParams.get("offset");
  if (offset_string != null) {
    const offset = parseFloat(offset_string);
    if (!Number.isNaN(offset)) {
      hoursOffset = offset;
    }
  }
  let nowDayPct = dayPct(now, hoursOffset); // range: 0-1 (midnight to midnight)
  return (
    <div className="App">
      <svg width={config.res} height={config.res} style={sFillDebug}>
        {/* debug borders */}
        <Rec cx={cx} cy={cy} rx={res / 2 - 1} style={sLineDebug} />
        <circle cx={cx} cy={cy} r={5} style={sLineDebug} />
        <circle cx={cx} cy={cy} r={res / 2} style={sLineDebug} />

        {/* daylight */}
        {sunTimes !== null && config.showSunTimes ? (
          <Pie
            cx={cx}
            cy={cy}
            angle1={(dayPct(sunTimes.sunrise) + hoursOffset / 24) * 360 - 180}
            angle2={(dayPct(sunTimes.sunset) + hoursOffset / 24) * 360 + 180}
            rMin={radMax * 0}
            rMax={radMax * 0.7}
            className={"sDay"}
          />
        ) : undefined}

        {/* sunset to civil dusk */}
        {sunTimes !== null && config.showSunTimes ? (
          <Pie
            cx={cx}
            cy={cy}
            angle1={(dayPct(sunTimes.sunset) + hoursOffset / 24) * 360 + 180}
            angle2={(dayPct(sunTimes.sunrise) + hoursOffset / 24) * 360 + 180}
            rMin={radMax * 0}
            rMax={radMax * 0.7}
            className={"sCivilDusk"}
          />
        ) : undefined}

        {/* civil dusk to nautical dusk */}
        {sunTimes !== null && config.showSunTimes ? (
          <Pie
            cx={cx}
            cy={cy}
            angle1={(dayPct(sunTimes.dusk) + hoursOffset / 24) * 360 + 180}
            angle2={(dayPct(sunTimes.dawn) + hoursOffset / 24) * 360 + 180}
            rMin={radMax * 0}
            rMax={radMax * 0.7}
            className={"sNauticalDusk"}
          />
        ) : undefined}

        {/* nautical dusk through night */}
        {sunTimes !== null && config.showSunTimes ? (
          <Pie
            cx={cx}
            cy={cy}
            angle1={
              (dayPct(sunTimes.nauticalDusk) + hoursOffset / 24) * 360 + 180
            }
            angle2={
              (dayPct(sunTimes.nauticalDawn) + hoursOffset / 24) * 360 + 180
            }
            rMin={radMax * 0}
            rMax={radMax * 0.7}
            className={"sNight"}
          />
        ) : undefined}

        {/* sun */}
        <Rotate cx={cx} cy={cy} angle={nowDayPct * 360}>
          <circle
            cx={cx}
            cy={cy + radMax * 0.5}
            r={radMax * 0.035}
            className={"sFillInk"}
          />
        </Rotate>

        {/* season hours and UTC labels */}
        <Rotate cx={cx} cy={cy} angle={((12 - hoursOffset) * 360) / 24}>
          {/* season hours */}
          <Dial
            cx={cx}
            cy={cy}
            radMax={radMax * 0.9}
            radMin={radMax * 0.8}
            textAlign="center-range"
            textScale={0.39}
            ticks={range(24).map((n) => {
              let hourOf = hourTable[n];
              // title case
              let shortNameTitle =
                hourOf.shortName[0].toUpperCase() + hourOf.shortName.slice(1);
              return {
                angle: (360 * n) / 24,
                text: shortNameTitle,
                className: `${sFillSeasonLookup[hourOf.season]} ${
                  highlighted_hours.has(n) ? "sHighlight" : ""
                }`,
                classNameText: `sFillInk ${
                  highlighted_hours.has(n) ? "sHighlight" : ""
                }`
              };
            })}
          />
          {/* inner ring: background highlighting */}
          <Dial
            cx={cx}
            cy={cy}
            radMax={radMax * 0.8}
            radMin={radMax * 0.727}
            textAlign="center-line"
            ticks={range(24).map((n) => {
              return {
                angle: (360 * n) / 24,
                text: "",
                className: `sNone ${
                  highlighted_hours.has(n) ? "sHighlight" : ""
                }`,
                classNameText: ""
              };
            })}
          />
          {/* inner ring: utc */}
          <Dial
            cx={cx}
            cy={cy}
            radMax={radMax * 0.8}
            radMin={radMax * 0.727}
            textAlign="center-line"
            ticks={range(24).map((n) => {
              return {
                angle: (360 * n) / 24,
                text: "U " + ("" + n).padStart(2, "0"),
                className: "sNone", // highlightng the background here makes it overlap the U00 text
                classNameText: "sFillInkFaint"
              };
            })}
          />
          {/* outer ring: emoji */}
          <Dial
            cx={cx}
            cy={cy}
            radMax={radMax * 1.01}
            radMin={radMax * 0.9}
            textAlign="center-range"
            ticks={range(24).map((n) => {
              let moji = hourTable[n].emoji;

              return {
                angle: (360 * n) / 24,
                text: moji,
                className: `sNone ${
                  highlighted_hours.has(n) ? "sHighlight" : ""
                }`,
                classNameText: "sFillInkFaint"
              };
            })}
          />
        </Rotate>

        {/* outer ring: local time */}
        <Dial
          cx={cx}
          cy={cy}
          radMax={radMax * 1.01}
          radMin={radMax * 0.9}
          textAlign="center-line"
          textScale={0.62}
          ticks={range(24).map((n) => ({
            angle: (360 * n) / 24,
            text: hourToString(n),
            className: "sNone",
            classNameText: "sFillInk"
          }))}
        />

        {/* line of hour hand */}
        <Rotate cx={cx} cy={cy} angle={nowDayPct * 360}>
          <line
            x1={cx}
            y1={cy + radMax * 0.5}
            x2={cx}
            y2={cy + radMax * 0.82}
            className={"sLineInk"}
          />
        </Rotate>
      </svg>
    </div>
  );
}
