<script lang="ts">
	import * as Tone from "tone";
	import { numUsers, socket } from "./components/stores.js";
	import Grid from "./components/Grid.svelte";
	import Snare from "./components/Control/Snare.svelte";
	import Kick from "./components/Control/Kick.svelte";
	import Metal from "./components/Control/Metal.svelte";
	import FM from "./components/Control/FM.svelte";






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