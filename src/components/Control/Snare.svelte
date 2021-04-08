<script type="ts">
    import { socket, recentParamValue, recentParamName } from "../stores.js";
    import ASlider from "../ASlider.svelte";
    import ControlTitle from "./ControlTitle.svelte";
    import ControlContainer from "./ControlContainer.svelte";
    import Presets from "./Presets.svelte";
    import { rng } from "./rng.js";

    export let instrument;
    export let parameters;

    $: instrument.filter.frequency.value = parameters.snare.frequency
    $: instrument.env.attack = parameters.snare.attack
    $: instrument.env.decay = parameters.snare.decay
    $: instrument.env.release = parameters.snare.release
    $: instrument.env.sustain = parameters.snare.sustain
    $: instrument.membrane.frequency.rampTo(parameters.snare.membraneFreq, 0.1)

    const uFrequency = () => {
        socket.emit('params::snare', 'frequency', parameters.snare.frequency);
    };

    const uAttack = () => {
        socket.emit('params::snare', 'attack', parameters.snare.attack);
    }

    const uDecay = () => {
        socket.emit('params::snare', 'decay', parameters.snare.decay);
    }

    const uSustain = () => {
        socket.emit('params::snare', 'sustain', parameters.snare.sustain);
    }

    const uRelease = () => {
        socket.emit('params::snare', 'release', parameters.snare.release);
    }

    const uMembraneFreq = () => {
        socket.emit('params::snare', 'membraneFreq', parameters.snare.membraneFreq);
    }

    const uOrder = () => {
        socket.emit('params::snare', 'order', parameters.snare.order)
    }

    socket.on('params::snare::frequency', data => parameters.snare.frequency = data);
    socket.on('params::snare::attack', data => parameters.snare.attack = data);
    socket.on('params::snare::decay', data => parameters.snare.decay = data);
    socket.on('params::snare::sustain', data => parameters.snare.sustain = data);
    socket.on('params::snare::release', data => parameters.snare.release = data);
    socket.on('params::snare::order', data => parameters.snare.order = data);
    socket.on('params::snare::membraneFreq', data => parameters.snare.membraneFreq = data);

    const randomise = () => {
        parameters.snare.frequency = rng(300, 5000); uFrequency();
        parameters.snare.attack = rng(0.001, 0.09); uAttack();
        parameters.snare.decay = rng(0.001, 1); uDecay();
        parameters.snare.sustain = rng(0.001, 1); uSustain();
        parameters.snare.release = rng(0.001, 1); uRelease();
        parameters.snare.order = rng(1, 50); uOrder();
    }
</script>

<ControlContainer>
    <ControlTitle title="Snare"/>
    <ASlider min="300" max="5000" step="1" title="filter freq" bind:value={parameters.snare.frequency} func={uFrequency} />
    <ASlider min="0.001" max="1.0" step="0.001" title="attack" bind:value={parameters.snare.attack} func={uAttack} />
    <ASlider min="0.001" max="1.0" step="0.001" title="decay" bind:value={parameters.snare.decay} func={uDecay} />
    <ASlider min="0.001" max="1.0" step="0.001" title="sustain" bind:value={parameters.snare.sustain} func={uSustain} />
    <ASlider min="0.001" max="1.0" step="0.001" title="release" bind:value={parameters.snare.release} func={uRelease} />    
    <ASlider min="30" max="15000" title="membrane frequency" bind:value={parameters.snare.membraneFreq} func={uMembraneFreq} />
    
    <Presets bind:data={parameters} key={'snare'} />
    <button on:click={randomise}>randomise</button>
</ControlContainer>