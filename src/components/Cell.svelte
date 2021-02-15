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
        padding: 5px;
    }

    .clickable {
        z-index: 99;
    }

    .ranged {
        z-index: 1;
        background-color: rgba(255, 166, 0, 0.5);
    }

    /* Button Stuff */
    .base {
        width: 50px;
        height: 50px;
        padding: 5px;
        border: 3px solid black;
        display: inline-block;
        border-radius: 0px;
        background-color: whitesmoke;
    }

    .select {
        background-color: #4c87af;
    }

    .emphasis {
        border-color: #00ff22;
        border: 4px solid #00ff22;
        width: 51px;
        height: 51px;
    }
</style>