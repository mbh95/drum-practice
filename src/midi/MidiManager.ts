// Keep a list of available devices

export class MidiManager {
    private midiAccess: WebMidi.MIDIAccess | undefined;
    private inputs: Map<string, WebMidi.MIDIInput> = new Map();

    static async getInstance(): Promise<MidiManager> {
        return navigator.requestMIDIAccess()
            .then(access => new MidiManager(access));
    }

    constructor(midiAccess: WebMidi.MIDIAccess) {
        this.midiAccess = midiAccess;
        for (let input of this.midiAccess.inputs.values()) {
            this.initializeInput(input);
            console.log(this);
        }
    }

    private initializeInput(input: WebMidi.MIDIInput) {
        input.onmidimessage = getMIDIMessage;
        this.inputs.set(input.id, input);
        input.addEventListener('midimessage', ({data}) => console.log(data));
    }

    public getAvailableInputNames(): string[] {
        return [...this.inputs.values()].filter(i => i !== undefined).map(i => i.name!);
    }
}

function getMIDIMessage(message: any) {
    console.log('New midi message!');
    console.log(message);
    const command = message.data[0] & 0xF0;  // & 11110000
    const note = message.data[1];
    const velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

    switch (command) {
        case 144: // note on
            if (velocity > 0) {
                noteOn(note);
            } else {
                noteOff(note);
            }
            break;
        case 128: // note off
            noteOff(note);
            break;
        // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
    }
}
// Function to handle noteOn messages (ie. key is pressed)
// Think of this like an 'onkeydown' event
function noteOn(note: any) {
    console.log(`noteOn: ${note}`);
}

// Function to handle noteOff messages (ie. key is released)
// Think of this like an 'onkeyup' event
function noteOff(note: any) {
    console.log(`noteOff: ${note}`);
}

export default MidiManager;