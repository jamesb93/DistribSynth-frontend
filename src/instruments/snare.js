import * as Tone from "tone";

const out = new Tone.Limiter(-1)
const waveshaper = new Tone.Chebyshev(1)
    .connect(out);
const env = new Tone.AmplitudeEnvelope()
    .connect(waveshaper);
const membrane = new Tone.MembraneSynth({
    'pitchDecay' : 0,
    'envelope' : {
        'attack' : 0.005,
        'decay' : 0.08,
        'sustain' : 0.01,
        'release' : 0.01
    }
}).connect(waveshaper)
membrane.frequency.rampTo(160, 0.1)

const filter = new Tone.Filter(2750, "bandpass", -12)
    .connect(env);
const source = new Tone.Noise()
    .start()
    .connect(filter)

export const snare = {
    source,
    filter,
    membrane,
    env,
    waveshaper,
    out,
    trigger: (time, velocity, duration) => {
        env.triggerAttack(time, velocity)
        env.triggerRelease("+"+duration)
        membrane.triggerAttackRelease(snare.membrane.frequency.value, duration, time, velocity)
    }
}