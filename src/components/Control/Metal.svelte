<script type="ts">
    import { socket } from "../stores.js";
    import Slider from "../Slider.svelte";
    import ControlTitle from "./ControlTitle.svelte";
    import ControlContainer from "./ControlContainer.svelte";
    import Presets from "./Presets.svelte";

    export let instrument;
    export let id;
    export let parameters;

    $: instrument.source.frequency.value = parameters[id].frequency;
    $: instrument.source.harmonicity = parameters[id].harmonicity;
    $: instrument.source.modulationIndex = parameters[id].modulationIndex;
    $: instrument.source.resonance = parameters[id].resonance;
    $: instrument.source.octaves = parameters[id].octaves;
    $: instrument.waveshaper.order = parameters[id].order;

    const uFrequency = () => {
        socket.emit('params::'+id, 'frequency', parameters[id].frequency)
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

    const uOrder = () => {
        socket.emit('params::'+id, 'order', parameters[id].order)
    }

    socket.on('params::'+id+'::frequency', (data) => {parameters[id].frequency = data})
    socket.on('params::'+id+'::harmonicity', (data) => {parameters[id].harmonicity = data})
    socket.on('params::'+id+'::modulationIndex', (data) => {parameters[id].modulationIndex = data})
    socket.on('params::'+id+'::resonance', (data) => {parameters[id].resonance = data})
    socket.on('params::'+id+'::octaves', (data) => {parameters[id].octaves = data})
    socket.on('params::'+id+'::order', (data) => {parameters[id].order = data})

</script>

<ControlContainer>
    <ControlTitle title="Metal Synthesis" />
    <Slider min="10" max="5000" step="1" title="Frequency" bind:value={parameters[id].frequency} func={uFrequency} />
    <Slider min="0.0" max="5.1" step="0.1" title="Harmonicity" bind:value={parameters[id].harmonicity} func={uHarmonicity} />
    <Slider min="0.01" max="32" step="0.1" title="Index" bind:value={parameters[id].modulationIndex} func={uModulationIndex} />
    <Slider min="200" max="5000" step="1" title="Resonance" bind:value={parameters[id].resonance} func={uResonance} />
    <Slider min="0" max="3" step="0.25" title="Octaves" bind:value={parameters[id].octaves} func={uOctaves}/>
    <Slider min="1" max="50" step="1" title="waveshape" bind:value={parameters[id].order} func={uOrder} />
    <Presets bind:data={parameters} key={id} />
</ControlContainer>