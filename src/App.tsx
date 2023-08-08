import * as React from "react";
import "./styles.css";

import { config } from "./config";
import { hourTable } from "./seasonal-hours";

import Resizer from "./resizer";
import NowUpdater from "./now-updater";
import { Clock } from "./clock";
import RepoLink from "./repo-link";

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

//================================================================================
// MAIN

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

let now = new Date();
let hoursOffset = (-1 * now.getTimezoneOffset()) / 60;
const offset_string = url.searchParams.get("offset");
if (offset_string != null) {
  const offset = parseFloat(offset_string);
  if (!Number.isNaN(offset)) {
    hoursOffset = offset;
  }
}

export default function App() {
  // get location from browser once at startup
  let [loc, setLoc] = React.useState<Location | null>(null);
  React.useEffect(() => {
    if (config.showSunTimes) {
      obtainLocSomehow().then((loc) => setLoc(loc));
    }
  }, []);

  return (
    <div className="App">
      <Resizer>
        <NowUpdater frequency={1000 * config.redrawEveryNSeconds}>
          <Clock
            utc_offset={hoursOffset / 24}
            loc={loc}
            highlighted_hours={highlighted_hours}
            hourTable={hourTable}
          />
        </NowUpdater>
        <RepoLink />
      </Resizer>
    </div>
  );
}
