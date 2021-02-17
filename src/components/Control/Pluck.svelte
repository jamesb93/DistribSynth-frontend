<script type="ts">
    import { socket } from "../stores.js";
    import Slider from "../Slider.svelte";
    import ControlTitle from "./ControlTitle.svelte";
    import ControlContainer from "./ControlContainer.svelte";
    export let instrument;
    export let parameters;

    $: instrument.frequency = parameters.pluck.frequency
    $: instrument.dampening = parameters.pluck.dampening;
    $: instrument.resonance = parameters.pluck.resonance;

    const uFrequency = () => {
        socket.emit('params::pluck::frequency', parameters.pluck.frequency);
    };

    const uDampening = () => {
        socket.emit('params::pluck::dampening', parameters.pluck.dampening)
    };

    const uResonance = () => {
        socket.emit('params::pluck::resonance', parameters.pluck.resonance)
    };

    socket.on('params::pluck::frequency', (e) => {parameters.pluck.frequency = e});
    socket.on('params::pluck::dampening', (e) => {parameters.pluck.dampening = e});
    socket.on('params::pluck::resonance', (e) => {parameters.pluck.resonance = e});
</script>

<ControlContainer>
    <ControlTitle title="Pluck Synthesis"/>
    <Slider min=20 max=60 step="1" title="frequency" bind:value={parameters.pluck.frequency} func={uFrequency} />
    <Slider min=400 max=5000 step="1" title="dampening" bind:value={parameters.pluck.dampening} func={uDampening} />
    <Slider min="0" max="1.0" step="0.01" title="resonance" bind:value={parameters.pluck.resonance} func={uResonance} />
</ControlContainer>