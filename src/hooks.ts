import React from 'react';

export let useTimer = (ms: number): number => {
    // redraw every so often
    let [tick, setTick] = React.useState(0);
    React.useEffect(() => {
        let redrawInterval = setInterval(() => {
            setTick(t => t + 1);
        }, ms);
        return () => { clearInterval(redrawInterval); };
    }, [ms]);
    return tick;
}
