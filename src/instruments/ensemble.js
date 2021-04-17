/////////////////////////////////////////////////////////////////////////////////////// 
// This file creates instances of the instruments and composes a DSP Graph from them //
///////////////////////////////////////////////////////////////////////////////////////

// Import instruments and tone
import * as Tone from 'tone';
import { FMSynth } from './fm.js';
import { SnareSynth } from './snare.js';
import { KickSynth } from './kick.js';
import { MetalSynth } from './metal.js';

// Create instances of instruments
const kick = new KickSynth();
const snare = new SnareSynth();
const metal1 = new MetalSynth();
const metal2 = new MetalSynth();
const fm1 = new FMSynth();
const fm2 = new FMSynth();

// Compressor Options
const compOpts = {
    attack: 1 / 1000,
    release: 300 / 1000,
    ratio: 4,
    knee: 5,
    threshold: -3,
}

// Connect together the master bus DSP
const masterLimiter = new Tone.Limiter(-3)
    .toDestination();
const masterComp = new Tone.Compressor(compOpts)
    .connect(masterLimiter);
const verb = new Tone.Reverb(0.4)
    .connect(masterComp);

// Connect instruments to the master bus processing chain
kick.out.fan(masterComp, verb);
snare.out.fan(masterComp, verb);
metal1.out.fan(masterComp, verb);
metal2.out.fan(masterComp, verb);
fm1.out.fan(masterComp, verb);
fm2.out.fan(masterComp, verb);
// export them so you can use them all around the app
export { snare, kick, metal1, metal2, fm1, fm2 };