import Stopwatch from "./Stopwatch";
import Clock, {TickFn} from "./Clock";
import {DurationMillis} from "./Units";
import InertClock from "./InertClock";

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
    private intervalId?: NodeJS.Timeout; // Handle for the scheduled interval. Used to cancel scheduling with clearInterval().

    constructor(
        period: DurationMillis,
        tick: TickFn,
        interval: DurationMillis = 20,
        stopwatch = new Stopwatch()) {
        if (period <= 0) {
            throw new Error(`Period must be > 0, was ${period} ms.`);
        }
        this.interval = interval;
        this.internalClock = new InertClock(period, tick, stopwatch);
    }

    isRunning(): boolean {
        return this.internalClock.isRunning() && this.intervalId !== undefined;
    }

    start() {
        if (this.isRunning()) {
            throw new Error("Tried to start a running clock!");
        }
        this.internalClock.start();
        this.intervalId = setInterval(() => this.internalClock.update(), 20);
    }

    stop() {
        if (!this.isRunning()) {
            throw new Error("Tried to stop a stopped clock!");
        }
        this.internalClock.stop();
        clearInterval(this.intervalId!);
        this.intervalId = undefined;
    }
}