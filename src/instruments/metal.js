import * as Tone from "tone";

const out = new Tone.Gain(1)
const limiter = new Tone.Limiter(-1).connect(out)
const waveshaper = new Tone.Chebyshev(1).connect(limiter);
const source = new Tone.MetalSynth().connect(waveshaper);

export const metal = {
    out,
    waveshaper,
    source,
    trigger: (time) => {
        source.triggerAttackRelease(source.frequency.value, "8n", time)
    }
}