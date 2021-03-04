<script lang="ts">
	import * as Tone from "tone";
	import { numUsers, socket } from "./components/stores.js";
	import Grid from "./components/Grid.svelte";
	import Snare from "./components/Control/Snare.svelte";
	import Kick from "./components/Control/Kick.svelte";
	import Metal from "./components/Control/Metal.svelte";
	import FM from "./components/Control/FM.svelte";

	import { fm } from './instruments/fm.js'
	import { snare } from './instruments/snare.js'
	import { kick } from './instruments/kick.js'
	import { metal } from './instruments/metal.js'

	let humanParams = ""
	$: humanParams = JSON.stringify(params, null, 4)
	const handMade = () => {
		params = JSON.parse(humanParams)
	}

	const masterLimiter = new Tone.Limiter(-5).toDestination();
	const masterGain = new Tone.Gain().connect(masterLimiter);

	const metal1 = Object.create(metal)
	const metal2 = Object.create(metal)
	const fm1 = Object.create(fm)
	const fm2 = Object.create(fm)

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
	<textarea bind:value={humanParams} on:input={handMade} class="editor"/>
	<div class="main-layout">
		<span class="connected">{$numUsers} are currently connected.</span>
		<Grid
			parameters={params}
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
					parameters={params}
				/>
				<Kick 
					instrument={kick}
					parameters={params}
				/>
				<Metal 
					instrument={metal1} 
					parameters={params}
					id="metal1"
				/>
				<Metal 
					instrument={metal2} 
					parameters={params}
					id="metal2"
				/>
				<FM
					instrument={fm1}
					parameters={params}
					id="fm1"
				/>
				<FM
					instrument={fm2}
					parameters={params}
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
		max-width: 240px;
		margin: 0 auto;
	}
	
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>