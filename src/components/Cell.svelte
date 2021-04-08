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

<div class="container" on:mouseenter={handleEnter}>
    <button 
        class="base"
        class:select = {selected}
        class:emphasis = {emph}
        on:click = {toggleFun}
    />
</div>

<style>

    .base {
        width: 50px;
        height: 50px;
        display: inline-block;
        border-radius: 0;
        background: none;
        box-shadow: none;
        border-style: none;
        border: 2px solid rgba(182, 182, 182, 0.468);
    }
    .container {
        padding: 4px;
    }

    .select {
        background-color: #bf5d5d;
    }

    .emphasis {
        border: 2px solid #ffffff;
    }
</style>