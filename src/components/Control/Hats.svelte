<script>
    import Slider from "../Slider.svelte"
    export let instrument;
    let frequency = 200;
    let harmonicity = 5.1;
    let modulationIndex = 32;
    let resonance = 4000;
    let octaves = 1.5;
    let attack = 1.4;
    let release = 0.2;

    const uHarmonicity = () => {
        instrument.harmonicity = harmonicity;
    };
    const uFrequency = () => {
        instrument.frequency = frequency;
    };
    const uModulationIndex = () => {
        instrument.modulationIndex = modulationIndex;
    };

    const uResonance = () => {
        instrument.resonance = resonance;
    }

    const uOctaves = () => {
        instrument.octaves = octaves;
    }
    
</script>

<div class="container">
    <span class="title">Hi-Hat Synthesis</span>
    <Slider min="40" max="2500" title="Frequency" bind:value={frequency} func={uFrequency} />
    <Slider min="0.5" max="100" title="Harmonicity" bind:value={harmonicity} func={uHarmonicity} />
    <Slider min="10" max="100" title="Index" bind:value={modulationIndex} func={uModulationIndex} />
    <Slider min="10" max="100" title="Resonance" bind:value={resonance} func={uResonance} />
    <Slider min="1" max="10" title="Octaves" bind:value={octaves} func={uOctaves} />
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