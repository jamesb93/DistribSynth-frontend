<script>
    import Slider from "../Slider.svelte"
    export let instrument;
    let frequency = instrument.frequency.value;

    const uFrequency = () => {instrument.frequency.rampTo(frequency, 0.1)};
</script>

<div class="container">
    <span class="title">Hi-Hat Synthesis</span>
    <Slider min="10" max="300" step="1" title="Frequency" bind:value={frequency} func={uFrequency} />
    <Slider min="0.1" max="5.1" step="0.1" title="Harmonicity" bind:value={instrument.harmonicity} />
    <Slider min="0.01" max="32" step="0.1" title="Index" bind:value={instrument.modulationIndex} />
    <Slider min="1" max="5000" step="1" title="Resonance" bind:value={instrument.resonance} />
    <Slider min="0" max="10" step="0.25" title="Octaves" bind:value={instrument.octaves} />
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