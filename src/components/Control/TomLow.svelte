<script>
    import { socket } from "../stores.js";
    import Slider from "../Slider.svelte";
    import ControlTitle from "./ControlTitle.svelte";
    import ControlContainer from "./ControlContainer.svelte";
    export let instrument;
    export let parameters;

    $: instrument.frequency.value = parameters.tomLow.frequency;
    $: instrument.octaves = parameters.tomLow.octaves;
    $: instrument.envelope.attack = parameters.tomLow.attack;
    $: instrument.envelope.sustain = parameters.tomLow.sustain;
    $: instrument.envelope.decay = parameters.tomLow.decay;
    $: instrument.envelope.release = parameters.tomLow.release;


    const uFrequency = () => {
        socket.emit('params::tomLow', 'frequency', parameters.tomLow.frequency)
    };

    const uOctaves = () => {
        socket.emit('params::tomLow', 'octaves', parameters.tomLow.octaves)
    }

    const uAttack  = () => {
        socket.emit('params::tomLow', 'attack', parameters.tomLow.attack)
    };

    const uDecay   = () => {
        socket.emit('params::tomLow', 'decay', parameters.tomLow.decay)
    };

    const uRelease = () => {
        socket.emit('params::tomLow', 'release', parameters.tomLow.release)
    };
    const uSustain = () => {
        socket.emit('params::tomLow', 'sustain', parameters.tomLow.sustain)
    };
    
    socket.on('params::tomLow::frequency', (data) => {parameters.tomLow.frequency = data});
    socket.on('params::tomLow::octaves', (data) => {parameters.tomLow.octaves = data});
    socket.on('params::tomLow::attack', (data) => {parameters.tomLow.attack = data});
    socket.on('params::tomLow::decay', (data) => {parameters.tomLow.decay = data});
    socket.on('params::tomLow::release', (data) => {parameters.tomLow.release = data});
    socket.on('params::tomLow::sustain', (data) => {parameters.tomLow.sustain = data});
</script>

<ControlContainer>
    <ControlTitle title="Low Tom"/>
    <Slider title="Frequency" min="35" max="90" bind:value={parameters.tomLow.frequency} func={uFrequency} />
    <Slider title="Octaves" min="0.5" max="8" step="0.5" bind:value={parameters.tomLow.octaves} func={uOctaves}/>
    <Slider title="Attack" min="0.0" max="0.1" step="0.001" bind:value={parameters.tomLow.attack} func={uAttack} />
    <Slider title="Decay" min="0.0" max="1.0" step="0.05" bind:value={parameters.tomLow.decay} func={uDecay} />
    <Slider title="Sustain" min="0.0" max="1.0" step="0.05" bind:value={parameters.tomLow.sustain} func={uSustain} />
    <Slider title="Release" min="0.0" max="1.4" step="0.05" bind:value={parameters.tomLow.release} func={uRelease} />
</ControlContainer>