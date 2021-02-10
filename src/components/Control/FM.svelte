<script>
    import Slider from "../Slider.svelte"
    export let instrument;
    let harmonicity = 1.0;
    let frequency = 250;
    let modulationIndex = 1.0

    const uHarmonicity = () => {
        instrument.harmonicity.rampTo(harmonicity, 0.1)
        console.log(instrument.harmonicity.value)
    };
    const uFrequency = () => {
        instrument.frequency.rampTo(frequency, 0.1);
    };
    const uModulationIndex = () => {
        instrument.modulationIndex.rampTo(modulationIndex / 100.0, 0.1);
    };
    
</script>

<div class="container">
    <span class="title">FM Synthesis</span>
    <Slider min="40" max="2500" title="Frequency" bind:value={frequency} func={uFrequency} />
    <Slider min="3" max="15" title="Harmonicity" bind:value={harmonicity} func={uHarmonicity} />
    <Slider min="1000" max="8000" title="Index" bind:value={modulationIndex} func={uModulationIndex} />
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