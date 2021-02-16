<script type="ts">
    import Slider from "../Slider.svelte"
    export let instrument;
    export let sharedParam;
    let resonance: number = instrument.resonance;

    const uResonance = () => {instrument.resonance = resonance / 100.0};
</script>

<div class="container">
    <span class="title">Pluck</span>
    <Slider min="20" max="600" step="1" title="frequency" bind:value={sharedParam.pluck.frequency} />
    <Slider min="400" max="5000" step="1" title="dampening" bind:value={instrument.dampening} />
    <Slider min="1" max="100" step="1" title="resonance" bind:value={resonance} func={uResonance} />
</div>

<style>
    .title {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: grey;
    }
    .container {
        background-color: rgba(219, 219, 219, 0.151);
        display: flex;
        flex-direction: column;
        border: 1px solid grey;
        border-radius: 5px;
        width: 100%;
        padding-top: 10px;
        padding-bottom: 10px;
        width: 400px;
    }
</style>