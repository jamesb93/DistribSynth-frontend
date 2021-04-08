<script type="ts">
    import { socket } from "../stores.js";
    import ASlider from "../ASlider.svelte";
    import ControlTitle from "./ControlTitle.svelte";
    import ControlContainer from "./ControlContainer.svelte";
    import Presets from "./Presets.svelte";
    import { rng } from "./rng.js";

    export let instrument;
    export let id;
    export let parameters;

    $: instrument.source.frequency.value = parameters[id].frequency;
    $: instrument.source.harmonicity = parameters[id].harmonicity;
    $: instrument.source.modulationIndex = parameters[id].modulationIndex;
    $: instrument.source.resonance = parameters[id].resonance;
    $: instrument.source.octaves = parameters[id].octaves;
    $: instrument.source.envelope.attack = parameters[id].attack;
    $: instrument.source.envelope.decay = parameters[id].decay;
    $: instrument.source.envelope.release = parameters[id].release;


    const uFrequency = () => {
        socket.emit('params::'+id, 'frequency', parameters[id].frequency);
    }

    const uHarmonicity = () => {
        socket.emit('params::'+id, 'harmonicity', parameters[id].harmonicity)
    }

    const uModulationIndex = () => {
        socket.emit('params::'+id, 'modulationIndex', parameters[id].modulationIndex)
    }

    const uResonance = () => {
        socket.emit('params::'+id, 'resonance', parameters[id].resonance)
    }

    const uOctaves = () => {
        socket.emit('params::'+id, 'octaves', parameters[id].octaves)
    }
    const uAttack = () => {
        socket.emit('params::'+id, 'attack', parameters[id].attack)
    }
    const uDecay = () => {
        socket.emit('params::'+id, 'decay', parameters[id].decay)
    }
    const uRelease = () => {
        socket.emit('params::'+id, 'release', parameters[id].release)
    }

    socket.on('params::'+id+'::frequency', data => {parameters[id].frequency = data})
    socket.on('params::'+id+'::harmonicity', data => {parameters[id].harmonicity = data})
    socket.on('params::'+id+'::modulationIndex', data => {parameters[id].modulationIndex = data})
    socket.on('params::'+id+'::resonance', data => {parameters[id].resonance = data})
    socket.on('params::'+id+'::octaves', data => {parameters[id].octaves = data})
    socket.on('params::'+id+'::order', data => {parameters[id].order = data})
    socket.on('params::'+id+'::attack', data => {parameters[id].attack = data})
    socket.on('params::'+id+'::decay', data => {parameters[id].decay = data})
    socket.on('params::'+id+'::release', data => {parameters[id].release = data})

    const randomise = () => {
        parameters[id].frequency = rng(20, 800); uFrequency();
        parameters[id].harmonicity = rng(0.0, 5.1); uHarmonicity();
        parameters[id].modulationIndex = rng(0.01, 32); uModulationIndex();
        parameters[id].resonance = rng(200, 500); uResonance();
        parameters[id].octaves = rng(0, 3); uOctaves();
        parameters[id].attack = rng(0.001, 1); uAttack();
        parameters[id].decay = rng(0.001, 2); uDecay();
        parameters[id].release = rng(0.001, 1); uRelease();
    }
</script>

<ControlContainer>
    <ControlTitle title="Metal Synthesis" />
    <ASlider min="10" max="5000" step="1" title="Frequency" bind:value={parameters[id].frequency} func={uFrequency} />
    <ASlider min="0.0" max="5.1" step="0.1" title="Harmonicity" bind:value={parameters[id].harmonicity} func={uHarmonicity} />
    <ASlider min="0.01" max="32" step="0.1" title="Index" bind:value={parameters[id].modulationIndex} func={uModulationIndex} />
    <ASlider min="200" max="5000" step="1" title="Resonance" bind:value={parameters[id].resonance} func={uResonance} />
    <ASlider min="0" max="3" step="0.25" title="Octaves" bind:value={parameters[id].octaves} func={uOctaves}/>
    <ASlider min="0.001" max="1" step="0.001" title="attack" bind:value={parameters[id].attack} func={uAttack} />
    <ASlider min="0.001" max="2" step="0.001" title="decay" bind:value={parameters[id].decay} func={uDecay} />
    <ASlider min="0.001" max="1" step="0.001" title="release" bind:value={parameters[id].release} func={uRelease} />
    

    <Presets bind:data={parameters} key={id} />
    <button on:click={randomise}>randomise</button>
</ControlContainer>