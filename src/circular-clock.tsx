import { ClockUiProps } from "./clock";

import { range } from "./util";
import { Pie, Rotate } from "./svg-utils";
import { Dial } from "./dial";
import { sFillSeasonLookup } from "./styles";

// If the radius is this or more, display the utc time outside the main dial.
const show_utc_radius = 119;
// If the radius is this or more, displays hour names in the main dial.
const show_names_radius = 332;
// If the radius is less than this, do not display all hours.
const hide_hours_radius = 102;
// If the radius is less than this, abandon all circular hopes.
const give_up_radius = 61;

let hourToString = (n: number): string => {
  const nToUse = (n + 12) % 24;

  if (nToUse < 10) {
    return `0${nToUse}`;
  }

  return `${nToUse}`;
};

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

  /* Clock layout, intialized to the smallest circular clock */
  let main_start = 0.75;
  let main_width = 0.2;
  let main_width_max = 35; // absolute in pixel

  let inner_offset = -0.03; // relative to main_start, determines end not start
  let inner_width = 0.18;
  let inner_width_max = 36; // absolute in pixel

  let outer_offset = 0; // relative to main_start + main_width
  let outer_width = 0;
  let outer_width_max = 23; // absolute in pixel

  let highlight_offset_inner = 0.005; // relative to inner_offset
  let highlight_offset_outer = 0.04; // relative to outer_offset + outer_width

  let daylight_start = 0; // relative to zero
  let daylight_offset_outer = -0.02; // relative to inner_offset

  let sun_center = (main_start + inner_offset + daylight_offset_outer) * 0.5;
  let hour_hand_offset = -0.02; // relative to main_start

  let main_scale = 0.7;
  let inner_scale = 0.6;
  let outer_scale = 0.6;
  let outer_emoji_scale = 1.2;

  let show_local_times_divisible_by = 1;

  /* Change the layout depending on how much space is available */

  if (radius < hide_hours_radius) {
    main_width = 0;
    highlight_offset_inner = 0;
    highlight_offset_outer = -inner_width;
    show_local_times_divisible_by = 6;
    hour_hand_offset = -inner_width / 2;
    daylight_start = 20;
  }

  if (radius < give_up_radius) {
    daylight_start = 0;
    daylight_offset_outer = inner_offset;
  }

  if (radius >= show_utc_radius) {
    main_start = 0.65;
    inner_width = 0.15;
    outer_offset = 0.005;
    outer_width = 0.15;
    highlight_offset_outer = 0;
  }

  if (radius >= show_names_radius) {
    const max = 13.376 / main_width_max; // font size of 13.376
    main_scale = Math.min(max, 0.32);
    highlight_offset_outer = 0.06;
  }

  const main_annulus_start = radius * main_start;
  const main_annulus_end =
    main_annulus_start + Math.min(radius * main_width, main_width_max);

  const inner_annulus_end =
    main_annulus_start - (radius >= 190 ? -4 : radius * inner_offset);
  const inner_annulus_start =
    inner_annulus_end - Math.min(radius * inner_width, inner_width_max);

  const outer_annulus_start = main_annulus_end + radius * outer_offset;
  const outer_annulus_end =
    outer_annulus_start + Math.min(radius * outer_width, outer_width_max);

  const highlight_annulus_start =
    inner_annulus_start + radius * highlight_offset_inner;
  const highlight_annulus_end =
    outer_annulus_end + radius * highlight_offset_outer;

  const daylight_annulus_start = daylight_start;
  const daylight_annulus_end =
    inner_annulus_start + radius * daylight_offset_outer;

  const sun_distance = radius * sun_center;
  const sun_radius = radius * 0.035;
  const hour_hand_tip = main_annulus_start + radius * hour_hand_offset;

  // Convert a fraction of the day to an angle on the face of the clock.
  const time_to_angle = (time: number) => {
    return time * 360 + 0;
  };

  const determine_highlighting = (hour: number) => {
    // console.log(`r: ${radius}; threshold: ${show_utc_radius}`);

    if (highlighted_hours.has(hour)) {
      if (radius >= show_utc_radius) {
        return "sHighlight";
      } else {
        return "sHighlightStrongly";
      }
    } else {
      return "";
    }
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
          rMin={daylight_annulus_start}
          rMax={daylight_annulus_end}
          className={"sDay"}
        />
        {/* sunset to civil dusk */}
        <Pie
          cx={cx}
          cy={cy}
          angle1={time_to_angle(sunset)}
          angle2={time_to_angle(sunrise)}
          rMin={daylight_annulus_start}
          rMax={daylight_annulus_end}
          className={"sCivilDusk"}
        />
        {/* civil dusk to nautical dusk */}
        <Pie
          cx={cx}
          cy={cy}
          angle1={time_to_angle(dusk)}
          angle2={time_to_angle(dawn)}
          rMin={daylight_annulus_start}
          rMax={daylight_annulus_end}
          className={"sNauticalDusk"}
        />
        {/* nautical dusk through night */}
        <Pie
          cx={cx}
          cy={cy}
          angle1={time_to_angle(nautical_dusk)}
          angle2={time_to_angle(nautical_dawn)}
          rMin={daylight_annulus_start}
          rMax={daylight_annulus_end}
          className={"sNight"}
        />
      </>
    );
  }

  return (
    <svg width={width} height={height}>
      {/* everything in here is calculated based on utc */}
      {/* and must be rotated according to the offset to utc */}
      {radius >= give_up_radius && (
        <Rotate cx={cx} cy={cy} angle={time_to_angle(utc_offset)}>
          {sun_hours_display}
          {/* highlighted background */}
          <Dial
            cx={cx}
            cy={cy}
            radMax={highlight_annulus_end}
            radMin={highlight_annulus_start}
            textAlign="center-line"
            ticks={range(24).map((n) => ({
              angle: (360 * n) / 24,
              text: "",
              className: `sNone ${determine_highlighting(n)}`,
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
            radMax={main_annulus_end}
            radMin={main_annulus_start}
            textAlign="center-range"
            textScale={main_scale}
            dominantBaseline={
              radius >= show_names_radius ? "mathematical" : "central"
            }
            ticks={range(24).map((n) => {
              let hourOf = hourTable[n];
              const label =
                radius >= show_names_radius
                  ? `${hourOf.shortName[0].toUpperCase()}${hourOf.shortName.slice(
                      1
                    )}`
                  : `${hourOf.emoji}\uFE0F`;

              return {
                angle: (360 * n) / 24,
                text: label,
                className: `${
                  sFillSeasonLookup[hourOf.season]
                } ${determine_highlighting(n)}`,
                classNameText: `sFillInk ${determine_highlighting(n)}`
              };
            })}
          />
          {/* utc time */}
          <Dial
            cx={cx}
            cy={cy}
            radMax={outer_annulus_end}
            radMin={outer_annulus_start}
            textAlign="center-line"
            textScale={outer_scale}
            ticks={range(24).map((n) => ({
              angle: (360 * n) / 24,
              text: `U ${("" + n).padStart(2, "0")}`,
              className: "sNone",
              classNameText: "sFillInkFaint"
            }))}
          />
          {/* emoji on outer ring */}
          {radius >= show_names_radius && (
            <Dial
              cx={cx}
              cy={cy}
              radMax={outer_annulus_end}
              radMin={outer_annulus_start}
              textAlign="center-line"
              textScale={outer_emoji_scale}
              dominantBaseline="text-top"
              ticks={range(24).map((n) => ({
                angle: (360 * (n + 0.5)) / 24,
                text: `${hourTable[n].emoji}\uFE0F`,
                className: "sNone",
                classNameText: "sFillInkFaint"
              }))}
            />
          )}
        </Rotate>
      )}

      {/* local time */}
      {radius >= give_up_radius && (
        <Dial
          cx={cx}
          cy={cy}
          radMax={inner_annulus_end}
          radMin={inner_annulus_start}
          textAlign="center-line"
          textScale={inner_scale} // overwritten by fontSize
          fontSize={Math.max(
            (inner_annulus_end - inner_annulus_start) * inner_scale,
            11.2
          )}
          ticks={range(24).map((n) => ({
            angle: (360 * n) / 24 + 540,
            text:
              n % show_local_times_divisible_by === 0 ? hourToString(n) : ".",
            className: "sNone",
            classNameText: "sFillInk"
          }))}
        />
      )}

      <text
        dx={cx}
        dy={cy + 7}
        textAnchor="middle"
        dominantBaseline="center"
        fontSize="24"
      >
        {radius < hide_hours_radius &&
          `${hourTable[Math.floor(time * 24)].emoji}`}
      </text>
    </svg>
  );
}
