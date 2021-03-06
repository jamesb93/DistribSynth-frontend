<script>
    import { socket, params, length } from "../stores.js";
    import ASlider from "../ASlider.svelte";
    import ControlTitle from "./ControlTitle.svelte";
    import ControlContainer from "./ControlContainer.svelte";
    import Presets from "./Presets.svelte";
    import { rng } from "./rng.js";

    export let instrument;
    export let id;

    $: instrument.source.frequency.value = $params[id].frequency;
    $: instrument.source.harmonicity = $params[id].harmonicity;
    $: instrument.source.modulationIndex = $params[id].modulationIndex;
    $: instrument.source.resonance = $params[id].resonance;
    $: instrument.source.octaves = $params[id].octaves;
    $: instrument.source.envelope.attack = $params[id].attack * Math.max($length, 0.25);
    $: instrument.source.envelope.decay = $params[id].decay * Math.max($length, 0.25);
    $: instrument.source.envelope.release = $params[id].release * Math.max($length, 0.25);


    const uFrequency = () => {
        socket.emit('params::'+id, 'frequency', $params[id].frequency);
    }

    const uHarmonicity = () => {
        socket.emit('params::'+id, 'harmonicity', $params[id].harmonicity)
    }

    const uModulationIndex = () => {
        socket.emit('params::'+id, 'modulationIndex', $params[id].modulationIndex)
    }

    const uResonance = () => {
        socket.emit('params::'+id, 'resonance', $params[id].resonance)
    }

    const uOctaves = () => {
        socket.emit('params::'+id, 'octaves', $params[id].octaves)
    }
    const uAttack = () => {
        socket.emit('params::'+id, 'attack', $params[id].attack)
    }
    const uDecay = () => {
        socket.emit('params::'+id, 'decay', $params[id].decay)
    }
    const uRelease = () => {
        socket.emit('params::'+id, 'release', $params[id].release)
    }

    socket.on('params::'+id+'::frequency', data => {$params[id].frequency = data})
    socket.on('params::'+id+'::harmonicity', data => {$params[id].harmonicity = data})
    socket.on('params::'+id+'::modulationIndex', data => {$params[id].modulationIndex = data})
    socket.on('params::'+id+'::resonance', data => {$params[id].resonance = data})
    socket.on('params::'+id+'::octaves', data => {$params[id].octaves = data})
    socket.on('params::'+id+'::order', data => {$params[id].order = data})
    socket.on('params::'+id+'::attack', data => {$params[id].attack = data})
    socket.on('params::'+id+'::decay', data => {$params[id].decay = data})
    socket.on('params::'+id+'::release', data => {$params[id].release = data})

    const randomise = () => {
        $params[id].frequency = rng(20, 800); uFrequency();
        $params[id].harmonicity = rng(0.0, 5.1); uHarmonicity();
        $params[id].modulationIndex = rng(0.01, 32); uModulationIndex();
        $params[id].resonance = rng(200, 500); uResonance();
        $params[id].octaves = rng(0, 3); uOctaves();
        $params[id].attack = rng(0.001, 1); uAttack();
        $params[id].decay = rng(0.001, 2); uDecay();
        $params[id].release = rng(0.001, 1); uRelease();
    }
</script>

<ControlContainer>
    <ControlTitle title="Metal Synthesis" />
    <ASlider min="10" max="5000" step="1" title="Frequency" bind:value={$params[id].frequency} func={uFrequency} />
    <ASlider min="0.0" max="5.1" step="0.1" title="Harmonicity" bind:value={$params[id].harmonicity} func={uHarmonicity} />
    <ASlider min="0.01" max="32" step="0.1" title="Index" bind:value={$params[id].modulationIndex} func={uModulationIndex} />
    <ASlider min="200" max="5000" step="1" title="Resonance" bind:value={$params[id].resonance} func={uResonance} />
    <ASlider min="0" max="3" step="0.25" title="Octaves" bind:value={$params[id].octaves} func={uOctaves}/>
    <ASlider min="0.001" max="1" step="0.001" title="attack" bind:value={$params[id].attack} func={uAttack} />
    <ASlider min="0.001" max="2" step="0.001" title="decay" bind:value={$params[id].decay} func={uDecay} />
    <ASlider min="0.001" max="1" step="0.001" title="release" bind:value={$params[id].release} func={uRelease} />
    

    <Presets bind:data={$params} key={id} />
</ControlContainer>