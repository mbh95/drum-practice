import Stopwatch from "./stopwatch";
import Clock, {TickFn} from "./clock";
import {DurationMillis} from "./units";
import InertClock from "./inert-clock";
import IntervalClient from "../workers/interval/interval-client";

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
    private intervalClient?: IntervalClient;

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
        return this.internalClock.isRunning();
    }

    start() {
        if (this.isRunning()) {
            throw new Error("Tried to start a running clock!");
        }
        this.internalClock.start();
        this.intervalClient = new IntervalClient(
            this.interval,
            () => this.internalClock.update()
        ).start();
    }

    stop() {
        if (!this.isRunning()) {
            throw new Error("Tried to stop a stopped clock!");
        }
        this.internalClock.stop();
        if (this.intervalClient !== undefined) {
            this.intervalClient.stop().terminate();
        }
    }
}