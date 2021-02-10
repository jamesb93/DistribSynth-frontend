<script>
    import Slider from "../Slider.svelte"
    export let instrument;
    let frequency = 50;
    let attack = 0.1;
    let decay = 4;
    let release = 1.4
    let sustain = 0.01

    const uFrequency = () => {
        instrument.frequency.rampTo(frequency, 0.1);
    };

    const uAttack  = () => {
        instrument.envelope.attack = (attack / 100.0)
    };
    const uDecay   = () => {
        instrument.envelope.decay = (decay / 100.0)
    };
    const uRelease = () => {
        instrument.envelope.release = (release / 100.0)
    };
    const uSustain = () => {
        instrument.envelope.sustain = (sustain / 100.0)
    };
</script>

<div class="container">
    <span class="title">Kick Synth</span>
    <Slider title="Frequency" min=35 max=90 bind:value={frequency} func={uFrequency} />
    <Slider title="Octaves" min=2 max=100 bind:value={instrument.octaves} />
    <Slider title="Attack" min=0 max=100 bind:value={attack} func={uAttack} />
    <!-- <Slider title="Decay" min=0 max=100 bind:value={decay} func={uDecay} /> -->
    <!-- <Slider title="Release" min=0 max=400 bind:value={release} func={uRelease} /> -->
    <Slider title="Sustain" min=0 max=100 bind:value={sustain} func={uSustain} />
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