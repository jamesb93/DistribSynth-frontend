<script type="ts">
    import { socket } from "../stores.js";
    export let data;
    export let key;

    let selected: number = 0;
    let modifierDown: boolean = false;
    let store = {}

    const handleClick = (idx) => {
        selected = idx
        if (modifierDown) {
            store[idx] = JSON.stringify(data[key])
        } else {
            if (store[idx]) {
                data[key] = JSON.parse(store[idx])
            }
            for (let [param, value] of Object.entries(data[key])) {
                socket.emit('params::'+key, param, value)
            }
        };
    }

    const handleKeyDown = (key) => {
        if (key.code === "ShiftLeft") {
            modifierDown = true;
        }
    };
    const handleKeyUp = (key) => {
        if (key.code === "ShiftLeft") {
            modifierDown = false;
        }
    };
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp}></svelte:window>

<div class="container">
    <span class="title">
        presets | {#if modifierDown}storing {:else} recalling {/if}</span>
    <div class="button-container">
        {#each { length: 5 } as _, idx}
            <button 
            class="preset-button" 
            on:click={() => handleClick(idx)}
            class:selected={selected === idx} 
            />
        {/each}
    </div>
</div>


<style>
    .button-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 2px;
    }
    .preset-button {
        width: 25px;
        height: 25px;
        padding: 0px;
        border: 3px solid grey;
        display: inline-block;
        border-radius: 3px;
        background-color: rgb(175, 175, 175);
    }
    .title {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: grey;
        font-size: 14px;
    }

    .selected {
        background-color: #4c87af;
    }
</style>
