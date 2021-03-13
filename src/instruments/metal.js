import * as Tone from "tone";

class MetalSynthesis {
    constructor() {
        this.out = new Tone.Gain(1)
        this.limiter = new Tone.Limiter(-1).connect(this.out)
        this.waveshaper = new Tone.Chebyshev(1).connect(this.limiter);
        this.source = new Tone.MetalSynth().connect(this.waveshaper);
    }

    trigger = (time, velocity, duration) => {
        this.source.triggerAttackRelease(this.source.frequency.value, duration, time, velocity)
    }
}

export {MetalSynthesis}