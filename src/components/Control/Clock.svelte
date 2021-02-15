<script>
    export let clock;
    console.log(clock, 'inside the Clock component')
</script>

<button 
    class:select="{clock === 'forward'}"
    on:click={() => {clock = 'forward'}}
>
    forward
</button>
<button 
    class:select="{clock === 'rebound'}"
    on:click={() => {clock = 'rebound'}}
>
    rebound
</button>

<button 
    class:select="{clock === 'wander'}"
    on:click={() => {clock = 'wander'}}
>
    wander
</button>

<style>
    button {
        border-radius: 3px;
        background-color: #d3d3d3;
        border: 1px solid rgba(219, 219, 219, 0.151);
        height: 40px;
        width: 100px;
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
        font-size: 20px;
        
    }
</style>
