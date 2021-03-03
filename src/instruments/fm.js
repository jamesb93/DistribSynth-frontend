import * as Tone from "tone";

let freq = 250
let _c1ratio = 1
let _c2ratio = 1
let _c3ratio = 1
let _fm3to2 = 0
let _fm3to1 = 0
let _fm2to1 = 0
let c1envLength = 500
let c2envLength = 500
let c3envLength = 500
let envShape = {
        attackCurve : "exponential",
        decayCurve : "exponential",
        attack : 0.1
}

const out = new Tone.Gain(0.33).toDestination()

// OP 3
const fm3to2 = new Tone.Multiply()
const fm3to1 = new Tone.Multiply()

const c3env = new Tone.AmplitudeEnvelope()
    .fan(out, fm3to2, fm3to1)
const c3 = new Tone.Oscillator(freq, "sine").start()
    .connect(c3env)
const c3freq = new Tone.Multiply().connect(c3.frequency)
const c3ratio = new Tone.Signal(_c3ratio).connect(c3freq)

// OP 2
const fm2to1 = new Tone.Multiply()
const c2env = new Tone.AmplitudeEnvelope()
    .fan(out, fm2to1)
const c2 = new Tone.Oscillator(freq, "sine").start()
    .connect(c2env)
const c2fb1 = new Tone.Add().connect(c2.frequency)
const c2freq = new Tone.Multiply().connect(c2fb1)
const c2ratio = new Tone.Signal(_c2ratio).connect(c2freq) 

// OP 1
const c1env = new Tone.AmplitudeEnvelope().connect(out)
const c1 = new Tone.Oscillator(freq, "sine").start()
    .connect(c1env)
const c1fb2 = new Tone.Add().connect(c1.frequency)
const c1fb1 = new Tone.Add().connect(c1fb2)
const c1freq = new Tone.Multiply().connect(c1fb1)
const c1ratio = new Tone.Signal().connect(c1freq)   

const fund = new Tone.Signal(freq).fan(
    c1freq.factor, 
    c2freq.factor, 
    c3freq.factor
)

fm2to1.fan(c1fb2.addend)
fm3to1.fan(c1fb1.addend)
fm3to2.fan(c2fb1.addend)

export const fm = {
    out, fund,
    c1ratio, c2ratio, c3ratio,
    fm2to1, fm3to2, fm3to1,
    c1env, c2env, c3env,
    c1envLength, c2envLength, c3envLength,
    trigger: (time) => {
        c1env.triggerAttack(time)
        c1env.triggerRelease(time+0.01)
        c2env.triggerAttack(time)
        c2env.triggerRelease(time+0.01)
        c3env.triggerAttack(time)
        c3env.triggerRelease(time+0.01)
    }
}
