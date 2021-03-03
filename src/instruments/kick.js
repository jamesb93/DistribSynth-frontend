import * as Tone from "tone";

const out = new Tone.Limiter(-1)
const distortion = new Tone.Distortion(0.8).connect(out);
const waveshaper = new Tone.Chebyshev(1).connect(distortion);
const env = new Tone.MembraneSynth().connect(waveshaper);

export const kick = {
    env,
    waveshaper,
    distortion,
    out
}