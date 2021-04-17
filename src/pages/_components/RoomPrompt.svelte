<script>
    import { socket, room, numUsers } from "./stores.js"
	let everUsed = false;
    let code = ""
    const handleClick = () => {
        everUsed = true;
        socket.emit('roomJoin', code)
        localStorage.setItem("mfrtjbcode", code);
        room.set(code)
        code = ""
    }

</script>

<div class="prompt" >
    <div class="room-code">
        <span>Room Code:</span>
        <br>
        <input type="text" class:pulsate={!everUsed} bind:value={code} on:change={handleClick} placeholder="enter room" class="code-entry"/>
        <!-- <span>{$room}</span> -->
    </div>
</div>

<style>

    input[type=text], textarea {
    	/* font-family: 'Major Mono Display', monospace; */
        font-family: 'Courier Prime', monospace;
        display: inline;
        font-family: inherit;
        font-size: inherit;
        padding: none;
        width: auto;
        background: rgba(243,243,246,255);
        border: none;
        font-style: italic;
    }
    
    .prompt {
        display: flex;
        flex-direction: row;
        margin: 0 auto;
    }
</style>