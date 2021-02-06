<script>
	import Grid from "./components/Grid.svelte";
	import Chat from "./components/Chat.svelte";
	import Membrane from "./components/Membrane.svelte"
    import * as Tone from "tone";

    import { numUsers } from "./components/stores.js";

	const synth = new Tone.PluckSynth().toDestination();
    const sampler = new Tone.Sampler({
        urls: {
            A1: "A1.mp3",
            A2: "A2.mp3",
        },
        baseUrl: "https://tonejs.github.io/audio/casio/",
}   ).toDestination();

    const drums = new Tone.Sampler({
        urls: {
            C3: "kick.mp3",
            D3: "hat.mp3"
        },
        baseUrl: "./sounds/"
    }).toDestination();


</script>

<main>
	{$numUsers} are currently connected.
	<br>
	<br>
	<Grid drums={drums} sampler={sampler} synth={synth} />
	<br>
	<div class="synth-controls">
		<Membrane instrument={synth}/>
	</div>
	<!-- <Chat /> -->


</main>

<style>
	.synth-controls {
		display: grid;
		grid-template-columns: auto auto;
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