import React, {useEffect, useState} from "react";
import IntervalClock from "../time/interval-clock";

export default function Metronome(props: { bpm: number }) {
    const [count, setCount] = useState<number>(0);
    const advanceCount = () => {
        setCount(c => (c + 1) % 4);
    };

    useEffect(() => {
        const msPerBeat = 60 * 1000 / props.bpm;
        const clock = new IntervalClock(msPerBeat, advanceCount);
        clock.start();
        return () => {
            clock.stop();
        }
    }, [props.bpm]);

    return <div> {count + 1} </div>;
}