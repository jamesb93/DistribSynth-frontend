<script lang="ts">
	import * as Tone from "tone";
	import { numUsers, socket } from "./components/stores.js";
	import Grid from "./components/Grid.svelte";
	import Snare from "./components/Control/Snare.svelte";
	import Kick from "./components/Control/Kick.svelte";
	import Metal from "./components/Control/Metal.svelte";
	import FM from "./components/Control/FM.svelte";

	// const reverb = new Tone.Reverb().toDestination();
	const masterLimiter = new Tone.Limiter(-5).toDestination();
	const mixer = new Tone.Gain().connect(masterLimiter);
	
	// Custom Snare
	const snareLimiter = new Tone.Limiter(-1).connect(mixer);
	const snareCheby = new Tone.Chebyshev(1).connect(snareLimiter);
	const snare = new Tone.AmplitudeEnvelope().connect(snareCheby);
	const membrane = new Tone.MembraneSynth().connect(snareCheby);
	membrane.pitchDecay = 0;
	membrane.frequency.value = 160;
	membrane.envelope.attack = 0.005;
	membrane.envelope.decay = 0.08;
	membrane.envelope.sustain = 0.01;
	membrane.envelope.release = 0.01;
	const snareFilter = new Tone.Filter(2750, "bandpass", -12).connect(snare);
	const snareNoise = new Tone.Noise().connect(snareFilter).start();

	// Kick
	const kickLimiter = new Tone.Limiter(-1).connect(mixer);
	const kickDistort = new Tone.Distortion(0.8).connect(kickLimiter);
	const kickCheby = new Tone.Chebyshev(1).connect(kickDistort);
	const kick = new Tone.MembraneSynth().connect(kickCheby);

	// Metallic Synths (Hats/Cymbal)
	const metalOneLimiter = new Tone.Limiter(-1).connect(mixer)
	const metalOneCheby = new Tone.Chebyshev(1).connect(metalOneLimiter);
	const metalOne = new Tone.MetalSynth().connect(metalOneCheby);

	const metalTwoLimiter = new Tone.Limiter(-1).connect(mixer)
	const metalTwoCheby = new Tone.Chebyshev(1).connect(metalTwoLimiter);
	const metalTwo = new Tone.MetalSynth().connect(metalTwoCheby);

	// Toms (hi/low)
	const tomLow = new Tone.MembraneSynth().connect(mixer);
	const tomHi = new Tone.MembraneSynth().connect(mixer);

	let params = null;
	socket.on('params', (e) => {params = e}) // get all params in one message
</script>
	
<main>
	<div class="main-layout">
		<span class="connected">{$numUsers} are currently connected.</span>
		<Grid
			parameters={params}
			kick={kick}
			metalOne={metalOne}
			metalTwo={metalTwo}
			snare={snare}
			tomLow={tomLow}
			tomHi={tomHi}
			snareMembrane={membrane}
		/>
		{#if params}
		<div class="synth-controls">
			<Snare 
				filter={snareFilter}
				waveshaper={snareCheby} 
				envelope={snare} 
				parameters={params}
			/>
			<Kick 
				instrument={kick} 
				distortion={kickDistort}
				limiter={kickLimiter} 
				parameters={params}
			/>
			<Metal 
				id="metalOne" 
				instrument={metalOne} 
				cheby={metalOneCheby} 
				parameters={params} 
			/>
			<Metal 
				id="metalTwo" 
				instrument={metalTwo} 
				cheby={metalTwoCheby}
				parameters={params}
			/>
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
		grid-template-columns: repeat(3, auto);
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