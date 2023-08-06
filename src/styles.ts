import * as React from "react";
import { config } from "./config";
import { Season } from "./seasonal-hours";

export let sLineDebug: React.CSSProperties = {
  stroke: config.showDebug ? "#080" : "none",
  fill: "none"
};
export let sFillDebug: React.CSSProperties = {
  stroke: "#eb5",
  fill: config.showDebug ? "rgba(0,128,0,0.3)" : "none"
};

//================================================================================
// SEASONAL BACKGROUND STYLES

export let sFillSeasonLookup: Record<Season, string> = {
  spring: "sFillSpring",
  summer: "sFillSummer",
  autumn: "sFillAutumn",
  winter: "sFillWinter"
};
