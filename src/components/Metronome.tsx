import React, {useEffect} from "react";
import Clock from "../time/Clock";

export default function Metronome(props: {bpm: number}) {
    const beep = (t: number, dt: number) => {
        console.log(`beep: (${t}, ${dt})`);
    }

    const msPerBeat = 60 * 1000 / props.bpm;
    const clock = new Clock(msPerBeat, beep);

    const update = () => {
        clock.update();
        requestAnimationFrame(update);
    };

    useEffect(()=> {
        clock.start();
        requestAnimationFrame(update);
    }, []);

    return <div> This is a metronome! </div>;
}