<script lang="ts">
	import * as Tone from "tone";
	Tone.Master.volume.value = -12;
	import { numUsers, socket } from "./components/stores.js";
	import Grid from "./components/Grid.svelte";
	import Pluck from "./components/Control/Pluck.svelte";
	import Kick from "./components/Control/Kick.svelte";
	import Hats from "./components/Control/Hats.svelte";
	import Clock from "./components/Control/Clock.svelte";
	// const reverb = new Tone.Reverb().toDestination();
	const mixer = new Tone.Gain(1).toDestination();
	
	const pluck = new Tone.PluckSynth().toDestination();
	const kick = new Tone.MembraneSynth().connect(mixer);
	kick.frequency.value = 40;
	const metal_one = new Tone.MetalSynth().connect(mixer);
	metal_one.frequency.value = 200;
	const metal_two = new Tone.MetalSynth().connect(mixer);
	metal_two.frequency.value = 200;
	// mixer.connect(reverb);
		
	// Clock Modes
	type clockStates = "forward" | "rebound" | "wander"
	let clockMode: clockStates;
	socket.on('clock::mode', (e) => {clockMode = e});

	let params = null;
	socket.on('params', (e) => {params = e}) // get all params in one message
</script>
	
<main>
	<div class="main-layout">
		<span class="connected">{$numUsers} are currently connected.</span>
		{#if params}
		<Grid
			parameters={params}
			kick={kick}
			hats={metal_one}
			metal={metal_two}
			pluck={pluck}
			clockMode={clockMode} 
		/>
		{:else}
			No connection to server?
		{/if}
		<div class="clock-controls">
			<Clock bind:value={clockMode}/>
		</div>
		{#if params}
		<div class="synth-controls">
			<Pluck instrument={pluck} parameters={params} />
			<Kick instrument={kick} />
			<Hats instrument={metal_one} />
			<Hats instrument={metal_two} />
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