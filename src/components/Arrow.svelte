<script>
    export let direction = "up"
</script>

<i
    class = "arrow"
    class:up    = {direction === "up"}
    class:down  = {direction === "down"}
    class:right = {direction === "right"}
    class:left    = {direction === "left"}
/>


<style>
    .arrow {
        border: solid black;
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 3px;
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