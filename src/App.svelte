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
	socket.on('params', (data) => {params = data; console.log(params)}) // get all params in one message
	let humanParams = ""
	$: humanParams = JSON.stringify(params, null, 4)
</script>
<main>
	<RoomPrompt />
	{#if $room !== ""}
		<Editor bind:text={humanParams}/>
		<div class="main-layout" transition:fade="{{duration: 1000}}">
			{#if $room === ""}
				<span class="connected">Please connect to a room</span>
			{:else}
				<span class="connected">{$numUsers} are currently connected to "{$room}"</span>
			{/if}
			<Grid
				kick={kick}
				snare={snare}
				fm1={fm1}
				fm2={fm2}
				metal1={metal1}
				metal2={metal2}
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
						id="fm1"
						instrument={fm1}
						bind:parameters={params}
					/>
					<FM
						id="fm2"
						instrument={fm2}
						bind:parameters={params}
					/>
				</div>
			{:else}
				No connection to server
			{/if}
		</div>
	{/if}
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