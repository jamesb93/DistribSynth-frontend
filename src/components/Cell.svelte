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
        display: grid;
        padding: 5px;
    }

    .base {
        width: 50px;
        height: 50px;
        border: 3px solid black;
        display: inline-block;
        border-radius: 0px;
        background-color: whitesmoke;
    }

    .select {
        background-color: black;
    }

    .emphasis {
        border-color: red    
    }
</style>

