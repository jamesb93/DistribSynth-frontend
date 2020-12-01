<script>
    import { onMount } from "svelte";
    import * as Tone from 'tone';

    // Socket Stuff
    let data = {};
    let a;
    let b;
    let connectStatus = false;
    let socket;

    // ToneGenerator
    let loaded = false;
    let ctxStatus = false;
    let playing = false;
    let osc1;
    let osc2;


    onMount(() => {
        socket = new WebSocket("ws://192.168.1.20:8080");
        
        socket.addEventListener("open", function(event){
            connectStatus = true;
        });
        socket.addEventListener("message", (m) => {
            // parse message
            data = JSON.parse(m.data);
            a = data.a;
            b = data.b;
            updateFreq();
        })
         
        // Tone Generator Stuff
        loaded = true;
        osc1 = new Tone.Oscillator(a, "sine").toDestination();
        osc2 = new Tone.Oscillator(b, "sawtooth").toDestination();

    })

    function updateFreq() {
        osc1.set({frequency: a});
        osc2.set({frequency: b});
    }

    function aHandler() {
        updateFreq();
        socket.send(["a", a]);
    }

    function bHandler() {
        updateFreq();
        socket.send(["b", b]);
    }

    function ctxStart() {
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

{#if connectStatus}
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
        play
    {/if}
</button>

<br><br>

<label>
    {a}
	<input type=range bind:value={a} min=30 max=5000 on:input={aHandler}>
</label>
<br>
<label>
    {b}
	<input type=range bind:value={b} min=30 max=5000 on:input={bHandler}>
</label>

<br>


<style>
    .connected {
        color:green;
    }
    .disconnected {
        color: red;
    }

    input[type=range] {
        -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
        width: 100%; /* Specific width is required for Firefox. */
        background: transparent; /* Otherwise white in Chrome */
    }
    
    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
    }
    
    input[type=range]:focus {
        outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
    }
    
    input[type=range]::-ms-track {
        width: 100%;
        cursor: pointer;
        
        /* Hides the slider so custom styles can be added */
        background: transparent; 
        border-color: transparent;
        color: transparent;
    }
    
    /* Special styling for WebKit/Blink */
    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        border: 1px solid #000000;
        height: 36px;
        width: 16px;
        border-radius: 3px;
        background: #ffffff;
        cursor: pointer;
        margin-top: -14px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; /* Add cool effects to your sliders! */
    }
    
    /* All the same stuff for Firefox */
    input[type=range]::-moz-range-thumb {
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        border: 1px solid #000000;
        height: 36px;
        width: 16px;
        border-radius: 3px;
        background: #ffffff;
        cursor: pointer;
    }
    
    /* All the same stuff for IE */
    input[type=range]::-ms-thumb {
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        border: 1px solid #000000;
        height: 36px;
        width: 16px;
        border-radius: 3px;
        background: #ffffff;
        cursor: pointer;
    }
</style>