<script>
    import { socket } from '../stores.js';
    import BoxButton from '../BoxButton.svelte';
    export let value;

    const handleClick = (mode) => {
        value = mode;
        socket.emit('clock::mode', value)
    }
</script>

<div class="container">
    <button 
        class:select="{value === 'forward'}"
        on:click={() => handleClick('forward')}
    >
        <span class:select-text={value==='forward'}>forward</span>
    </button>
    <button 
        class:select="{value === 'rebound'}"
        on:click={() => handleClick('rebound')}
    >
        <span class:select-text={value==='rebound'}>rebound</span>
    </button>

    <button 
        class:select="{value === 'wander'}"
        on:click={() => handleClick('wander')}
    >
        <span class:select-text={value==='wander'}>wander</span>
    </button>
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        gap: 1px; 
    }
</style>
