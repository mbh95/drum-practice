import React, {useEffect, useRef, useState} from "react";
import IntervalClient from "../workers/interval/interval-client";

export default function Metronome(props: { bpm: number }) {
    const [count, setCount] = useState<number>(0);
    const advanceCount = () => {
        setCount(c => (c + 1) % 4);
    };
    let scheduledNotesRef = useRef<number[]>([]);
    let audioCtxRef = useRef<AudioContext>();
    let canvasRef = useRef<HTMLCanvasElement>(null);

    // Create the audio context.
    useEffect(() => {
        audioCtxRef.current = new AudioContext();
        return () => {
            audioCtxRef.current?.close();
        }
    }, []);

    // Render an animation.
    useEffect(() => {
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
            ctx.fillRect(0,0,canvasRef.current!.width,canvasRef.current!.height);
            requestId = requestAnimationFrame(render);
        };
        render();
        return () => {
            cancelAnimationFrame(requestId);
        }
    }, [props.bpm]);

    // Schedule note sounds.
    useEffect(() => {
        const secsPerBeat = 60.0 / props.bpm;

        const scheduleAheadSecs = 1.0
        const intervalSecs = scheduleAheadSecs / 2.0;
        const intervalMillis = 1000 * intervalSecs;

        const beepLenSecs = 0.1;

        const audioCtx = audioCtxRef.current!;
        let nextNoteTimeSec = audioCtx.currentTime + 10 * beepLenSecs;

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
            intervalClient.terminate();
        }
    }, [props.bpm]);

    return <div>
        <canvas ref={canvasRef} style={{width: '100px', height: '100px'}}/>
        <div>{count + 1}</div>
    </div>;
}