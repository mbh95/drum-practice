import React from 'react';
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import About from "./About";
import Home from "./Home";
import MidiMonitor from "./MidiMonitor";
import MidiManager from "../midi/midi-manager";
import {useAsync} from "react-async";
import MetronomeController from "./MetronomeController";

export const MidiManagerContext = React.createContext<MidiManager | undefined>(undefined);
export const AudioContextContext = React.createContext<AudioContext | undefined>(undefined);

export default function App() {
    const midiSetup = useAsync({promiseFn: MidiManager.getInstance});

    if (!midiSetup.data) {
        return (<div>
            {midiSetup.error
                ? "Failed to initialize MIDI."
                : midiSetup.isPending
                    ? "Initializing MIDI..."
                    : "Done initializing MIDI."}a
        </div>);
    }
    return (
        <AudioContextContext.Provider value={new AudioContext()}>
            <MidiManagerContext.Provider value={midiSetup.data}>
                <Router>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/about">About</Link>
                            </li>
                            <li>
                                <Link to="/monitor">Monitor</Link>
                            </li>
                            <li>
                                <Link to="/metronome">Metronome</Link>
                            </li>
                        </ul>
                    </nav>
                    <Switch>
                        <Route path="/about">
                            <About/>
                        </Route>
                        <Route path="/monitor">
                            <MidiMonitor/>
                        </Route>
                        <Route path="/metronome">
                            <MetronomeController/>
                        </Route>
                        <Route path="/">
                            <Home/>
                        </Route>
                    </Switch>
                </Router>
            </MidiManagerContext.Provider>
        </AudioContextContext.Provider>);
}