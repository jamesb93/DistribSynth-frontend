<script lang="ts">
	import * as Tone from "tone";
	import { numUsers, socket } from "./components/stores.js";
	import Grid from "./components/Grid.svelte";
	import Snare from "./components/Control/Snare.svelte";
	import Kick from "./components/Control/Kick.svelte";
	import Metal from "./components/Control/Metal.svelte";
	import Clock from "./components/Control/Clock.svelte";
	import TomLow from "./components/Control/TomLow.svelte";
	import TomHi from "./components/Control/TomHi.svelte";

	// const reverb = new Tone.Reverb().toDestination();
	const mixer = new Tone.Gain(0.75).toDestination();
	
	// Custom Snare
	const snare = new Tone.AmplitudeEnvelope(0.01, 0.374, 0.001, 1.0).toDestination();
	const membrane = new Tone.MembraneSynth().toDestination();
	membrane.pitchDecay = 0;
	membrane.frequency.value = 160;
	membrane.envelope.attack = 0.005;
	membrane.envelope.decay = 0.08;
	membrane.envelope.sustain = 0.01;
	membrane.envelope.release = 0.01;
	const snareFilter = new Tone.Filter(2750, "bandpass", -12).connect(snare);
	const snareNoise = new Tone.Noise().connect(snareFilter).start();

	// Kick
	const kick = new Tone.MembraneSynth().connect(mixer);

	// Metallic Synths (Hats/Cymbal)
	const metal_one = new Tone.MetalSynth().connect(mixer);
	const metal_two = new Tone.MetalSynth().connect(mixer);
	// mixer.connect(reverb);

	// Toms (hi/low)
	const tomLow = new Tone.MembraneSynth().connect(mixer);
	const tomHi = new Tone.MembraneSynth().connect(mixer);
		
	// Clock Modes
	type clockStates = "forward" | "rebound" | "wander"
	let clockMode: clockStates;
	socket.on('clock::mode', (e) => {clockMode = e});

	let params = null;
	socket.on('params', (e) => {params = e}) // get all params in one message
</script>
	
<main>
	<div class="main-layout">
		<div class="grid-controls">
			<span class="connected">{$numUsers} are currently connected.</span>
		</div>
		<Grid
			parameters={params}
			kick={kick}
			metalOne={metal_one}
			metalTwo={metal_two}
			snare={snare}
			tomLow={tomLow}
			tomHi={tomHi}
			snareMembrane={membrane}
			clockMode={clockMode} 
		/>
		<div class="clock-controls">
			<Clock bind:value={clockMode}/>
		</div>
		{#if params}
		<div class="synth-controls">
			<Snare filter={snareFilter} envelope={snare} parameters={params}/>
			<Kick instrument={kick} parameters={params}/>
			<Metal id="metal_one" instrument={metal_one} parameters={params} />
			<Metal id="metal_two" instrument={metal_two} parameters={params}/>
			<TomLow instrument={tomLow} parameters={params} />
			<TomHi instrument={tomHi} parameters={params} />
		</div>
		{:else}
			No connection to server?
		{/if}
	</div>
</main>
	
<style>
	.main-layout {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 25px;
	}
	
	.connected {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		color: grey;
	}
	.synth-controls {
		display: grid;
		grid-template-columns: auto auto;
		justify-content: center;
		grid-gap: 10px;
	}
	
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
	
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>