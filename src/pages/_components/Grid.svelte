<script>
    import * as Tone from "tone";
    import Arrow from './Arrow.svelte';
    import Clock from "./Control/Clock.svelte";
    import BoxButton from "./BoxButton.svelte";
    import Cell from "./Cell.svelte";
    import { wrap } from "./utility";
    import { getPattern } from "./euclid.js";
    import Knob from "./Knob.svelte";
    import Play from "./Play.svelte";
    import { 
        socket, states,
        velocity, length, offset, bpm,
        euclidSteps,
        clockMultiplierLookup, clockMode,
        grid, gridValid, play,
        userInteracted,
    } from "./stores.js";
    import { 
        mirrorGridHorizontal, mirrorGridVertical,
        invertGridVertical,
        shiftColumnDown, shiftColumnUp,
        clearGrid, randomiseGrid
    } from "../../grid/transforms.js";

    import { kick, snare, metal1, metal2, fm1, fm2 } from "../../instruments/ensemble.js";

    const multiplierTable = [1, 1/16, 1/24, 1/0.5, 0.0];
    let clockDirection = 1;
    let pos = 0;
    let prePos = 0;
    let internalPos = 0;
    let clockMultiplier;
    $: clockMultiplier = multiplierTable[$clockMultiplierLookup];
    $: Tone.Transport.bpm.value = $bpm;

    // Sending Data Back to the Server
    function sendVelocity() { socket.emit('velocity', $velocity) };
    function sendLength() { socket.emit('length', $length) };
    function sendGrid() { socket.emit('grid', $grid) };
    function sendOffset() { socket.emit('clock::offset', $offset) };
    function sendBpm() { socket.emit('bpm', $bpm) };
    function sendMultiplier() { socket.emit('clock::multiplier', $clockMultiplierLookup) };
    function sendEuclid(idx) {
        $grid[idx] = getPattern($euclidSteps[idx], 16);
        socket.emit('euclid', $euclidSteps);
        sendGrid();
    }

    function updatePlayStatus(status) {
        play.set(status)
        if ($play === true) {
            Tone.start();
            Tone.Transport.start();
            loop.start();
        } else if ($play === false) {
            loop.stop();
        }
    }
    
    function startLoop() {
        userInteracted.set(true);
        updatePlayStatus(true)
        socket.emit('play', $play)
    }

    function stopLoop() {
        userInteracted.set(true);
        updatePlayStatus(false)
        socket.emit('play', $play)
    }

    socket.on('play', x => {
        if ($userInteracted) {
            updatePlayStatus(x)
        }
    })

    $: if ($offset.start > $offset.end) {
        let t = $offset.end
        $offset.end = $offset.start
        $offset.start = t
    }

    // Declare indices here so you can easily swap the order.
    const FM1 = 4
    const FM2 = 5
    const M1 = 2
    const M2 = 3
    const SNARE = 1;
    const KICK = 0;

    const loop = new Tone.Loop(time => {
        if ($grid[SNARE][pos] === true) {
            snare.trigger(time, $velocity, $length)
        }

        if ($grid[M1][pos] === true) {
            metal1.trigger(time, $velocity, $length)
        }
        
        if ($grid[M2][pos] === true) {
            metal2.trigger(time, $velocity, $length)
        }

        if ($grid[KICK][pos] === true) {
            kick.trigger(time, $velocity, $length)
        }

        if ($grid[FM1][pos] === true) {
            fm1.trigger(time, $velocity, $length)
        }

        if ($grid[FM2][pos] === true) {
            fm2.trigger(time, $velocity, $length)
        }

        prePos = pos;
        
        if ($clockMode === "forward") {
            internalPos += clockMultiplier
            internalPos = wrap(internalPos, $offset.start-1, $offset.end)
            pos = Math.round(internalPos)
        
        } else if ($clockMode === "rebound") {

            if (clockDirection === 1) { // if progressing forward
                if (pos === $offset.end-1) {
                    clockDirection = 0 // change to backward
                } 
                else { // anywhere else
                    internalPos += clockMultiplier
                }
            } 
            if (clockDirection === 0) { // if progressing backward
                if (pos === $offset.start-1) { // if we're at the left boundary
                    internalPos += clockMultiplier
                    clockDirection = 1 // change to forward
                } 
                else {
                    internalPos -= clockMultiplier
                }   
            }
            internalPos = wrap(internalPos, $offset.start-1, $offset.end)
            pos = Math.round(internalPos);

        } else if ($clockMode === "wander") {
            if (pos === $offset.start-1) {
                internalPos += clockMultiplier
            } 
            else if (pos >= $offset.end-1) {
                internalPos  -= clockMultiplier
            } 
            else {
                if (Math.random() <= 0.5) {
                    internalPos += clockMultiplier
                } else {
                    internalPos -= clockMultiplier
                }
            }
            internalPos = wrap(internalPos, $offset.start-1, $offset.end);
            pos = Math.round(internalPos);
            pos = Math.min(Math.max(pos, $offset.start-1), $offset.end-1);
        }
    }, "16n").start(0);

    let anyMouseDown = false;
    let cellSnapshot;
</script>

<svelte:window on:mouseup={()=>{anyMouseDown=false}} />
<div class="all-controls">
    <div class="control-row">
        <div class="global-controls">
            <Play bind:playing={$play} start={startLoop} pause={stopLoop}/>
            <Knob enabled={$states.bpm} title="BPM" min={5} max={300} step={1} bind:value={$bpm} func={sendBpm} />
            <Knob enabled={$states.offset} scale=0.125 title="start" min={1} max={16} bind:value={$offset.start} func={sendOffset} />
            <Knob enabled={$states.offset} scale=0.125 title="end" min={1} max={16} bind:value={$offset.end} func={sendOffset} />
            <Knob enabled={$states.globalVelocity} scale=0.01 title="velocity" min={0} max={1} step={0.01} bind:value={$velocity} func={sendVelocity} />
            <Knob enabled={$states.globalLength} scale={0.1 * 0.04}  title="length" min={0.01} max={2} step={0.01} bind:value={$length} func={sendLength} />
            <Knob enabled={$states.multiplier} scale=0.025 title="multiplier" min={0} max={4} step={1} bind:value={$clockMultiplierLookup} func={sendMultiplier} />
        </div>
    </div>

    {#if $states.transforms}
    <div class="transforms">
        <BoxButton func={ () => mirrorGridHorizontal(grid) } text="mirror H" />
        <BoxButton func={ () => mirrorGridVertical(grid) } text="mirror V" />
        <BoxButton func={ () => invertGridVertical(grid) } text="invert vertical" />
        <BoxButton func={ () => randomiseGrid(grid) } text="randomise" />
        <BoxButton func={ () => clearGrid(grid) } text="clear" />
        <Clock bind:value={$clockMode}/>
    </div>
    {/if}

    <div class="sequencer">
        <div class="euclids">
            {#each {length: 6} as _, x}
                <Knob enabled={states.euclid} scale=0.2 size={75} min={0} max={16} bind:value={$euclidSteps[x]} func={() => sendEuclid(x)}/>
            {/each}
        </div>
        <div class="grid">
            {#if $gridValid}
                {#each $grid as row, x}
                    <div class="cell-container">
                        {#if x === 0}
                            {#each row as _, y}
                                <!-- <Arrow direction="up" func={() => {shiftColumnUp(grid, y)}}/> -->
                            {/each}
                        {/if}
                    </div>
                    <div class="cell-container">
                        <!-- <Arrow direction="left" func={() => {grid[x] = rotate(grid[x], 1); sendGrid()}}/> -->
                        {#each row as step, y}
                            <Cell
                            bind:cellSnapshot={cellSnapshot}
                            bind:anyMouseDown={anyMouseDown}
                            func={sendGrid}
                            emph={prePos === y}
                            x={x}
                            y={y}
                            />
                        {/each}
                        <!-- <Arrow direction="right" func={() => {grid[x] = rotate(grid[x], -1); sendGrid()}}/> -->
                    </div>
                    <div class="cell-container">
                        {#if x === $grid.length-1}
                            {#each row as _, y}
                                <!-- <Arrow 
                                direction="down" 
                                func={ () => {shiftColumnDown(grid, y)} } 
                                /> -->
                            {/each}
                        {/if}
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</div>

<style>
    .control-row {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    .global-controls {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .all-controls {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 10px;
    }

    .sequencer {
        display: flex;
        flex-direction: row;
    }

    .transforms {
        display: flex;
        flex-direction: row;
        align-self: center;
        width: 70%;
        border: 1px rgba(128, 128, 128, 0.466) solid;
        border-radius: 5px;
        background-color: rgba(219, 219, 219, 0.151);
        padding: 10px;
        gap: 10px;
        justify-content: center;
    }

    .euclids {
        display: grid;
        grid-template-rows: repeat(8, auto);
        grid-template-columns: auto;
        align-items: center;
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