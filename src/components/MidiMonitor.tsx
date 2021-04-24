import React, {useContext} from 'react';
import {MidiContext} from "./App";

export default function MidiMonitor() {
    const maybeMidiManager = useContext(MidiContext);
    if (maybeMidiManager === undefined) {
        return <div>Error: No Midi context.</div>
    }
    return <div> </div>;
}