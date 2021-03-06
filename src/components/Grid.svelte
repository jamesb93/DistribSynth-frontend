<script type="ts">
    import * as Tone from "tone";
    import { getPattern } from "./euclid.js";
    import { mirror } from "./matrix.js";

    // Euclidian Pattern Generation
    let euclidSteps = new Array(6).fill(0)
    const euclid = (idx) => {
        grid[idx] = getPattern(euclidSteps[idx]+1, 16)
    }

    // Mirror
    const mirrorGrid = () => {
        grid = grid.map(x => mirror(x))
    }

    const invertGrid = () => {
        grid = grid.map(x => x.reverse())
    }

    // Instruments
    export let parameters;
    export let kick;
    export let snare;
    export let metal1;
    export let metal2;
    export let fm1;
    export let fm2;

    // Metronome
    let clockDirection: number = 1;
    let stepMultiplier: number = 1.0;
    let bpm: number = 120; // BPM
    let grid = [];
    let gridValid: boolean = false;
    let play: boolean = false;
    let pos: number = 0; // Init a grid position
    let internalPos: number = 0;
    $: Tone.Transport.bpm.value = bpm
    
    // Components
    import Arrow from './Arrow.svelte';
    import Slider from "./Slider.svelte";
    import Clock from "./Control/Clock.svelte";
    import BoxButton from "./BoxButton.svelte";
    import Cell from "./Cell.svelte";
    import {fold, wrap} from "./utility";
    import { rotate, random, deepCopy } from "./matrix.js";
    import { socket } from "../components/stores.js";

// Clock Modes
	type clockStates = "forward" | "rebound" | "wander"
	let clockMode: clockStates;
	socket.on('clock::mode', (data) => {clockMode = data});


    const updatePlayStatus = (status) => {
        play = status
        if (status) {
            Tone.start();
            Tone.Transport.start();
            loop.start();
        } else {
            Tone.Transport.stop();
            loop.stop();
        }
    }
    // Socket
    const sync = () => {socket.emit('sync', pos)}

    socket.on('sync', (data) => {pos=data});

    socket.on('bpm', (data) => {bpm=data});

    socket.on('play', (data) => {
        updatePlayStatus(data)
    })

    socket.on('grid', (e) => {
        grid = e;
        gridValid = true;
    })

    const sendGrid = () => {socket.emit('grid', grid)}
    
    const FM1 = 0
    const FM2 = 1
    const M1 = 2
    const M2 = 3
    const SNARE = 4;
    const KICK = 5;

    const loop = new Tone.Loop(time => {

        if (grid[SNARE][pos]) {
            snare.trigger(time)
        }

        if (grid[M1][pos]) {
            metal1.trigger(time+0.000001)
        }
        
        if (grid[M2][pos]) {
            metal2.trigger(time+0.000002)
        }

        if (grid[KICK][pos]) {
            kick.trigger(time)
        }

        if (grid[FM1][pos]) {
            fm1.trigger(time)
        }

        if (grid[FM2][pos]) {
            fm2.trigger(time)
        }

        if (clockMode === "forward") {
            internalPos += stepMultiplier
            pos = Math.round(internalPos)
            pos = wrap(pos, 0, grid[0].length)

        } else if (clockMode === "rebound") {
            if (clockDirection === 1) { // if progressing forward
                if (pos === grid[0].length-1) {
                    internalPos -= stepMultiplier
                    clockDirection = 0 // change to backward
                } else { // anywhere else
                    internalPos += stepMultiplier
                }
            } else if (clockDirection === 0) { // if progressing backward
                if (pos === 0) { // if we're at the left boundary
                    internalPos += stepMultiplier
                    clockDirection = 1 // change to forward
                } else {
                    internalPos -= stepMultiplier
                }   
            } 
            pos = Math.round(internalPos)  
        } else if (clockMode === "wander") {
            if (pos === 0) {
                internalPos += stepMultiplier
            } else if (pos >= grid[0].length-1) {
                internalPos -= stepMultiplier
            } else {
                let randomWalk = Math.random() <= 0.5;
                if (randomWalk) {
                    internalPos += stepMultiplier
                } else {
                    internalPos -= stepMultiplier
                }
            }
            pos = Math.round(internalPos)
            pos = Math.min(Math.max(pos, 0), grid[0].length-1)
        }
        
    }, "16n").start(0);


    const startLoop = () => {
        updatePlayStatus(true)
        socket.emit('play', play)
    }

    const stopLoop = () => {
        updatePlayStatus(false)
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
    
    const handleKey = (key) => {
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

    const clearGrid = () => {
        for (var i=0; i < grid.length; i++) {
            for (var j=0; j < grid[i].length; j++) {
                grid[i][j] = false;
            }
        }
        sendGrid()
    }

    const randomiseGrid = () => {
        for (var i=0; i < grid.length; i++) {
            for (var j=0; j < grid[i].length; j++) {
                grid[i][j] = Math.random() < 0.2;
            }
        }
        sendGrid()
    }

    const handleClick = (x, y) => {
        grid[x][y] = !grid[x][y]
        sendGrid()
    };
</script>

<svelte:window on:keydown={handleKey} />

<div class="grid-container">
    <div class="grid">
        {#if gridValid}
            {#each grid as row, x}
                <div class="cell-container">
                <!-- {#if x === 0}
                    {#each row as column, y}
                        <Arrow direction="up" func={() => {shiftColumnUp(y)}}/>
                    {/each}
                {/if} -->
                </div>
                <div class="cell-container">
                    <!-- <Arrow direction="left" func={() => {grid[x] = rotate(grid[x], 1)}}/> -->
                    {#each row as column, y}
                        <Cell
                        selected={column}
                        emph={pos === y}
                        toggleFun = {()=> handleClick(x, y)}
                        />
                    {/each}
                    <!-- <Arrow direction="right" func={() => {grid[x] = rotate(grid[x], -1)}}/> -->
                </div>
                <div class="cell-container">
                <!-- {#if x === grid.length-1}
                    {#each row as column, y}
                        <Arrow direction="down" func={() => {shiftColumnDown(y)}}/>
                    {/each}
                {/if} -->
                </div>
    
            {/each}
        {/if}
    </div>
    <div class="grid-controls">
        <!-- TODO: EACH PART OF THE GRID-CONTROLS SHOULD BE A COMPONENT -->
        <Slider title="BPM" min=60 max=300 step=1 func={sendBpm} bind:value={bpm} />
        <div class="clock-controls">
            <BoxButton func={startLoop} text="start"/>
            <BoxButton func={stopLoop} text="stop"/>
            <BoxButton func={sync} text="sync" />
        </div>
        <Clock bind:value={clockMode}/>
        <div class="clock-controls">
            <BoxButton func={clearGrid} text="clear" />
            <BoxButton func={randomiseGrid} text="randomise" />

        </div>
    </div>
</div>

<style>
    .grid-container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        gap: 10px;
    }
    .grid-controls {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 3px;
    }
    .clock-controls {
        display: flex;
        flex-direction: row;
        gap: 1px;
    }

    .grid {
        display: grid;
        grid-template-rows: repeat(8, auto);
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
</style>