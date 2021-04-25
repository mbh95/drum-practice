import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import About from "./About";
import Home from "./Home";
import MidiMonitor from "./MidiMonitor";
import MidiManager from "../midi/MidiManager";
import {useAsync} from "react-async";
import Metronome from "./Metronome";

export const MidiContext = React.createContext<MidiManager | undefined>(undefined);

export default function App() {
    const {data, error, isPending} = useAsync({promiseFn: MidiManager.getInstance});
    if (isPending) {
        return <div>"Initializing MIDI..."</div>;
    }
    if (error) {
        return <div>`Something went wrong: ${error.message}`</div>;
    }
    if (data) {
        return (
            <MidiContext.Provider value={data}>
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
                            <Metronome bpm={1000} />
                        </Route>
                        <Route path="/">
                            <Home/>
                        </Route>
                    </Switch>
                </Router>
            </MidiContext.Provider>);
    }
    return null;
}