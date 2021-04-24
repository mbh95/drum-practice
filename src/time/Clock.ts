import Stopwatch from "./Stopwatch";

export default class Clock {
    private readonly callback: (t: number, dt: number) => void;
    private readonly stopwatch: Stopwatch;
    private readonly period: number;
    private previousTick: number = 0;
    private accumulator: number = 0;

    constructor(period: number, callback: (t: number, dt: number) => void) {
        if (period <= 0) {
            throw new Error(`Period must be > 0, was ${period}`);
        }
        this.stopwatch = new Stopwatch();
        this.period = period;
        this.callback = callback;
    }

    isRunning(): boolean {
        return this.stopwatch.isRunning();
    }

    start() {
        if (this.isRunning()) {
            console.error("Tried to start a running clock!");
            return;
        }
        this.stopwatch.start();
    }

    update(): number {
        if (!this.isRunning()) {
            console.error("Tried to update a stopped clock!");
            return 0;
        }

        this.accumulator += this.stopwatch.clear();

        while (this.accumulator >= this.period) {
            this.previousTick += this.period;
            this.callback(this.previousTick, this.period);
            this.accumulator -= this.period;
        }
        return this.accumulator / this.period;
    }
}