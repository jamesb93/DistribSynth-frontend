<script>
    import { grid } from "./stores.js";
    export let y;
    export let x;
    export let func;
    export let emph;
    export let cellSnapshot;
    export let anyMouseDown;
    
    const handleMouseDown = () => {
        anyMouseDown = true;
        cellSnapshot = $grid[x][y];
    }
    const handleEnter = () => {
        if (anyMouseDown) {
            $grid[x][y] = cellSnapshot;
        }
        func();
    }
    
    const compositeFunction = () => {
        $grid[x][y] = !$grid[x][y]
        func();
    }
</script>

<svg 
class="cell"
class:emphasis={ emph }
class:selemph={ emph && $grid[x][y] }
on:click={compositeFunction}
on:mouseenter={handleEnter} 
on:mousedown={handleMouseDown} 
>
    <!-- <text x="25" y="25">{x}|{y}</text> -->
    <line x1="0" x2="50" y1="0" y2="0" class="outline" />
    <line x1="0" x2="0" y1="0" y2="50" class="outline" />
    {#if y === 15}
    <line x1="50" x2="50" y1="0" y2="50" class="outline" />
    {/if}

    {#if x === 5}
    <line x1="0" x2="50" y1="50" y2="50" class="outline" />
    {/if}
    {#if $grid[x][y]}
    <!-- Cross -->
    <line class:checkemph={emph} x1="49" x2="1" y1="1" y2="49" class="check" />
    <line class:checkemph={emph} x1="1" x2="49" y1="1" y2="49" class="check" />
    {/if}
</svg>

<style>
    text {
        font-family: 'Courier New', Courier, monospace;
        font-size: 12px;
    }
    .cell {
        width: 50px;
        height: 50px;
    }

    .outline {
        stroke: rgba(0, 0, 0, 1.0);
    }

    .check {
        stroke: rgba(118,167,112,255);
        stroke-width: 1px;
    }

    .checkemph {
        stroke: rgba(255,255,255,255);

    }
    
    .emphasis {
        background-color: rgba(224,224,224,255)
    }

    .selemph {
        background-color: rgba(118,167,112,255);
    }
</style>