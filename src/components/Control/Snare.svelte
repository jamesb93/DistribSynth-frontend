<script type="ts">
    import { socket } from "../stores.js";
    import Slider from "../Slider.svelte";
    import ControlTitle from "./ControlTitle.svelte";
    import ControlContainer from "./ControlContainer.svelte";
    import Presets from "./Presets.svelte";

    export let instrument;
    export let parameters;

    $: instrument.membrane.frequency.value = parameters.snare.frequency
    $: instrument.env.attack = parameters.snare.attack
    $: instrument.env.decay = parameters.snare.decay
    $: instrument.env.release = parameters.snare.release
    $: instrument.env.sustain = parameters.snare.sustain
    $: instrument.waveshaper.order = parameters.snare.order

    const uFrequency = () => {
        socket.emit('params::snare', 'frequency', parameters.snare.frequency);
    };

    const uAttack = () => {
        socket.emit('params::snare', 'attack', parameters.snare.attack)
    }

    const uDecay = () => {
        socket.emit('params::snare', 'decay', parameters.snare.decay)
    }

    const uSustain = () => {
        socket.emit('params::snare', 'sustain', parameters.snare.sustain)
    }

    const uRelease = () => {
        socket.emit('params::snare', 'release', parameters.snare.release)
    }

    const uOrder = () => {
        socket.emit('params::snare', 'order', parameters.snare.order)
    }

    socket.on('params::snare::frequency', (data) => {parameters.snare.frequency = data});
    socket.on('params::snare::attack', (data) => {parameters.snare.attack = data});
    socket.on('params::snare::decay', (data) => {parameters.snare.decay = data});
    socket.on('params::snare::sustain', (data) => {parameters.snare.sustain = data});
    socket.on('params::snare::release', (data) => {parameters.snare.release = data});
    socket.on('params::snare::order', (data) => {parameters.snare.order = data});
</script>

<ControlContainer>
    <ControlTitle title="Snare"/>
    <Slider min="300" max="5000" step="1" title="filter freq" bind:value={parameters.snare.frequency} func={uFrequency} />
    <Slider min="0.001" max="1.0" step="0.001" title="attack" bind:value={parameters.snare.attack} func={uAttack} />
    <Slider min="0.001" max="1.0" step="0.001" title="decay" bind:value={parameters.snare.decay} func={uDecay} />
    <Slider min="0.001" max="1.0" step="0.001" title="sustain" bind:value={parameters.snare.sustain} func={uSustain} />
    <Slider min="0.001" max="1.0" step="0.001" title="release" bind:value={parameters.snare.release} func={uRelease} />
    <Slider min="1" max="50" step="1" title="waveshaping" bind:value={parameters.snare.order} func={uOrder} />
    <Presets bind:data={parameters} key={'snare'} />
</ControlContainer>