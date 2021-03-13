import * as Tone from "tone";

const out = new Tone.Limiter(-1)
const distortion = new Tone.Distortion(0.8).connect(out);
const membrane = new Tone.MembraneSynth().connect(distortion);

export const kick = {
    membrane,
    distortion,
    out,
    trigger: (time, velocity, duration) => {
        membrane.triggerAttackRelease(membrane.frequency.value, duration, time, velocity)
    }
}