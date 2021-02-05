<script>

    export let kick
    export let snare
    export let pad
    export let membrane
    import Cell2 from "./Cell2.svelte";
    import { socket } from "../components/stores.js";
    import { rotate, random, deepCopy } from "./matrix.js";
    import * as Tone from "tone";
    import Arrow from './Arrow.svelte';

    let grid = [];
    let gridValid = false;
    let play = false;
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
        gridValid = true;
    })

    socket.on('sync', (e) => {
        pos = e
    })

    $: Tone.Transport.bpm.value = bpm


    let pos = 0; // Init a grid position

    const handleClick=(instrument, idx)=>{
        grid[instrument][idx].state = !grid[instrument][idx].state;
        socket.emit('grid', grid)
    }

    const handleClick2 = (x, y) => {
        grid[x][y] = !grid[x][y];
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
            synth.triggerAttackRelease("C8", "0.5", time);
        } 
        if (grid.pad[pos].state) {
            sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.05, time);
        }

        if (grid.kick[pos].state) {
            let v = (Math.random() * 12) * -1;
            drums.volume.rampTo(v, 1);
            drums.triggerAttackRelease("C3", 1.0, time);
        }

        if (grid.hats[pos].state) {
            let v = (Math.random() * 12) * -1;
            drums.volume.rampTo(v, 1);
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

    const sendBpm = () => {socket.emit('bpm', bpm)}

    const updateEmph = () => {
        for (var i=0; i < grid.pluck.length; i++) {
            var emphasis;
            if (i === pos) {
                emphasis = true;

            } else {
                emphasis = false;
            }
            grid.pluck[i].emph = emphasis;
            grid.pad[i].emph = emphasis;
            grid.kick[i].emph = emphasis;
            grid.hats[i].emph = emphasis;
        }
    }

    export const shiftColumnDown = (col) => {
        let temp = deepCopy(grid) // deep copy
        for (var i=0; i < grid.length; i++) { // in each row
            let below = (i + 1) % grid.length;
            grid[below][col] = temp[i][col]
        }
    }

    export const shiftColumnUp = (col) => {
        let temp = deepCopy(grid) // deep copy
        for (var i=0; i < grid.length; i++) { // in each row
            let invert = (grid.length - i) - 1
            let above = invert - 1
            
            if (above < 0) { // Wrap
                above = grid.length - (Math.abs(0 - above));
            }
            grid[above][col] = temp[invert][col]
        }
    }
    
</script>

<button on:click={startLoop}>start</button>
<button on:click={stopLoop}>stop</button>
<button on:click={sync}>sync</button>

<br>
{bpm} 
<br>
<input type="range" min="60" max="300" on:input={sendBpm} bind:value={bpm} class="slider">


<div class = "grid-container">
    {#if gridValid}
        {#each grid as row, x}
            <!-- Left Shift -->
            <!-- <button on:click={} /> -->
            <div class="cell-container">
            {#if x === 0}
                {#each row as column, y}
                    <div class="updownarrows">
                        <Arrow direction="up" func={() => {shiftColumnUp(y)}}/>
                    </div>
                {/each}
            {/if}
            </div>
            <div class="cell-container">
                <Arrow direction="left" func={() => {grid[x] = rotate(grid[x], 1)}}/>
                {#each row as column, y}
                    <Cell2 
                    selected = {column}
                    emph = {false}
                    toggleFun = {()=> handleClick2(x, y)}
                    />
                {/each}
                <Arrow direction="right" func={() => {grid[x] = rotate(grid[x], -1)}}/>
            </div>
            <div class="cell-container">
            {#if x === grid.length-1}
                {#each row as column, y}
                    <div class="updownarrows">
                        <Arrow direction="down" func={() => {shiftColumnDown(y)}}/>
                    </div>
                {/each}
            {/if}
            </div>

        {/each}
    {/if}
</div>


<!-- 
    [
        [0, 0, 0, 0, 1],
        [0, 0, 1, 0, 0]
    ]
    >>>>>
    [
        [0, 0, 1, 0, 1],
        [0, 0, 0, 0, 0]
    ]
    input 2
    for all the rows shift the column

    x[1][2] = x[0][2]
    x[]
 -->

<!-- <div class="grid-container">
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
                <button on:click={()=> {grid.pluck = rotate(grid.pluck, -1); socket.emit('grid', grid)}}>rotate</button>
                <button on:click={()=> {grid.pluck = random(grid.pluck); socket.emit('grid', grid)}}>random</button>
            </div>
            <div class="cell-container">
                {#each grid.pad as {state, emph}, idx}
                    <Cell 
                        toggleFun = {()=>handleClick('pad', idx)}
                        selected = {state}
                        emph = {emph}
                    />
                {/each}
                <button on:click={()=> {grid.pad = rotate(grid.pad, -1)}}>rotate</button>
                <button on:click={()=> {grid.pad = random(grid.pad)}}>random</button>

            </div>

            <div class="cell-container">
                {#each grid.kick as {state, emph}, idx}
                    <Cell 
                        toggleFun = {()=>handleClick('kick', idx)}
                        selected = {state}
                        emph = {emph}
                    />
                {/each}
                <button on:click={()=> {grid.kick = rotate(grid.kick, -1)}}>rotate</button>
                <button on:click={()=> {grid.kick = random(grid.kick)}}>random</button>

            </div>


            <div class="cell-container">
                {#each grid.hats as {state, emph}, idx}
                    <Cell 
                        toggleFun = {()=>handleClick('hats', idx)}
                        selected = {state}
                        emph = {emph}
                    />
                {/each}
                
                <button on:click={()=> {grid.hats = rotate(grid.hats, -1)}}>rotate</button>
                <button on:click={()=> {grid.hats = random(grid.hats)}}>random</button>

            </div>

        {/if}
    {/if}

</div> -->

<style>
    .grid-container {
        display: grid;
        grid-template-rows: repeat(6, auto);
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

    .updownarrows {
        width: 50px;
        padding: 5px;
    }
</style>