import {IntervalMessageType} from "./interval-messages";

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

let timerID: NodeJS.Timeout | undefined;
let interval = 100;

const tick = () => {
    postMessage(IntervalMessageType.TICK);
}

ctx.addEventListener("message", (e: MessageEvent) => {
    if (e.data === IntervalMessageType.START) {
        console.log(`Interval web worker starting with an interval of ${interval}ms...`);
        timerID = setInterval(tick, interval)
    } else if (e.data === IntervalMessageType.STOP) {
        console.log(`Interval web worker stopping...`);
        if (timerID) {
            clearInterval(timerID);
            timerID = undefined;
        }
    } else if (e.data.type === IntervalMessageType.SET_INTERVAL && e.data.interval) {
        interval = e.data.interval;
        if (timerID) {
            clearInterval(timerID);
            timerID = setInterval(tick, interval);
        }
    }
});