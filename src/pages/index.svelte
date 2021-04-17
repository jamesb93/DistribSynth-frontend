
<script>
    import { metatags } from '@roxi/routify'
    metatags.title = 'distrib'
    metatags.description = 'make music everywhere...'
	import { fade } from "svelte/transition";
	import { 
        numUsers, room, 
        recentParamName, 
        recentParamValue
    } from "./_components/stores.js";
	import Grid from "./_components/Grid.svelte";
	import Snare from "./_components/Control/Snare.svelte";
	import Kick from "./_components/Control/Kick.svelte";
	import Metal from "./_components/Control/Metal.svelte";
	import FM from "./_components/Control/FM.svelte";
	import Header from "./_components/Header.svelte";
	import { metal1, metal2, fm1, fm2 } from '../instruments/ensemble.js';
</script>

<Header />

<main>
	<!-- {$recentParamName} | {$recentParamValue} -->
	{#if $room !== ""}
		<div class="main-layout" transition:fade="{{duration: 1000}}">
			<Grid />
			<div class="synth-controls">
				<Snare />
				<Kick />
				<Metal id="metal1" instrument={metal1} />
				<Metal id="metal2" instrument={metal2} />
				<FM id="fm1" instrument={fm1} />
				<FM id="fm2" instrument={fm2} />
			</div>
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
		/* font-family: 'VT323', monospace; */
		font-family: 'Major Mono Display', monospace;
		color: grey;
	}
	.synth-controls {
		display: grid;
		grid-template-columns: repeat(4, auto);
		justify-content: center;
		grid-gap: 10px;
	}
</style>