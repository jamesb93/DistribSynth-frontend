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
    }
}).connect(out)
membrane.frequency.rampTo(160, 0.1)

const filter = new Tone.Filter(2750, "bandpass", -12)
    .connect(env);
const source = new Tone.Noise()
    .connect(filter)
    .start()

export const snare = {
    source,
    filter,
    membrane,
    env,
    out,
    trigger: (time, velocity, duration) => {
        env.triggerAttack(time, velocity)
        env.triggerRelease("+"+0.001)
        membrane.triggerAttackRelease(snare.membrane.frequency.value, duration, time, velocity)
    }
}