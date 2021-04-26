import {DurationMillis, InstantMillis, TimeSourceMillis} from "./Units";

export default class Stopwatch {
    private readonly now: TimeSourceMillis;
    private startTime?: InstantMillis;
    private elapsed: DurationMillis = 0;

    /**
     * Create a stopwatch based on a time source.
     *
     * @param {TimeSource} now - Monotonic time source that returns the current time in milliseconds. Defaults to performance.now().
     */
    constructor(now: TimeSourceMillis = () => performance.now()) {
        this.now = now;
    }

    isRunning(): boolean {
        return this.startTime !== undefined;
    }

    start(): void {
        if (this.isRunning()) {
            throw new Error("Tried to start a running stopwatch!");
        }
        this.startTime = this.now();
    }

    stop() {
        if (!this.isRunning()) {
            throw new Error("Tried to stop a stopped stopwatch!");
        }
        this.elapsed = this.getElapsed();
    }

    getElapsed(): DurationMillis {
        return this.getElapsedUpTo(this.now());
    }

    getElapsedAndReset(): DurationMillis {
        const resetTime = this.now();
        const elapsed = this.getElapsedUpTo(resetTime);
        if (this.isRunning()) {
            this.startTime = resetTime;
        }
        this.elapsed = 0;
        return elapsed;
    }

    private getElapsedUpTo(t: InstantMillis): DurationMillis {
        if (this.isRunning()) {
            return this.elapsed + (t - this.startTime!);
        } else {
            return this.elapsed;
        }
    }
}