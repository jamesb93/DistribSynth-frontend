<script type="ts">
    import * as Tone from "tone";
    import { getPattern } from "./euclid.js";
    import { mirror } from "./matrix.js";
    import ControlTitle from "./Control/ControlTitle.svelte"

    // Euclidian Pattern Generation
    let euclidSteps = new Array(6).fill(0)
    const sendGrid = () => {
        socket.emit('grid', grid)
    }
    const euclid = (idx) => {
        grid[idx] = getPattern(euclidSteps[idx], 16)
        sendGrid()
        socket.emit('euclid', euclidSteps)
    }

    socket.on('euclid', data => {
        euclidSteps = data
    })

    // Mirror
    const mirrorGrid = () => {
        grid = grid.map(x => mirror(x))
        sendGrid()
    }

    const invertGrid = () => {
        grid = grid.map(x => x.reverse())
        sendGrid()
    }

    // Grid
    let mouseDown: boolean = false;

    // Instruments
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
    import { fold,  wrap} from "./utility";
    import { rotate, random, deepCopy } from "./matrix.js";
    import { socket } from "../components/stores.js";

    // Clock Modes
	type clockStates = "forward" | "rebound" | "wander"
	let clockMode: clockStates;
	socket.on('clock::mode', data => clockMode = data);
    
    // Socket
    socket.on('bpm', data => bpm = data);

    socket.on('grid', data => {
        grid = data;
        gridValid = true;
    })
    
    const FM1 = 0
    const FM2 = 1
    const M1 = 2
    const M2 = 3
    const SNARE = 4;
    const KICK = 5;

    const loop = new Tone.Loop(time => {
        if (grid[SNARE][pos] === true) {
            snare.trigger(time)
        }

        if (grid[M1][pos] === true) {
            metal1.trigger(time)
        }
        
        if (grid[M2][pos] === true) {
            metal2.trigger(time)
        }

        if (grid[KICK][pos] === true) {
            kick.trigger(time)
        }

        if (grid[FM1][pos] === true) {
            fm1.trigger(time)
        }

        if (grid[FM2][pos] === true) {
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

    const updatePlayStatus = status => {
        play = status
        if (status) {
            Tone.start();
            Tone.Transport.start();
            loop.start();
        } else {
            loop.stop();
        }
    }

    socket.on('play', (data) => {
        updatePlayStatus(data)
    })


    const startLoop = () => {
        updatePlayStatus(true)
        socket.emit('play', play)
    }

    const stopLoop = () => {
        updatePlayStatus(false)
        socket.emit('play', play)
    }

    const sendBpm = () => {
        socket.emit('bpm', bpm)
    }

    const shiftColumnDown = (col) => {
        let temp = deepCopy(grid) // deep copy
        for (var i=0; i < grid.length; i++) { // in each row
            let below = (i + 1) % grid.length;
            grid[below][col] = temp[i][col]
        }
        sendGrid()
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
        sendGrid()
    }

    const clearGrid = () => {
        grid = grid.map(gridRow => 
            gridRow.map(cell => false)
        )
        sendGrid()
    }

    const randomiseGrid = () => {
        grid = grid.map(gridRow =>
            gridRow.map(cell => Math.random() < 0.2)
        )
        sendGrid()
    }

    const handleClick = (x, y) => {
        grid[x][y] = !grid[x][y]
        sendGrid()
    };

    const handleMouseDown = () => {
        mouseDown = true
    }
    
    const handleMouseUp = () => {
        mouseDown = false
    }
</script>

<svelte:window on:mousedown={handleMouseDown} on:mouseup={handleMouseUp} />

<div class="all-controls">
    <div class="grid">
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
                    <Arrow direction="left" func={() => {grid[x] = rotate(grid[x], 1); sendGrid()}}/>
                    {#each row as column, y}
                        <Cell
                        selected={column}
                        emph={pos === y}
                        toggleFun = {()=> handleClick(x, y)}
                        bind:mouse={mouseDown}
                        />
                    {/each}
                    <Arrow direction="right" func={() => {grid[x] = rotate(grid[x], -1); sendGrid()}}/>
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

    <div class="transforms">
        <ControlTitle title="Euclidian Generators" />
        <Slider showValue={false} min=0 max=16 step=1 bind:value={euclidSteps[0]} func={() => euclid(0)}/>
        <Slider showValue={false} min=0 max=16 step=1 bind:value={euclidSteps[1]} func={() => euclid(1)}/>
        <Slider showValue={false} min=0 max=16 step=1 bind:value={euclidSteps[2]} func={() => euclid(2)}/>
        <Slider showValue={false} min=0 max=16 step=1 bind:value={euclidSteps[3]} func={() => euclid(3)}/>
        <Slider showValue={false} min=0 max=16 step=1 bind:value={euclidSteps[4]} func={() => euclid(4)}/>
        <Slider showValue={false} min=0 max=16 step=1 bind:value={euclidSteps[5]} func={() => euclid(5)}/>
    </div>

    <div class="transforms">
        <ControlTitle title="Transforms" />
        <BoxButton func={mirrorGrid} text="mirror" />
        <BoxButton func={invertGrid} text="invert" />
        <BoxButton func={clearGrid} text="clear" />
        <BoxButton func={randomiseGrid} text="randomise" />
    </div>

    <div class="transforms">
        <ControlTitle title="Clock Controls" />

        <Slider title="Clock Multiplier" min=0.125 max=4 step=0.125 bind:value={stepMultiplier}/>
        <Slider title="BPM" min=60 max=300 step=1 func={sendBpm} bind:value={bpm} />
        <div class="clock-controls">
            <BoxButton func={startLoop} text=">"/>
            <BoxButton func={stopLoop} text="□"/>
        </div>
        <Clock bind:value={clockMode}/>
    </div>
</div>

<style>
    .all-controls {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 10px;
    }
    .clock-controls {
        display: flex;
        flex-direction: row;
        gap: 1px;
    }

    .transforms {
        display: flex;
        flex-direction: column;
        border: 1px rgba(128, 128, 128, 0.466) solid;
        border-radius: 5px;
        background-color: rgba(219, 219, 219, 0.151);
        padding: 10px;
        gap: 10px;
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