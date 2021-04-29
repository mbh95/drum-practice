import React, {useEffect, useRef, useState} from "react";
import Metronome from "./Metronome";

export default function MetronomeController() {
    const [bpm, setBpm] = useState<number>(60);
    const [running, setRunning] = useState<boolean>(false);
    const slider = useRef<HTMLInputElement>(null);
    useEffect(() => {
        slider.current!.oninput = () => {
            setBpm(slider.current!.valueAsNumber)
        };
    }, []);

    return (<div>
        <div>{bpm} bpm</div>
        <input ref={slider} type="range" min={30} max={300} defaultValue={60} className="slider" id="myRange"/>
        <button onClick={() => setRunning(r => !r)}>{running ? "Stop" : "Start"}</button>
        <Metronome bpm={bpm} running={running}/>
    </div>);
}