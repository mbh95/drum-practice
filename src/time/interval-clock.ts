import Stopwatch from "./stopwatch";
import Clock, {TickFn} from "./clock";
import {DurationMillis} from "./units";
import InertClock from "./inert-clock";

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import IntervalWorker from "worker-loader!../workers/interval.worker";

export default class IntervalClock implements Clock {
    private readonly internalClock: InertClock;
    /**
     * How often the clock should try to update (accumulate time and call the tick function).
     *
     * In practice this is the target maximum error between when a tick should have happened and when it actually happened.
     * However, because setInterval can be arbitrarily "late" these errors could be arbitrarily large.
     *
     * tl;dr:
     * Lower value = More accurate clock, but time is accumulated more often.
     * Higher value = Less accurate, but saves processing time.
     * Defaults to 20ms.
     */
    private readonly interval: DurationMillis;
    private intervalWorker?: IntervalWorker;

    constructor(
        period: DurationMillis,
        tick: TickFn,
        interval: DurationMillis = 20,
        stopwatch = new Stopwatch()) {
        if (period <= 0) {
            throw new Error(`Period must be > 0, was ${period} ms.`);
        }
        this.internalClock = new InertClock(period, tick, stopwatch);
        this.interval = interval;
    }

    isRunning(): boolean {
        return this.internalClock.isRunning() && this.intervalWorker !== undefined;
    }

    start() {
        if (this.isRunning()) {
            throw new Error("Tried to start a running clock!");
        }
        this.internalClock.start();
        this.intervalWorker = new IntervalWorker();
        this.intervalWorker.postMessage({interval: this.interval});
        this.intervalWorker.onmessage = (e) => {
            if (e.data === "tick") {
                this.internalClock.update();
            }
        };
        this.intervalWorker.postMessage("start");
    }

    stop() {
        if (!this.isRunning()) {
            throw new Error("Tried to stop a stopped clock!");
        }
        this.internalClock.stop();
        if (this.intervalWorker !== undefined) {
            this.intervalWorker.postMessage("stop");
            this.intervalWorker.terminate();
        }
    }
}