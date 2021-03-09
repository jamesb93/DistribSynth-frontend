<script>
    export let selected;
    export let emph;
    export let toggleFun;
    export let mouse

    const handleEnter = () => {
        if (mouse) {
            toggleFun()
        }
    }
</script>

<div class="clickable" on:mouseenter={handleEnter}>
    <button 
        class = "base"
        class:select = {selected}
        class:emphasis = {emph}
        on:click = {toggleFun}
    />
</div>

<svelte:window  />

<style>
    .clickable {
        z-index: 99;
        padding: 2px;
    }

    .base {
        width: 30px;
        height: 30px;
        padding: 0px;
        border: 2px solid black;
        display: inline-block;
        border-radius: 0px;
        background-color: whitesmoke;
    }

    .select {
        background-color: #4c87af;
    }

    .emphasis {
        border: 2px solid #ec5dff;
        width: 30px;
        height: 30px;
    }
</style>