// eslint-disable-next-line no-restricted-globals,import/no-webpack-loader-syntax
import IntervalWorker from "worker-loader!./interval.worker";
import {IntervalMessageType, SetIntervalMessage,} from "./interval-messages";

/**
 * Friendly wrapper around the Worker message API used by the interval worker.
 */
export default class IntervalClient {
    private readonly worker: IntervalWorker;
    private tickFn: () => void;

    constructor(interval: number, tickFn: () => void) {
        this.tickFn = tickFn;
        this.worker = new IntervalWorker();
        this.worker.onmessage = (e: MessageEvent) => this.messageHandler(e);
        this.setTickFn(tickFn);
        this.setInterval(interval);
    }

    start(): IntervalClient {
        this.worker.postMessage(IntervalMessageType.START);
        return this;
    }

    stop(): IntervalClient {
        this.worker.postMessage(IntervalMessageType.STOP);
        return this;
    }

    setInterval(interval: number): IntervalClient {
        const setIntervalMessage: SetIntervalMessage = {
            type: IntervalMessageType.SET_INTERVAL,
            interval
        }
        this.worker.postMessage(setIntervalMessage);
        return this;
    }

    setTickFn(tickFn: () => void): IntervalClient {
        this.tickFn = tickFn;
        return this;
    }

    terminate() {
        this.worker.terminate();
    }

    private messageHandler(e: MessageEvent) {
        if (e.data === IntervalMessageType.TICK) {
            this.tickFn();
        }
    }
}