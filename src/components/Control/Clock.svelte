<script>
    import { socket } from '../stores.js';
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
    button {
        border-radius: 3px;
        background-color: #d3d3d3;
        border: 1px solid rgba(219, 219, 219, 0.151);
        height: 40px;
        width: 100px;
    }

    .container {
        display: flex;
        flex-direction: row;
        gap: 1px;
        
    }

    button:hover {
        background-color: #b3b3b3;
        
    }
    .select {
        background-color: #4c87af;
    }

    .select:hover {
        background-color: #3c6d8d;
        
    }

    span {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: grey;
        font-size: 14px;
    }

    .select-text {
        color: whitesmoke;
    }
</style>
