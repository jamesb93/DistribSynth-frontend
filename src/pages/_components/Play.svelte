<div class="container">
    <span>play/pause</span>
    <button on:click={onClick} class="button" class:pause={playing}></button>
</div>


<style>
    .container {
        display: flex;
        flex-direction: column;
    }

    .container > span {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        text-align: center;
        margin-top: 3px;
        padding-bottom: 7px;
        font-size: 0.8em;
        font-family: 'Courier Prime', monospace;
        /* font-family: 'Major Mono Display', monospace; */
        /* font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; */
    }
    .button {
        border: 0;
        background: transparent;
        box-sizing: border-box;
        width: 0;
        height: 74px;
        
        border-color: transparent transparent transparent #202020;
        transition: 100ms all ease;
        cursor: pointer;
        
        border-style: solid;
        border-width: 37px 0 37px 60px;
    }
        
    .pause {
        border-style: double;
        border-width: 0px 0 0px 60px;
    }
        
    button:hover {
        border-color: transparent transparent transparent #404040;
    }
</style>

<script>
    export let playing;
    const onClick = () => {
        playing = !playing;
        if (!playing) {
            pause();
        } else {
            start();
        }
    }

    export let start;
    export let pause;
</script>
