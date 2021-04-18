import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import About from "./About";
import Home from "./Home";
import MidiMonitor from "./MidiMonitor";
import MidiManager from "../midi/MidiManager";

export default function App() {
    // const midiManager = MidiManager.getInstance();

    // console.log("App constructor.");

    // const testPromise = new Promise((resolve, reject) => {
    //     WebMidi.enable(function (err) {
    //         if (err) {
    //             console.log("WebMidi could not be enabled.", err);
    //             reject();
    //         } else {
    //             console.log("WebMidi enabled!");
    //             console.log(`Available inputs: ${WebMidi.inputs.map(i => i.name)}`);
    //             resolve('foo');
    //         }
    //     });
    // });
    //
    // testPromise

    // WebMidi.enable(function (err) {
    //     if (err) {
    //         console.log("WebMidi could not be enabled.", err);
    //     } else {
    //         console.log("WebMidi enabled!");
    //         console.log(`Available inputs: ${WebMidi.inputs.map(i => i.name)}`);
    //     }
    // });


    // WebMidi.enabled;
    return (
        <div className="App">
            <header className="App-header">
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
                        </ul>
                    </nav>
                    <Switch>

                        <Route path="/about">
                            <About/>
                        </Route>
                        <Route path="/monitor">
                            <MidiMonitor />
                        </Route>
                        <Route path="/">
                            <Home/>
                        </Route>
                    </Switch>
                </Router>
            </header>
        </div>

    );
}