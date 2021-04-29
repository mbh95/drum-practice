import React, {useContext} from 'react';
import {MidiManagerContext} from "./App";

export default function MidiMonitor() {
    const maybeMidiManager = useContext(MidiManagerContext);
    if (maybeMidiManager === undefined) {
        return <div>Error: No Midi context.</div>
    }
    return <div> </div>;
}