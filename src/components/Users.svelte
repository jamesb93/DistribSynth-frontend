<script>
    import { onMount } from "svelte";

    let name = 'anon';
    let names = [];
    let socket;
    let data;

    onMount(() => {
        socket = new WebSocket("ws://192.168.1.20:8080");
        socket.addEventListener("message", (m) => {
            let d = JSON.parse(m.data).names;
            names = [];
            console.log(d);
            for (let key in d) {
                names.push(d[key]);
            }
        })
    })

    function setName() {
        socket.send(["name", name]);
    }


</script>
<br>
<input type="text" bind:value={name} />
<button on:click={setName}>
    Set Name
</button>

<br>
<br>
You are {name}
<br>

{#each names as name}
    {name}
    <br>
{/each}

<style>
    button {
        border: 1px outset blue;
        background-color: lightBlue;
        height:25px;
        width:120px;
        cursor:pointer;
    }

    button:hover {
        background-color: blue;
        color:white;
    }
</style>

