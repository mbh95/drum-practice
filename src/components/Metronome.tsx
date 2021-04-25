import React, {useEffect, useState} from "react";
import Clock from "../time/Clock";

export default function Metronome(props: { bpm: number }) {
    const [count, setCount] = useState<number>(0);
    const advanceCount = () => {
        setCount(c => (c + 1) % 4);
    };

    useEffect(() => {
        const msPerBeat = 60 * 1000 / props.bpm;
        const clock = new Clock(msPerBeat, advanceCount);
        clock.start();
        const intervalId = setInterval(() => clock.update(), 20);
        return () => {
            clearInterval(intervalId);
        }
    }, [props.bpm]);

    return <div> {count} </div>;
}