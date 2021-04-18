import React, {ChangeEvent, Component, useState} from 'react';
import MidiManager from "../midi/MidiManager";
import {Async} from "react-async";

interface MidiMonitorProps {
}

interface MidiMonitorState {
}

// const MidiMonitor2: Component<MidiMonitorProps, MidiMonitorState> = (props: MidiMonitorProps) => {
//     // const [count, setCount] = useState(0);
//
//     // Similar to componentDidMount and componentDidUpdate:
//     useEffect(() => {
//         // Update the document title using the browser API
//         document.title = `You clicked ${count} times`;
//     });
//
//         return (
//             <div>
//                 Midi Monitor!
//            </div>
//         );
// }

export default class MidiMonitor extends Component<MidiMonitorProps, MidiMonitorState> {

    constructor(props: MidiMonitorProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        return (
            <Async promiseFn={MidiManager.getInstance}>
                {({data, error, isPending}) => {
                    if (isPending) return "Loading..."
                    if (error) return `Failed to get MIDI Manager: ${error.message}`
                    if (data) return (
                        <div>
                            Midi Monitor!
                        </div>
                    )
                }}
            </Async>
        );
    }
}