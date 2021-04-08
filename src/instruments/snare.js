import * as Tone from "tone";

const out = new Tone.Limiter(-1)
const env = new Tone.AmplitudeEnvelope()
    .connect(out);
const membrane = new Tone.MembraneSynth({
    'pitchDecay' : 0,
    'envelope' : {
        'attack' : 0.005,
        'decay' : 0.08,
        'sustain' : 0.01,
        'release' : 0.01
    },
    frequency: 160
}).connect(out)

const filter = new Tone.Filter(5000, "bandpass", -12)
    .connect(env);
const source = new Tone.Noise()
    .connect(filter)
    .start();

export const snare = {
    out,
    env,
    membrane,
    filter,
    source,
    trigger: (time, velocity, duration) => {
        env.triggerAttack(time, velocity)
        env.triggerRelease(time+0.001)
        membrane.triggerAttackRelease(snare.membrane.frequency.value, duration, time, velocity)
    }
}