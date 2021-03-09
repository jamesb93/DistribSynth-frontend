<script type="ts">
    import { socket, room } from "./stores.js"
    let code = ""
    const handleClick = () => {
        socket.emit('roomJoin', code)
        localStorage.setItem("mfrtjbcode", code);
        room.set(code)
        code = ""
    }

    const handleClear = () => {
        localStorage.setItem("mfrtjbcode", "")
        room.set("")
        code = ""
    }

</script>

<div class="prompt" >
    <input type="text" bind:value={code} on:change={handleClick} placeholder="enter room code" class="code-entry"/>
    <button on:click={handleClear}>clear</button>
</div>



<style>
    input[type=text], textarea {
        -webkit-transition: all 0.30s ease-in-out;
        -moz-transition: all 0.30s ease-in-out;
        -ms-transition: all 0.30s ease-in-out;
        -o-transition: all 0.30s ease-in-out;
        outline: none;
        padding: 3px 0px 3px 3px;
        border: 1px solid #DDDDDD;
    }
    
    input[type=text]:focus, textarea:focus {
        box-shadow: 0 0 5px #4c87af;
        padding: 3px 0px 3px 3px;
        border: 1px solid #4c87af;
    }
    .prompt {
        display: flex;
        flex-direction: row;
        position: absolute;
        margin: 0 auto;
        width: 100px;
        height: 30px;
    }
</style>