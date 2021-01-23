<script>
    import { onMount } from "svelte";
    import { a, b, connectStatus, socket } from "../components/stores.js";
    import * as Tone from 'tone';
    
    // ToneGenerator
    let loaded = false; onMount(() => {loaded=true})
    let ctxStatus = false;
    let playing = false;

    
    const synth = new Tone.PolySynth(Tone.Synth, {
        // envelope : {
        //     attack: 0.05,
        //     decay: 0.05,
        //     sustain: 0.05,
        //     release: 0.05
        // },
        frequency: $a
    }).toDestination();
    
    $: $a, synth.set({frequency: $a})

    let steps = [1, 0, 0, 1, 1];
    let i = 0;

    Tone.Transport.scheduleRepeat((time) => {
        if (steps[i]) {
            synth.triggerAttackRelease($a, "64n");
        };
        i++; 
        i = i % steps.length;
    }, 0.1)

    const startContext=()=>{
        if (!ctxStatus) {
            Tone.start();
            ctxStatus = true;
        }
    };
    const startTransport=()=>{
        Tone.Transport.start()
    };
    const stopTransport=()=>{
        Tone.Transport.stop()
    };


    


</script>

<br>
<h1>THE LOOPER!</h1>
{#if ctxStatus}
<span class="start">Looper audio context is active</span>
{:else}
<span class="stop">Looper audio context is not active</span>
{/if}
<br>

<button on:click={startContext}>context-start</button>
<br>
<button on:click={startTransport}>transport start</button>
<button on:click={stopTransport}>transport stop</button>

<style>
    .start {color: green}
    .stop {color: red}
</style>
