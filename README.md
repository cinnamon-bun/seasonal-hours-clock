# Seasonal Hours Clock

Imagine mapping the 24 hours of the day to the seasons of the year.  Give each hour a short meaningful name.  For example, midnight is like Jan 1, in the depths of winter, so it's called the **Candle Hour**.

These hour names are applied to UTC time so they're the same all over the world, and can be used to more easily plan meetups with remote people.

This repo is a simple website that draws a 24-hour clock showing your local time, the seasonal hour name, and the UTC hour.

![](screenshot.png)

Local noon is at the top and local midnight at the bottom.

The 4 seasons each have their own color, and the "year" starts at UTC 00.  Winter is blue, spring is green, etc.

The faint innter text is the hour in UTC.  In this screenshot it's 1:30pm local time, UTC 21, the Hour Of Thunder.

The colored pie chart in the middle shows daylight, dusk, and night.  The hour hand also represents the sun.

[seasonal-hours.ts](https://github.com/cinnamon-bun/seasonal-hours-clock/blob/main/src/seasonal-hours.ts) has a complete listing of hour names.

This concept originated in [Twodays Crossing](https://github.com/earthstar-project/twodays-crossing), an Earthstar chat app.

[View in CodeSandbox](https://codesandbox.io/s/old-hooks-2cxi6?file=/README.md)

[![Netlify Status](https://api.netlify.com/api/v1/badges/9082d826-4108-4eb0-b2d3-d2e6d6066a9d/deploy-status)](https://app.netlify.com/sites/seasonal-hours-clock/deploys)
