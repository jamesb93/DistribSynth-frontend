<script lang="ts">
	import Grid from "./components/Grid.svelte";
	import Pluck from "./components/Control/Pluck.svelte";
	import Kick from "./components/Control/Kick.svelte";
	import Hats from "./components/Control/Hats.svelte";
	
	import Clock from "./components/Control/Clock.svelte";
	import * as Tone from "tone";
	
	import { numUsers } from "./components/stores.js";
	
	const reverb = new Tone.Reverb().toDestination();
	const mixer = new Tone.Gain(1).toDestination();
	
	const pluck = new Tone.PluckSynth().toDestination();
	const kick = new Tone.MembraneSynth().connect(mixer);
	kick.frequency.value = 40;
	const metal_one = new Tone.MetalSynth().connect(mixer);
	metal_one.frequency.value = 200;
	const metal_two = new Tone.MetalSynth().connect(mixer);
	metal_two.frequency.value = 200;
	mixer.connect(reverb);

	let sharedParam = {
		'pluck' : {
			frequency : 100
		},
		'kick' : {

		},
		'hats' : {

		},
		'metal' : {

		}
	}
		
	// Modes
	type clockStates = "forward" | "rebound" | "wander"
	let clockMode: clockStates = "forward"
</script>
	
<main>
	<div class="main-layout">
		<span class="connected">{$numUsers} are currently connected.</span>
		<Grid 
			sharedParam={sharedParam}
			kick={kick}
			hats={metal_one}
			metal={metal_two}
			pluck={pluck}
			clockMode={clockMode} 
		/>
		<div class="clock-controls">
			<Clock bind:clock={clockMode}/>
		</div>
		<div class="synth-controls">
			<Pluck instrument={pluck} sharedParam={sharedParam} />
			<Kick instrument={kick} />
			<Hats instrument={metal_one} />
			<Hats instrument={metal_two} />
		</div>
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