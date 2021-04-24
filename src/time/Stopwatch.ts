export default class Stopwatch {
    private running: boolean = false;
    private mostRecentStart: number = 0;
    private previouslyElapsedTime: number = 0;

    start() {
        if (this.running) {
            console.error("Tried to start a running stopwatch!");
            return;
        }
        this.mostRecentStart = performance.now();
        this.running = true;
    }

    isRunning() {
        return this.running;
    }

    stop() {
        if (!this.running) {
            console.error("Tried to stop a stopped stopwatch!");
            return;
        }
        this.previouslyElapsedTime = this.elapsedUpTo(performance.now());
        this.running = false;
    }

    reset() {
        this.previouslyElapsedTime = 0;
        this.running = false;
    }

    elapsed() {
        return this.elapsedUpTo(performance.now());
    }

    clear() {
        const clearTime = performance.now();
        const elapsed = this.elapsedUpTo(clearTime);
        this.mostRecentStart = clearTime;
        this.previouslyElapsedTime = 0;
        return elapsed;
    }

    private elapsedUpTo(t: number) {
        if (this.running) {
            return this.previouslyElapsedTime + (t - this.mostRecentStart);
        } else {
            return this.previouslyElapsedTime;
        }
    }
}