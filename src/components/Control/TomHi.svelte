<script>
    import { socket } from "../stores.js";
    import Slider from "../Slider.svelte";
    import ControlTitle from "./ControlTitle.svelte";
    import ControlContainer from "./ControlContainer.svelte";
    export let instrument;
    export let parameters;

    $: instrument.frequency.value = parameters.tomHi.frequency;
    $: instrument.octaves = parameters.tomHi.octaves;
    $: instrument.envelope.attack = parameters.tomHi.attack;
    $: instrument.envelope.sustain = parameters.tomHi.sustain;
    $: instrument.envelope.decay = parameters.tomHi.decay;
    $: instrument.envelope.release = parameters.tomHi.release;


    const uFrequency = () => {
        socket.emit('params::tomHi', 'frequency', parameters.tomHi.frequency)
    };

    const uOctaves = () => {
        socket.emit('params::tomHi', 'octaves', parameters.tomHi.octaves)
    }

    const uAttack  = () => {
        socket.emit('params::tomHi', 'attack', parameters.tomHi.attack)
    };

    const uDecay   = () => {
        socket.emit('params::tomHi', 'decay', parameters.tomHi.decay)
    };

    const uRelease = () => {
        socket.emit('params::tomHi', 'release', parameters.tomHi.release)
    };
    const uSustain = () => {
        socket.emit('params::tomHi', 'sustain', parameters.tomHi.sustain)
    };
    
    socket.on('params::tomHi::frequency', (data) => {parameters.tomHi.frequency = data});
    socket.on('params::tomHi::octaves', (data) => {parameters.tomHi.octaves = data});
    socket.on('params::tomHi::attack', (data) => {parameters.tomHi.attack = data});
    socket.on('params::tomHi::decay', (data) => {parameters.tomHi.decay = data});
    socket.on('params::tomHi::release', (data) => {parameters.tomHi.release = data});
    socket.on('params::tomHi::sustain', (data) => {parameters.tomHi.sustain = data});
</script>

<ControlContainer>
    <ControlTitle title="High Tom"/>
    <Slider title="Frequency" min="96" max="768" bind:value={parameters.tomHi.frequency} func={uFrequency} />
    <Slider title="Octaves" min="0.5" max="8" step="0.5" bind:value={parameters.tomHi.octaves} func={uOctaves}/>
    <Slider title="Attack" min="0.0" max="0.1" step="0.001" bind:value={parameters.tomHi.attack} func={uAttack} />
    <Slider title="Decay" min="0.0" max="1.0" step="0.05" bind:value={parameters.tomHi.decay} func={uDecay} />
    <Slider title="Sustain" min="0.0" max="1.0" step="0.05" bind:value={parameters.tomHi.sustain} func={uSustain} />
    <Slider title="Release" min="0.0" max="1.4" step="0.05" bind:value={parameters.tomHi.release} func={uRelease} />
</ControlContainer>