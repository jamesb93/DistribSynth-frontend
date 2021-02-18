<script>
    export let selected;
    export let emph;
    export let toggleFun;
    export let ranged = 1;
</script>

<div class="meta">
    <div class="clickable">
        <button 
            class = "base"
            class:select = {selected}
            class:emphasis = {emph}
            on:click = {toggleFun}
        />
    </div>

    <!-- If the area is in loop range -->
    {#if ranged}
        <div class="ranged"></div>
    {/if}
</div>

<style>
    /* Div Area Stuff */
    .meta {
        padding: 2px;
    }

    .clickable {
        z-index: 99;
    }

    /* Button Stuff */
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
        border: 2px solid #ff5d5d;
        width: 30px;
        height: 30px;
    }
</style>