import Stopwatch from "./Stopwatch";
import Clock, {TickFn} from "./Clock";
import {DurationMillis, InstantMillis} from "./Units";

export default class InertClock implements Clock {
    private readonly tick: TickFn;
    private readonly stopwatch: Stopwatch;
    private readonly period: DurationMillis; // Time between ticks.
    private previousTick: InstantMillis = 0;
    private accumlatedTime: DurationMillis = 0;

    constructor(
        period: DurationMillis,
        tick: TickFn,
        stopwatch = new Stopwatch()) {
        if (period <= 0) {
            throw new Error(`Period must be > 0, was ${period} ms.`);
        }
        this.period = period;
        this.tick = tick;
        this.stopwatch = stopwatch;
    }

    isRunning(): boolean {
        return this.stopwatch.isRunning();
    }

    start() {
        if (this.isRunning()) {
            throw new Error("Tried to start a running clock!");
        }
        this.stopwatch.start();
    }

    stop() {
        if (!this.isRunning()) {
            throw new Error("Tried to stop a stopped clock!");
        }
        this.stopwatch.stop();
    }

    /**
     * Accumulate time and call the tick function appropriately.
     *
     * @returns - An alpha value in [0, 1) representing how close we are to the next tick. Intended for interpolation.
     * E.g. a return value of 0.5 means that we are halfway to the next tick after update() returns.
     */
    update(): number {
        if (!this.isRunning()) {
            throw new Error("Tried to update a stopped clock!");
        }

        this.accumlatedTime += this.stopwatch.getElapsedAndReset();

        while (this.accumlatedTime >= this.period) {
            this.previousTick += this.period;
            this.tick(this.previousTick, this.period);
            this.accumlatedTime -= this.period;
        }
        return this.accumlatedTime / this.period;
    }
}