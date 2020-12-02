<script>
    import { onMount } from "svelte";
    import { a, b, connectStatus, socket } from "../components/stores.js";
    import * as Tone from 'tone';
    
    // ToneGenerator
    let loaded = false;
    let ctxStatus = false;
    let playing = false;
    // let osc1;
    // let osc2;

    let osc1 = new Tone.Oscillator($a, "sine").toDestination();
    let osc2 = new Tone.Oscillator($b, "sawtooth").toDestination();

    $: $a, osc1.set({frequency: $a})
    $: $b, osc2.set({frequency: $b})

    onMount(() => {loaded=true})
    
    const aHandler = () => {
        socket.send(["a", $a])
    }
    
    const bHandler = () => {
        socket.send(["b", $b])
    }
    
    const ctxStart=()=> {
        if (!ctxStatus) {
            Tone.start();
            ctxStatus = true;
        }
        if (!playing) {
            osc1.start();
            osc2.start();
            playing = true;
        } else {
            osc1.stop();
            osc2.stop();
            playing = false;
        }
    }
</script>

{#if $connectStatus === true}
<span class="connected">You are connected</span>
{:else}
<span class="disconnected">You are NOT connected</span>
{/if}

<br>

{#if ctxStatus}
<span class="connected">The audio context has started</span>
{:else}
<span class="disconnected">The audio context HASNT been started. Hit the start button</span>
{/if}

<br>

<button disabled={!loaded} on:click={ctxStart} class="freq-button">
    {#if playing}
    stop
    {:else}
    start
    {/if}
</button>

<br><br>

<label>
    {$a}
    <br>
    <input class="slider" type=range bind:value={$a} on:input={aHandler} min=30 max=5000>
</label>
<br>
<label>
    {$b}
    <br>
    <input class="slider" type=range bind:value={$b} on:input={bHandler} min=30 max=5000>
</label>

<br>


<style>
    /* https://codepen.io/vsync/pen/mdEJMLv?editors=1100 */
    /* https://codepen.io/simeydotme/pen/mJLPPq */
    .connected {
        color:green;
    }
    .disconnected {
        color: red;
    }

    .slider {
        min-width: 50%;
        max-width: 50%;
    }
    
</style>