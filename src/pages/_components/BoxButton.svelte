<script>
    export let func = () => {};
    export let text = "";
</script>

<button on:click={func}>
    <span>{text}</span>
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

    span {
        /* font-family: 'VT323', monospace; */
    	/* font-family: 'Major Mono Display', monospace; */
        font-family: 'Courier Prime', monospace;
        color: grey;
        font-size: 10px;
    }
</style>