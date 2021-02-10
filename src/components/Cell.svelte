<script>
    export let selected;
    export let emph;
    export let toggleFun;
</script>

<div class="cell-container">
    <button 
        class = "base"
        class:select = {selected}
        class:emphasis = {emph}
        on:click = {toggleFun}
    />
</div>

<style>
    div {
        padding: 5px;
    }

    .base {
        padding: 5px;
        width: 50px;
        height: 50px;
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