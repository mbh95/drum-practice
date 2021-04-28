/**
 * Types shared by interval.worker and WorkerClient.
 */
export enum IntervalMessageType {
    START = "START",
    STOP = "STOP",
    SET_INTERVAL = "SET_INTERVAL",
    TICK = "TICK",
}

export interface SetIntervalMessage {
    readonly type: IntervalMessageType.SET_INTERVAL;
    readonly interval: number;
}