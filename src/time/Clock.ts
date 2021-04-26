import {DurationMillis, InstantMillis} from "./Units";

export type TickFn = (t: InstantMillis, dt: DurationMillis) => void;

export default interface Clock {
    isRunning(): boolean;

    start(): void;

    stop(): void;
}