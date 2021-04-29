import React, {useContext, useEffect, useRef, useState} from "react";
import IntervalClient from "../workers/interval/interval-client";
import {AudioContextContext} from "./App";

export default function Metronome(props: { bpm: number, running: boolean }) {
    const maybeAudioContext = useContext(AudioContextContext);

    const audioCtxRef = useRef<AudioContext>(maybeAudioContext!);
    let scheduledNotesRef = useRef<number[]>([]);
    let canvasRef = useRef<HTMLCanvasElement>(null);

    const [count, setCount] = useState<number>(3);
    const advanceCount = () => {
        setCount(c => (c + 1) % 4);
    };

    // Draw initial state.
    useEffect(() => {
        const ctx = canvasRef.current!.getContext("2d")!;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    }, []);

    // Render an animation.
    useEffect(() => {
        if (!props.running) {
            return;
        }
        let requestId: number;
        const render = () => {
            const ctx = canvasRef.current!.getContext("2d")!;
            ctx.fillStyle = "black";
            const audioCtx = audioCtxRef.current!;
            const scheduledNotes = scheduledNotesRef.current;
            while (scheduledNotes.length > 0 && scheduledNotes[0] < audioCtx.currentTime) {
                scheduledNotes.shift();
                ctx.fillStyle = "red";
                advanceCount();
            }
            // Why aren't width and height 100???
            // console.log(`width: ${canvasRef.current!.width}, height: ${canvasRef.current!.height}`);
            ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            requestId = requestAnimationFrame(render);
        };
        render();
        return () => {
            cancelAnimationFrame(requestId);
        }

    }, [props.running]);

    // Schedule note sounds.
    useEffect(() => {
        if (!props.running) {
            return;
        }
        const secsPerBeat = 60.0 / props.bpm;

        const scheduleAheadSecs = 0.1
        const intervalSecs = scheduleAheadSecs / 2.0;
        const intervalMillis = 1000 * intervalSecs;

        const beepLenSecs = 0.1;

        const audioCtx = audioCtxRef.current!;
        audioCtx.resume();
        // Scheduling the first note takes some time, so if we don't add some time it will get cut off.
        let nextNoteTimeSec = audioCtx.currentTime + 0.1;

        const schedule = () => {
            while (nextNoteTimeSec <= audioCtx.currentTime + scheduleAheadSecs) {
                scheduledNotesRef.current.push(nextNoteTimeSec);
                const oscillator = audioCtx.createOscillator();
                oscillator.connect(audioCtx.destination);
                oscillator.frequency.value = 444.0;
                oscillator.start(nextNoteTimeSec);
                oscillator.stop(nextNoteTimeSec + beepLenSecs);
                nextNoteTimeSec += secsPerBeat;
            }
        }
        const intervalClient = new IntervalClient(intervalMillis, schedule).start();
        return () => {
            intervalClient.stop().terminate();
        }
    }, [props.bpm, props.running]);

    return <div>
        <canvas ref={canvasRef} style={{width: '100px', height: '100px'}}/>
        <div>{count + 1}</div>
    </div>;
}