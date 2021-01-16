import * as React from "react";
import { config } from './config';
import { Season } from "./seasonal-hours";

//================================================================================
// COLORS

export let cPage = 'black';
export let cInk = '#eb5';  // gold
export let cInkFaint = 'rgb(91, 68, 38)';

//================================================================================
// STYLES

export let sNone: React.CSSProperties = {
    stroke: 'none',
    fill: 'none',
};
export let sLineInk: React.CSSProperties = {
    stroke: cInk,
    fill: 'none',
    strokeWidth: 2,
};
export let sLineDebug: React.CSSProperties = {
    stroke: config.showDebug ? '#080' : 'none',
    fill: 'none',
};
export let sFillDebug: React.CSSProperties = {
    stroke: cInk,
    fill: config.showDebug ? 'rgba(0,128,0,0.3)' : 'none',
};
export let sFillInk: React.CSSProperties = {
    stroke: 'none',
    fill: cInk,
};

//================================================================================
// SEASONAL BACKGROUND STYLES

let sSeasonBase: React.CSSProperties = {
    stroke: cPage,
    strokeWidth: 2,
}
export let sFillSpring: React.CSSProperties = {
    ...sSeasonBase,
    fill: 'rgb(55, 87, 55)',
}
export let sFillSummer: React.CSSProperties = {
    ...sSeasonBase,
    fill: 'rgb(113, 92, 43)',
}
export let sFillAutumn: React.CSSProperties = {
    ...sSeasonBase,
    fill: 'rgb(108, 68, 44)',
}
export let sFillWinter: React.CSSProperties = {
    ...sSeasonBase,
    fill: 'rgb(70, 62, 108)',
}
export let sFillSeasonLookup: Record<Season, React.CSSProperties> = {
    'spring': sFillSpring,
    'summer': sFillSummer,
    'autumn': sFillAutumn,
    'winter': sFillWinter,
}
