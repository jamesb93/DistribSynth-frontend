<script>
    import { fade } from 'svelte/transition';
    export let direction = "up"
    export let func;
    
    let hovered;

    const enter = () => {hovered = true}
    const leave = () => {hovered = false}
</script>

<div 
    class="container" 
    class:hidden={!hovered}
    on:mouseenter={enter} 
    on:mouseleave={leave} 
    on:click = {func}>
    <i
        class="arrow"
        class:up    = {direction === "up"}
        class:down  = {direction === "down"}
        class:right = {direction === "right"}
        class:left  = {direction === "left"}
    />
</div>


<style>
    .container {
        height: 30px;
        width: 30px;
        padding-left: 2px;
        padding-right: 2px;
        opacity: 1
    }
    .hidden {
        opacity: 0.15;
        transition: opacity 0.35s;
    }
    .arrow {
        border: 1px solid grey;
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 4px;
        text-align: center;
    }
    
    .right {
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
    }
    
    .left {
        transform: rotate(135deg);
        -webkit-transform: rotate(135deg);
    }
    
    .up {
        transform: rotate(-135deg);
        -webkit-transform: rotate(-135deg);

    }
    
    .down {
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
    }
</style>