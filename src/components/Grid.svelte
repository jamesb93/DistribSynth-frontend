<script>
    import * as Tone from "tone";
    import {fold, wrap} from "./utility";

    // Instruments
    export let drums;
    export let sampler;
    export let synth;
    export let kick;

    // Metronome
    export let clockMode;
    let clockDirection = 1;
    
    // Components
    import Arrow from './Arrow.svelte';
    import Slider from "./Slider.svelte";
    import BoxButton from "./BoxButton.svelte";
    import Cell from "./Cell.svelte";
    import { rotate, random, deepCopy } from "./matrix.js";
    import { socket } from "../components/stores.js";

    let grid = [];
    let gridValid = false;
    let play = false;
    let bpm = 120;

    // Socket
    socket.on('bpm', (e) => {bpm = e});

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

    socket.on('sync', (e) => {pos = e})

    $: Tone.Transport.bpm.value = bpm

    let pos = 0; // Init a grid position

    const sendGrid = () => {
        socket.emit('grid', grid)
    }

    const handleClick = (x, y) => {
        grid[x][y] = !grid[x][y]
        sendGrid()
    };
    
    // Logic for the Clock
    const loop = new Tone.Loop((time) => {
        const SYNTH = 0;
        const HAT = 1;
        const PAD = 2;
        const KICK = 3;

        if (grid[SYNTH][pos]) {
            synth.triggerAttackRelease(synth.frequency.value, 0.05, time);
        }

        if (grid[HAT][pos]) {
            let v = (Math.random() * 12) * -1;
            drums.volume.rampTo(v, 1);
            drums.triggerAttackRelease("D3", 0.05, time);
        }

        if (grid[KICK][pos]) {
            kick.triggerAttackRelease(kick.frequency.value, 0.1, time)
        }

        if (grid[PAD][pos]) {
            sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.05, time);
        }

        if (clockMode === "forward") {
            // pos ++; // Increment
            // pos = pos % grid[0].length; // Wrap Around
            pos++
            pos = wrap(pos, 0, grid[0].length)

        } else if (clockMode === "rebound") {
            if (clockDirection === 1) { // if progressing forward
                if (pos === grid[0].length-1) {
                    pos = grid[0].length -1 // move one backward from the boundary
                    clockDirection = 0 // change to backward
                } else { // anywhere else
                    pos++
                }

            } else if (clockDirection === 0) { // progressing backward
                if (pos === 0) { // if we're at the left boundary
                    pos++
                    clockDirection = 1 // change to forward
                } else {
                    pos--
                }
            }   
        } else if (clockMode === "wander") {
            if (pos === 0) {
                pos++
            } else if (pos === grid[0].length-1) {
                pos--
            } else {
                let randomWalk = Math.random() <= 0.5;
                if (randomWalk) {
                pos++
                } else {
                    pos--
                }
            }
        }
        
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

    const sendBpm = () => {socket.emit('bpm', bpm)}

    const shiftColumnDown = (col) => {
        let temp = deepCopy(grid) // deep copy
        for (var i=0; i < grid.length; i++) { // in each row
            let below = (i + 1) % grid.length;
            grid[below][col] = temp[i][col]
        }
    }

    const shiftColumnUp = (col) => {
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
    
    const handleKeydown = (key) => {
        if (key.keyCode === 37) {
            for (var i=0; i < grid.length; i++) {
                grid[i] = rotate(grid[i], 1)
            }
        }

        if (key.keyCode === 39) {
            for (var i=0; i < grid.length; i++) {
                grid[i] = rotate(grid[i], -1)
            }
        }

        if (key.keyCode === 38) {
            for (var i=0; i < grid[0].length; i++) {
                shiftColumnUp(i)
            }
        }

        if (key.keyCode === 40) {
            for (var i=0; i < grid[0].length; i++) {
                shiftColumnDown(i)
            }
        }
        sendGrid()
    };
</script>

<svelte:window on:keydown={handleKeydown} />

<BoxButton func={startLoop} text="start"/>
<BoxButton func={stopLoop} text="stop"/>

<Slider title="BPM" min=60 max=300 func={sendBpm} bind:value={bpm} />

<div class="grid-container">
    {#if gridValid}
        {#each grid as row, x}
            <div class="cell-container">
            {#if x === 0}
                {#each row as column, y}
                    <Arrow direction="up" func={() => {shiftColumnUp(y)}}/>
                {/each}
            {/if}
            </div>
            <div class="cell-container">
                <Arrow direction="left" func={() => {grid[x] = rotate(grid[x], 1)}}/>
                {#each row as column, y}
                    <Cell
                    selected = {column}
                    emph = {pos === y}
                    toggleFun = {()=> handleClick(x, y)}
                    />
                {/each}
                <Arrow direction="right" func={() => {grid[x] = rotate(grid[x], -1)}}/>
            </div>
            <div class="cell-container">
            {#if x === grid.length-1}
                {#each row as column, y}
                    <Arrow direction="down" func={() => {shiftColumnDown(y)}}/>
                {/each}
            {/if}
            </div>

        {/each}
    {/if}
</div>

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

    .blank-cell {
        width: 50px;
        height: 50px;
    }
</style>