<script>
	import Cell from "./Cell.svelte"
    import { socket } from "../components/stores.js";
    import * as Tone from "tone";

    let grid = {}
    let play = false
    let bpm = 120

    // Socket
    socket.on('bpm', (e) => {bpm = e})

    socket.on('play', (e) => {play = e})

    socket.on('grid', (e) => {grid = e})

    $: Tone.Transport.bpm.value = bpm
    $: if (play) {
        Tone.start();
        Tone.Transport.start();
        loop.start();
        socket.emit('play', play)
    } else {
        loop.stop();
        Tone.Transport.stop();
        socket.emit('play', play)
    }

    let pos = 0; // Init a grid position

    const handleClick=(idx)=>{
        grid[idx].state = !grid[idx].state;
        socket.emit('grid', grid)
    }

    const synth = new Tone.PluckSynth().toDestination();
    
    const loop = new Tone.Loop((time) => {
        updateEmph();
        if (grid[pos].state) {
            synth.triggerAttackRelease("C4", "0.1", time);
        }

        pos += 1;
        pos = pos % grid.length;
    }, "16n").start(0);


    const startLoop = () => {
        play = true
    }

    const stopLoop = () => {
        play = false
    }

    const reset = () => {
        pos = 0;
        updateEmph();
    }

    const updateEmph = () => {
        for (var i=0; i < grid.length; i++) {
            if (i === pos) {
                grid[i].emph = true;
            } else {
                grid[i].emph = false;
            }
        }
    }

    const sendBpm = () => {
        socket.emit('bpm', bpm)
    }

</script>


<button on:click={startLoop}>start</button>
<button on:click={stopLoop}>stop</button>
<button on:click={reset}>reset</button>

<br>
{play}
{bpm} <input type="range" min="60" max="300" on:input={sendBpm} bind:value={bpm} class="slider">

<div class="container">
    {#if grid.length > 0}
        {#each grid as cell, idx}
            <Cell 
            toggleFun = {()=>handleClick(idx)}
            selected = {cell.state}
            emph = {cell.emph}
            />
        {/each}
    {:else}
        Loading...
    {/if}

</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .slider {
        -webkit-appearance: none;
        width: 100%;
        height: 25px;
        background: #d3d3d3;
        outline: none;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;
    }

    .slider:hover {
        opacity: 1;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        background: #4CAF50;
        cursor: pointer;
    }

    .slider::-moz-range-thumb {
        width: 25px;
        height: 25px;
        background: #4CAF50;
        cursor: pointer;
    }
</style>