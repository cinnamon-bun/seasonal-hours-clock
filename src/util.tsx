
export let config = {
    res: 700,
    showDebug: false,
    useAmPm: true,
    redrawEveryNSeconds: 10,
}

//================================================================================
// HELPERS

export let interp = (a: number, b: number, tt: number): number =>
    a + (b-a) * tt;

// array from 0 to n-1
export let range = (n: number): number[] =>
    Array(n).fill(0).map((x, ii) => ii);