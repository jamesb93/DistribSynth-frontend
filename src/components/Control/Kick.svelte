<script>
    import { socket } from "../stores.js";
    import Slider from "../Slider.svelte";
    import ControlTitle from "./ControlTitle.svelte";
    import ControlContainer from "./ControlContainer.svelte";
    import Presets from "./Presets.svelte";

    export let instrument;
    export let parameters;

    $: instrument.waveshaper.octaves = parameters.kick.octaves;
    $: instrument.membrane.frequency.value = parameters.kick.frequency;
    $: instrument.membrane.envelope.attack = parameters.kick.attack;
    $: instrument.membrane.envelope.sustain = parameters.kick.sustain;
    $: instrument.membrane.envelope.decay = parameters.kick.decay;
    $: instrument.membrane.envelope.release = parameters.kick.release;
    $: instrument.distortion.distortion = parameters.kick.distortion;

    const template = (instrument, parameter) => {
        socket.emit('params::'+instrument, parameter, parameters[instrument][parameter])
    }

    const uFrequency = () => {
        socket.emit('params::kick', 'frequency', parameters.kick.frequency)
    };

    const uOctaves = () => {
        socket.emit('params::kick', 'octaves', parameters.kick.octaves)
    }

    const uAttack  = () => {
        socket.emit('params::kick', 'attack', parameters.kick.attack)
    };

    const uDecay   = () => {
        socket.emit('params::kick', 'decay', parameters.kick.decay)
    };

    const uRelease = () => {
        socket.emit('params::kick', 'release', parameters.kick.release)
    };
    const uSustain = () => {
        socket.emit('params::kick', 'sustain', parameters.kick.sustain)
    };

    const uDistortion = () => {
        socket.emit('params::kick', 'distortion', parameters.kick.distortion)
    }
    
    socket.on('params::kick::distortion', (data) => {parameters.kick.distortion = data});
    socket.on('params::kick::frequency', (data) => {parameters.kick.frequency = data});
    socket.on('params::kick::octaves', (data) => {parameters.kick.octaves = data});
    socket.on('params::kick::attack', (data) => {parameters.kick.attack = data});
    socket.on('params::kick::decay', (data) => {parameters.kick.decay = data});
    socket.on('params::kick::release', (data) => {parameters.kick.release = data});
    socket.on('params::kick::sustain', (data) => {parameters.kick.sustain = data});
</script>

<ControlContainer>
    <ControlTitle title="Kick Synth"/>
    <Slider title="Frequency" min="35" max="90" bind:value={parameters.kick.frequency} func={uFrequency} />
    <Slider title="Octaves" min="0.5" max="8" step="0.5" bind:value={parameters.kick.octaves} func={uOctaves}/>
    <Slider title="Attack" min="0.0" max="0.1" step="0.001" bind:value={parameters.kick.attack} func={uAttack} />
    <Slider title="Decay" min="0.0" max="1.0" step="0.05" bind:value={parameters.kick.decay} func={uDecay} />
    <Slider title="Sustain" min="0.0" max="1.0" step="0.05" bind:value={parameters.kick.sustain} func={uSustain} />
    <Slider title="Release" min="0.0" max="1.4" step="0.05" bind:value={parameters.kick.release} func={uRelease} />
    <Slider title="Distortion" min="0.0" max="1.0" step="0.01" bind:value={parameters.kick.distortion} func={uDistortion} />
    <Presets bind:data={parameters} key={'kick'} />
</ControlContainer>