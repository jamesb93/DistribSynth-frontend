<script>
    export let func = () => {};
    export let text = "";
    export let selected = false;
</script>

<button on:click={func} class:select={selected}>
    <span class="select-text">{text}</span>
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

    button {
        border-radius: 3px;
        background-color: #d3d3d3;
        border: 1px solid rgba(219, 219, 219, 0.151);
        height: 40px;
        width: 100px;
    }

    .select {
        background-color: #4c87af;
    }

    .select:hover {
        background-color: #3c6d8d;
        
    }
    .select-text {
        color: whitesmoke;
        /* font-family: 'VT323', monospace; */
    	font-family: 'Major Mono Display', monospace;
        color: grey;
        font-size: 14px;
    }
</style>