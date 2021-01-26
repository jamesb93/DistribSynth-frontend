<script>
	import Cell from "./Cell.svelte"
    import { socket } from "../components/stores.js";
    import * as Tone from "tone";

    let grid = {}
    let gridValid = false;
    let play = false
    let bpm = 120;


    // Socket
    socket.on('bpm', (e) => {
        console.log(e)
        bpm = e
    })

    socket.on('play', (e) => {
        play = e
        if (play) {
            Tone.start();
            Tone.Transport.start();
            loop.start();
        } else {
            Tone.Transport.stop();
            loop.stop();
        }
    })

    socket.on('grid', (e) => {
        grid = e;
        gridValid= true;
    })


    socket.on('sync', (e) => {
        pos = e
        // updateEmph()
    })

    $: Tone.Transport.bpm.value = bpm


    let pos = 0; // Init a grid position

    const handleClick=(instrument, idx)=>{
        grid[instrument][idx].state = !grid[instrument][idx].state;
        socket.emit('grid', grid)
    }

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
    // const synth = new Tone.NoiseSynth().toDestination();
    
    const loop = new Tone.Loop((time) => {
        updateEmph();
        if (grid.pluck[pos].state) {
            synth.triggerAttackRelease("C4", "0.5", time);
        } 
        if (grid.pad[pos].state) {
            sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.05, time);
        }

        if (grid.kick[pos].state) {
            drums.triggerAttackRelease("C3", 1.0, time);
        }

        if (grid.hats[pos].state) {
            drums.triggerAttackRelease("D3", 0.05, time);
        }

        pos += 1;
        pos = pos % grid.pluck.length;
    }, "16n").start(0);


    const startLoop = () => {
        play = true;
        Tone.start();
        Tone.Transport.start();
        loop.start();
        socket.emit('play', play)
    }

    const stopLoop = () => {
        play = false
        loop.stop();
        Tone.Transport.stop();
        socket.emit('play', play)
    }

    const sync = () => {
        pos = 0;
        updateEmph();
        socket.emit('sync', pos)
    }

    const updateEmph = () => {
        for (var i=0; i < grid.pluck.length; i++) {
            if (i === pos) {
                grid.pluck[i].emph = true;
                grid.pad[i].emph = true;
                grid.kick[i].emph = true;
                grid.hats[i].emph = true;
            } else {
                grid.pluck[i].emph = false;
                grid.pad[i].emph = false;
                grid.kick[i].emph = false;
                grid.hats[i].emph = false;
            }
        }
    }

    const sendBpm = () => {socket.emit('bpm', bpm)}

</script>

<button on:click={startLoop}>start</button>
<button on:click={stopLoop}>stop</button>
<button on:click={sync}>sync</button>

<br>
{bpm} 
<br>
<input type="range" min="60" max="300" on:input={sendBpm} bind:value={bpm} class="slider">
<div class="grid-container">
    {#if gridValid}
        {#if grid.pluck.length > 0}
            <div class="cell-container">
            {#each grid.pluck as {state, emph}, idx}
                <Cell 
                    toggleFun = {()=>handleClick('pluck', idx)}
                    selected = {state}
                    emph = {emph}
                />
            {/each}
            </div>
            <div class="cell-container">
            {#each grid.pad as {state, emph}, idx}
                <Cell 
                    toggleFun = {()=>handleClick('pad', idx)}
                    selected = {state}
                    emph = {emph}
                />
            {/each}
            </div>

            <div class="cell-container">
                {#each grid.kick as {state, emph}, idx}
                    <Cell 
                        toggleFun = {()=>handleClick('kick', idx)}
                        selected = {state}
                        emph = {emph}
                    />
                {/each}
            </div>

            <div class="cell-container">
                {#each grid.hats as {state, emph}, idx}
                    <Cell 
                        toggleFun = {()=>handleClick('hats', idx)}
                        selected = {state}
                        emph = {emph}
                    />
                {/each}
            </div>
        {/if}
    {/if}

</div>

<style>
    .grid-container {
        display: grid;
        grid-template-rows: 50% 50%;
        grid-template-columns: auto;
        align-items: center;
        align-self: center;
    }

    .cell-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .slider {
        -webkit-appearance: none;
        width: 30%;
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