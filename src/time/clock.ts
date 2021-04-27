import {DurationMillis, InstantMillis} from "./units";

export type TickFn = (t: InstantMillis, dt: DurationMillis) => void;

export default interface Clock {
    isRunning(): boolean;

    start(): void;

    stop(): void;
}