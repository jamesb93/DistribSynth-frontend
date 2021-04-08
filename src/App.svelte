<script lang="ts">
	import * as Tone from "tone";
	import { numUsers, socket, room, recentParamName, recentParamValue } from "./components/stores.js";
	import { fade } from "svelte/transition";
	import Grid from "./components/Grid.svelte";
	import Snare from "./components/Control/Snare.svelte";
	import Kick from "./components/Control/Kick.svelte";
	import Metal from "./components/Control/Metal.svelte";
	import FM from "./components/Control/FM.svelte";
	import Editor from "./components/Editor.svelte";
	import RoomPrompt from "./components/RoomPrompt.svelte";
	import Knob from "./components/Knob.svelte";

	import { ThreeOp } from './instruments/fm.js'
	import { snare } from './instruments/snare.js'
	import { kick } from './instruments/kick.js'
	import { MetalSynthesis } from './instruments/metal.js'

	let masterGainAmount = 1.0;
	let params = null;
	socket.on('params', data => params = data) // get all params in one message
	let humanParams = ""
	$: humanParams = JSON.stringify(params, null, 4)

	const masterLimiter = new Tone.Limiter(-3).toDestination();
	const makeUp = new Tone.Gain(3).connect(masterLimiter);
	const masterComp = new Tone.Compressor({
		attack: 1 / 1000,
		release: 300 / 1000,
		ratio: 4,
		knee: 5,
		threshold: -3,
	}).connect(makeUp);
	const masterGain = new Tone.Gain(masterGainAmount).connect(masterComp);
	$: masterGain.gain.rampTo(masterGainAmount, 0.1)

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


</script>

<main>
	{$recentParamName} | {$recentParamValue}
	<div class="shared">
		<RoomPrompt />
		{#if $room !== ""}
			<Editor bind:text={humanParams}/>
			<Knob scale=0.01 title="volume" size={50} min={0} max={1} step={0.001} bind:value={masterGainAmount} />
		{/if}
	</div>
	{#if $room !== ""}
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
	.shared {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		gap: 100px
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