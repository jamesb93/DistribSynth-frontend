<script lang="ts">
	import * as Tone from "tone";
	import { numUsers, socket, room } from "./components/stores.js";
	import { fade } from "svelte/transition";
	import Grid from "./components/Grid.svelte";
	import Snare from "./components/Control/Snare.svelte";
	import Kick from "./components/Control/Kick.svelte";
	import Metal from "./components/Control/Metal.svelte";
	import FM from "./components/Control/FM.svelte";
	import Editor from "./components/Editor.svelte";
	import RoomPrompt from "./components/RoomPrompt.svelte";

	import { ThreeOp } from './instruments/fm.js'
	import { snare } from './instruments/snare.js'
	import { kick } from './instruments/kick.js'
	import { MetalSynthesis } from './instruments/metal.js'

	const masterLimiter = new Tone.Limiter(-5).toDestination();
	const masterGain = new Tone.Gain().connect(masterLimiter);

	const metal1 = new MetalSynthesis()
	const metal2 = new MetalSynthesis()
	const fm1 = new ThreeOp()
	const fm2 = new ThreeOp()

	kick.out.connect(masterGain)
	snare.out.connect(masterGain)
	metal1.out.connect(masterGain)
	metal2.out.connect(masterGain)
	fm1.out.connect(masterGain)
	fm2.out.connect(masterGain)

	let params = null;
	socket.on('params', (data) => {params = data}) // get all params in one message
</script>

<main>
	<Editor bind:text={humanParams} />
	<div class="main-layout">
		<span class="connected">{$numUsers} are currently connected.</span>
		<Grid
			kick={kick}
			metal1={metal1}
			metal2={metal2}
			snare={snare}
			fm1={fm1}
			fm2={fm2}
		/>
		{#if params}
			<div class="synth-controls">
				<Snare 
					instrument={snare}
					bind:parameters={params}
				/>
				<Kick 
					instrument={kick}
					bind:parameters={params}
				/>
				<Metal 
					instrument={metal1} 
					bind:parameters={params}
					id="metal1"
				/>
				<Metal 
					instrument={metal2} 
					bind:parameters={params}
					id="metal2"
				/>
				<FM
					instrument={fm1}
					bind:parameters={params}
					id="fm1"
				/>
				<FM
					instrument={fm2}
					bind:parameters={params}
					id="fm2"
				/>	
			</div>
		{:else}
			No connection to server
		{/if}
	</div>
</main>

	
<style>
	.editor {
		min-width: 30%;
		min-height: 200px;
		outline: none;
	}
	.test-rack {
		display: flex;
		flex-direction: column;
		width: 50%;
	}
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
		max-width: 100%;
		margin: 0 auto;
	}
	
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>