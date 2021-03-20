import * as Tone from "tone";

class ThreeOp {
    constructor() {
        this.freq = 250
        this._c1ratio = 1
        this._c2ratio = 1
        this._c3ratio = 1
        this._fm3to2 = 0
        this._fm3to1 = 0
        this._fm2to1 = 0
        this.c1envLength = 500
        this.c2envLength = 500
        this.c3envLength = 500
        
        this.out = new Tone.Gain(1.0);
        this.op1gain = new Tone.Gain(0.333).connect(this.out);
        this.op2gain = new Tone.Gain(0.333).connect(this.out);
        this.op3gain = new Tone.Gain(0.333).connect(this.out);
        
        // OP 3
        this.fm3to2 = new Tone.Multiply()
        this.fm3to1 = new Tone.Multiply()
        
        this.c3env = new Tone.AmplitudeEnvelope()
            .fan(this.op3gain, this.fm3to2, this.fm3to1)
        this.c3 = new Tone.Oscillator(this.freq, "sine").start()
            .connect(this.c3env)
        this.c3freq = new Tone.Multiply().connect(this.c3.frequency)
        this.c3ratio = new Tone.Signal(this._c3ratio).connect(this.c3freq)
        
        // OP 2
        this.fm2to1 = new Tone.Multiply()
        this.c2env = new Tone.AmplitudeEnvelope()
            .fan(this.op2gain, this.fm2to1)
        this.c2 = new Tone.Oscillator(this.freq, "sine").start()
            .connect(this.c2env)
        this.c2fb1 = new Tone.Add().connect(this.c2.frequency)
        this.c2freq = new Tone.Multiply().connect(this.c2fb1)
        this.c2ratio = new Tone.Signal(this._c2ratio).connect(this.c2freq) 
        
        // OP 1
        this.c1env = new Tone.AmplitudeEnvelope()
            .connect(this.op1gain)
        this.c1 = new Tone.Oscillator(this.freq, "sine").start()
            .connect(this.c1env)
        this.c1fb2 = new Tone.Add().connect(this.c1.frequency)
        this.c1fb1 = new Tone.Add().connect(this.c1fb2)
        this.c1freq = new Tone.Multiply().connect(this.c1fb1)
        this.c1ratio = new Tone.Signal().connect(this.c1freq)   
        
        this.fund = new Tone.Signal(this.freq).fan(
            this.c1freq.factor, 
            this.c2freq.factor, 
            this.c3freq.factor
        )
            
        this.fm2to1.fan(this.c1fb2.addend)
        this.fm3to1.fan(this.c1fb1.addend)
        this.fm3to2.fan(this.c2fb1.addend)
    }
    trigger = (time, velocity, duration) => {
        this.c1env.triggerAttack(time, velocity)
        this.c1env.triggerRelease(time+0.001)
        this.c2env.triggerAttack(time, velocity)
        this.c2env.triggerRelease(time+0.001)
        this.c3env.triggerAttack(time, velocity)
        this.c3env.triggerRelease(time+0.001)
    }
}

export {ThreeOp}
    