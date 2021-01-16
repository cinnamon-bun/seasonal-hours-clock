# Seasonal Hours Clock

Imagine mapping the 24 hours of the day to the seasons of the year.  Give each hour a short meaningful name.  For example, midnight is like Jan 1, in the depths of winter, so it's called the **Candle Hour**.

These hour names are applied to UTC time so they're the same all over the world, and can be used to more easily plan meetups with remote people.

This repo is a simple website that draws a 24-hour clock showing your local time, the seasonal hour name, and the UTC hour.

![](screenshot.png)

Local noon is at the top and local midnight at the bottom.

The 4 seasons each have their own color.  Winter is blue, spring is green, etc.

The faint innter text is the hour in UTC.  The yellow line is the hour hand.  In this screenshot it's 8:10pm local time, UTC 04, the Hour Of The Root.

[seasonal-hours.ts](https://github.com/cinnamon-bun/seasonal-hours-clock/blob/main/src/seasonal-hours.ts) has a complete listing of hour names.

This concept originated in [Twodays Crossing](https://github.com/earthstar-project/twodays-crossing), an Earthstar chat app.
