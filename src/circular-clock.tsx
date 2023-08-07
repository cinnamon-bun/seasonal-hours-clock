import { ClockUiProps } from "./clock";

import { range } from "./util";
import { Pie, Rotate } from "./svg-utils";
import { Dial } from "./dial";
import { sFillSeasonLookup } from "./styles";

export default function CircularClock({
  width,
  height,
  utc_offset,
  time,
  sun_hours,
  highlighted_hours,
  hourTable
}: ClockUiProps) {
  const radius = Math.min(width, height) / 2;
  const cx = width / 2;
  const cy = height / 2;

  const highlight_min = radius * 0.72;
  const highlight_max = radius * 0.98;

  const daylightRadius = radius * 0.68;
  const sun_distance = radius * 0.3;
  const sun_radius = radius * 0.035;
  const hour_hand_tip = radius * 0.73;

  const main_hour_display_min = radius * 0.75;
  const main_hour_display_max = radius * 0.95;
  const main_hour_scale = 0.7;

  // Convert a fraction of the day to an angle on the face of the clock.
  const time_to_angle = (time: number) => {
    return time * 360 + 0;
  };

  let sun_hours_display = <></>;
  if (sun_hours != null) {
    const {
      sunrise,
      sunset,
      dusk,
      dawn,
      nautical_dusk,
      nautical_dawn
    } = sun_hours;

    sun_hours_display = (
      <>
        {/* daylight */}
        <Pie
          cx={cx}
          cy={cy}
          angle1={
            time_to_angle(sunrise) - 0.5 /* background can't shine through*/
          }
          angle2={
            time_to_angle(sunset) + 0.5 /* background can't shine through*/
          }
          rMin={0}
          rMax={daylightRadius}
          className={"sDay"}
        />
        {/* sunset to civil dusk */}
        <Pie
          cx={cx}
          cy={cy}
          angle1={time_to_angle(sunset)}
          angle2={time_to_angle(sunrise)}
          rMin={0}
          rMax={daylightRadius}
          className={"sCivilDusk"}
        />
        {/* civil dusk to nautical dusk */}
        <Pie
          cx={cx}
          cy={cy}
          angle1={time_to_angle(dusk)}
          angle2={time_to_angle(dawn)}
          rMin={0}
          rMax={daylightRadius}
          className={"sNauticalDusk"}
        />
        {/* nautical dusk through night */}
        <Pie
          cx={cx}
          cy={cy}
          angle1={time_to_angle(nautical_dusk)}
          angle2={time_to_angle(nautical_dawn)}
          rMin={0}
          rMax={daylightRadius}
          className={"sNight"}
        />
      </>
    );
  }

  return (
    <svg width={width} height={height}>
      {/* everything in here is calculated based on utc */}
      {/* and must be rotated according to the offset to utc */}
      <Rotate cx={cx} cy={cy} angle={time_to_angle(utc_offset)}>
        {sun_hours_display}

        {/* highlighted background */}
        <Dial
          cx={cx}
          cy={cy}
          radMax={highlight_max}
          radMin={highlight_min}
          textAlign="center-line"
          ticks={range(24).map((n) => ({
            angle: (360 * n) / 24,
            text: "",
            className: `sNone ${highlighted_hours.has(n) ? "sHighlight" : ""}`,
            classNameText: ""
          }))}
        />

        {/* hour hand */}
        <Rotate cx={cx} cy={cy} angle={time_to_angle(time)}>
          {/* sun */}
          <circle
            cx={cx}
            cy={cy + sun_distance}
            r={sun_radius}
            className={"sFillInk"}
          />

          {/* line of hour hand */}
          <line
            x1={cx}
            y1={cy + sun_distance}
            x2={cx}
            y2={cy + hour_hand_tip}
            className={"sLineInk"}
          />
        </Rotate>

        {/* main hour displays */}
        <Dial
          cx={cx}
          cy={cy}
          radMax={main_hour_display_max}
          radMin={main_hour_display_min}
          textAlign="center-range"
          textScale={main_hour_scale}
          dominantBaseline="central"
          fontSize={(main_hour_display_max - main_hour_display_min) * 0.6}
          ticks={range(24).map((n) => {
            let hourOf = hourTable[n];
            let moji = `${hourTable[n].emoji}\uFE0F`;
            return {
              angle: (360 * n) / 24,
              text: moji,
              className: `${sFillSeasonLookup[hourOf.season]} ${
                highlighted_hours.has(n) ? "sHighlight" : ""
              }`,
              classNameText: `sFillInk ${
                highlighted_hours.has(n) ? "sHighlight" : ""
              }`
            };
          })}
        />
      </Rotate>
    </svg>
  );
}
