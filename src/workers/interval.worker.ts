export {};

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

let timerID: NodeJS.Timeout | undefined;
let interval = 100;

ctx.onmessage = function (e: MessageEvent) {
    if (e.data === "start") {
        console.log("starting");
        timerID = setInterval(function () {
            postMessage("tick");
        }, interval)
    } else if (e.data.interval) {
        console.log("setting interval");
        interval = e.data.interval;
        console.log("interval=" + interval);
        if (timerID) {
            clearInterval(timerID);
            timerID = setInterval(function () {
                postMessage("tick");
            }, interval)
        }
    } else if (e.data === "stop") {
        console.log("stopping");
        if (timerID) {
            clearInterval(timerID);
            timerID = undefined;
        }
    }
};