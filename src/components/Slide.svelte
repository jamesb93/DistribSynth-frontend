<script>
    import { onMount } from "svelte";

    let data = {};
    let a = -1;
    let b = -1;
    let connectStatus = false;
    let socket;

    onMount(() => {
        socket = new WebSocket("ws://localhost:8080");
        socket.addEventListener("open", function(event){
            connectStatus = true;
        });
        socket.addEventListener("message", (m) => {
            console.log(m);
            // parse message
            data = JSON.parse(m.data);
            a = data.a;
            b = data.b;
            console.log(a);
        })
    })

    function rangeHandler() {
        data.a = a;
        data.b = b;
        socket.send(JSON.stringify(data));
    }
</script>

{#if connectStatus}
    <span class="connected">You are connected</span>
{:else}
    <span class="disconnected">You are NOT connected</span>
{/if}

<label>
    {a}
	<input type=range bind:value={a} min=0 max=10 on:input={rangeHandler}>
</label>

<label>
    {b}
	<input type=range bind:value={b} min=0 max=10 on:input={rangeHandler}>
</label>

<br>


<style>
    .connected {
        color:green;
    }
    .disconnected {
        color: red;
    }
</style>