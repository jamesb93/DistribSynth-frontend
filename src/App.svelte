<script>
	import Grid from "./components/Grid.svelte";
	import FM from "./components/Control/FM.svelte";
	import Kick from "./components/Control/Kick.svelte";
	import Hats from "./components/Control/Hats.svelte";

	import Clock from "./components/Control/Clock.svelte";
    import * as Tone from "tone";

    import { numUsers } from "./components/stores.js";

	let parameters = {
		
	}
	const reverb = new Tone.Reverb().toDestination();
	const mixer = new Tone.Gain(1).toDestination();
	mixer.connect(reverb);

	// const synth = new Tone.PluckSynth().toDestination();
	const synth = new Tone.FMSynth().connect(mixer);
	const kick = new Tone.MembraneSynth().connect(mixer);
	const metal = new Tone.MetalSynth().connect(mixer);
	synth.frequency.value = 250;
	kick.frequency.value = 50;


    const sampler = new Tone.Sampler({
        urls: {
            A1: "A1.mp3",
            A2: "A2.mp3",
        },
        baseUrl: "https://tonejs.github.io/audio/casio/",}
	).connect(reverb);

    const drums = new Tone.Sampler({
        urls: {
            C3: "kick.mp3",
            D3: "hat.mp3"
        },
        baseUrl: "./sounds/"
    }).connect(reverb);

	// forward, rebound
	let clockMode = "forward"
</script>

<main>
	<span class="connected">{$numUsers} are currently connected.</span>
	<br>
	<Grid 
		kick={kick} 
		drums={drums} 
		sampler={sampler} 
		synth={synth}
		clockMode={clockMode} 
	/>
	<br>
	<div class="clock-controls">
		<Clock bind:clock={clockMode}/>
	</div>
	<div class="synth-controls">
		<FM instrument={synth} />
		<Kick instrument={kick} />
	</div>
	<!-- <Chat /> -->


</main>

<style>

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

	.membrane {
		display: grid;
		grid-template-columns: auto auto;
		grid-template-rows: auto auto;
	}

	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>