import * as React from "react";
import "./styles.css";

import {
    config,
    range,
} from './util';
import {
    Rec, Rotate,
} from './svg-utils';
import { Dial } from './dial';
import {
    cInk,
    cInkFaint,
    sFillDebug,
    sFillSeasonLookup,
    sLineDebug,
    sLineInk,
    sNone,
} from './styles';
import {
    hourTable
} from './seasonal-hours';

//================================================================================
// MAIN

let hourToString = (n: number): string => {
    if (n === 12) { return 'Noon'; }
    if (n === 0) { return 'Midnight'; }
    if (config.useAmPm) {
        let isAm = (n <= 11);
        let ampm = isAm ? 'a' : 'p';
        let n2 = n % 12;
        if (n2 === 0) { n2 = 12; }
        return `${n2}${ampm}`;
    } else {
        return (''+n).padStart(2, '0');
    }
}

export default function App() {

    // redraw every so often
    let [, setTick] = React.useState(0);
    React.useEffect(() => {
        console.log('setting up interval');
        let interval = setInterval(() => {
            console.log('interval');
            setTick(t => t + 1);
        }, config.redrawEveryNSeconds * 1000);
        return () => { clearInterval(interval); };
    }, []);

    let res = config.res;
    let cx = res/2;
    let cy = res/2;
    let radMax = res/2 * 0.98;
    let now = new Date();
    let hoursOffset = now.getTimezoneOffset() / 60;
    // range: 0-1 (midnight to midnight)
    let nowDayPct = now.getHours() / 24 + now.getMinutes() / 24 / 60;
    return <div className="App">
        <svg
            width={config.res}
            height={config.res}
            style={sFillDebug}
            >
            <Rec cx={cx} cy={cy} rx={res/2 - 1} style={sLineDebug} />
            <circle cx={cx} cy={cy} r={5} style={sLineDebug} />
            <circle cx={cx} cy={cy} r={res/2} style={sLineDebug} />
            <Rotate cx={cx} cy={cy}
                angle={(12 - hoursOffset) * 360/24}
                >
                {/* season hours */}
                <Dial
                    cx={cx} cy={cy}
                    radMax={radMax * 0.9} radMin={radMax * 0.8}
                    textAlign='center-range'
                    textScale={0.39}
                    ticks={range(24).map(n => {
                        let hourOf = hourTable[n];
                        return {
                            angle: 360 * n / 24,
                            text: hourOf.shortName,
                            bgStyle: sFillSeasonLookup[hourOf.season],
                            cText: cInk,
                        };
                    })}
                    />
                {/* inner ring: utc */}
                <Dial
                    cx={cx} cy={cy}
                    radMax={radMax * 0.8} radMin={radMax * 0.727}
                    textAlign='center-line'
                    ticks={range(24).map(n => ({
                        angle: 360 * n / 24,
                        text: 'U ' + (''+n).padStart(2, '0'),
                        bgStyle: sNone,
                        cText: cInkFaint,
                    }))}
                    />
            </Rotate>
            {/* outer ring: local time */}
            <Dial
                cx={cx} cy={cy}
                radMax={radMax * 1.01} radMin={radMax * 0.9}
                textAlign='center-line'
                textScale={0.62}
                ticks={range(24).map(n => ({
                    angle: 360 * n / 24,
                    text: hourToString((n + 12) % 24),
                    bgStyle: sNone,
                    cText: cInk,
                }))}
                />
            {/* hour hand */}
            <Rotate cx={cx} cy={cy} angle={nowDayPct * 360}>
                <line x1={cx} y1={cy + radMax*0.5} x2={cx} y2={cy + radMax*0.82} style={sLineInk} />
            </Rotate>
        </svg>
    </div>
}