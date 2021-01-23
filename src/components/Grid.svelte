<script>
	import Cell from "./Cell.svelte"
    import * as Tone from "tone"
    let grid = []
    let numSteps = 10;
    const updateGrid = () => {
        grid = [];
        for (var i=0; i < numSteps; i++) {
            grid.push({state: false, emph: false})
        }
    }
    updateGrid();

    $: numSteps, updateGrid();


    let bpm = 120;
    $: Tone.Transport.bpm.value = bpm;
    let pos = 0; // Init a grid position


    const handleClick=(idx)=>{
        grid[idx].state = !grid[idx].state
    }

    const synth = new Tone.PluckSynth().toDestination();
    
    const loop = new Tone.Loop((time) => {
        let d = Math.random() * 7000;
        synth.set({
            damping: d
        });
        updateEmph();
        if (grid[pos].state) {
            synth.triggerAttackRelease("C4", "0.1", time);
        }
        // Increment Loop
        pos += 1;
        pos = pos % grid.length;
    }, "16n").start(0);


    const startLoop = () => {
        Tone.start();
        Tone.Transport.start();
        loop.start();
    }

    const stopLoop = () => {
        loop.stop();
        Tone.Transport.stop();
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





</script>
<button on:click={startLoop}>start</button>
<button on:click={stopLoop}>stop</button>
<button on:click={reset}>reset</button>


<br>

{bpm} <input type="range" min="60" max="300" bind:value={bpm} class="slider">


<div class="container">
    {#each grid as cell, idx}
        <Cell 
        toggleFun = {()=>handleClick(idx)}
        selected = {cell.state}
        emph = {cell.emph}
        />
    {/each}
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