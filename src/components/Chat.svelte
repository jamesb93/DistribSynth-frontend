<script>
    import { socket } from "../components/stores.js";

    socket.on('chat', (e) => {
        chat = e;
    })
    let chat = [];
    let text = "";

    const handleKeydown = (key) => {
        if (key.key === "Enter") {
            socket.emit('chat', text);
            text = "";
        }
    };
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="chat">
    <div class="messages">
        {#each chat as msg}
            <span class="message">{msg}</span><br>
        {/each}
    </div>

    <input 
        type='text' 
        class="chat-input" 
        bind:value={text} 
        placeholder="chat anonymously..."
    >
</div>

<style>
    .chat {
        display: flex;
        /* grid-template-columns: auto; */
        max-width: 50%;
        /* align-self: center; */
    }
    .message {
        padding-top: 1em;
    }
    .messages {
        border: 1px solid #ccc;
        border-radius: 3px;
        min-height: 200px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        text-align: left;
        padding: 10px;
        word-wrap:break-word;
    }
    .chat-input {
        padding: 12px 20px;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 3px;
        box-sizing: border-box;
    }
</style>