<script>
    import { socket } from "../stores.js";
    import Slider from "../Slider.svelte";
    import ControlTitle from "./ControlTitle.svelte";
    import ControlContainer from "./ControlContainer.svelte";
    import Presets from "./Presets.svelte";

    export let instrument;
    export let parameters;
    export let id;

    $: instrument.fund.rampTo(parameters[id].frequency)
    $: instrument.c1ratio.rampTo(parameters[id].c1ratio, 0.1)
    $: instrument.c2ratio.rampTo(parameters[id].c2ratio, 0.1)
    $: instrument.c3ratio.rampTo(parameters[id].c3ratio, 0.1)
    $: instrument.fm2to1.factor.rampTo(parameters[id].fm2to1, 0.1)
    $: instrument.fm3to2.factor.rampTo(parameters[id].fm3to2, 0.1)
    $: instrument.fm3to1.factor.rampTo(parameters[id].fm3to1, 0.1)
    $: instrument.c1env.release = parameters[id].c1env
    $: instrument.c2env.release = parameters[id].c2env
    $: instrument.c3env.release = parameters[id].c3env


    const uFrequency = () => {
        socket.emit('params::'+id, 'frequency', parameters[id].frequency)
    };
    const uc1ratio = () => {
        socket.emit('params::'+id, 'c1ratio', parameters[id].c1ratio)
    };
    const uc2ratio = () => {
        socket.emit('params::'+id, 'c2ratio', parameters[id].c2ratio)
    };
    const uc3ratio = () => {
        socket.emit('params::'+id, 'c3ratio', parameters[id].c3ratio)
    };
    const ufm2to1 = () => {
        socket.emit('params::'+id, 'fm2to1', parameters[id].fm2to1)
    };
    const ufm3to2 = () => {
        socket.emit('params::'+id, 'fm3to2', parameters[id].fm3to2)
    };
    const ufm3to1 = () => {
        socket.emit('params::'+id, 'fm3to1', parameters[id].fm3to1)
    };
    const uc1env = () => {
        socket.emit('params::'+id, 'c1env', parameters[id].c1env)
    };
    const uc2env = () => {
        socket.emit('params::'+id, 'c2env', parameters[id].c2env)
    };
    const uc3env = () => {
        socket.emit('params::'+id, 'c3env', parameters[id].c3env)
    };
    
    socket.on('params::'+id+'::frequency', (data) => {parameters[id].frequency = data});
    socket.on('params::'+id+'::c1ratio', (data) => {parameters[id].c1ratio = data});
    socket.on('params::'+id+'::c2ratio', (data) => {parameters[id].c2ratio = data});
    socket.on('params::'+id+'::c3ratio', (data) => {parameters[id].c3ratio = data});
    socket.on('params::'+id+'::fm2to1', (data) => {parameters[id].fm2to1 = data});
    socket.on('params::'+id+'::fm3to1', (data) => {parameters[id].fm3to1 = data});
    socket.on('params::'+id+'::fm3to2', (data) => {parameters[id].fm3to2 = data});
    socket.on('params::'+id+'::c1env', (data) => {parameters[id].c1env = data});
    socket.on('params::'+id+'::c2env', (data) => {parameters[id].c2env = data});
    socket.on('params::'+id+'::c3env', (data) => {parameters[id].c3env = data});
</script>

<ControlContainer>
    <ControlTitle title="3OP FM"/>
    <Slider title="Frequency" min="50" max="1000" bind:value={parameters[id].frequency} func={uFrequency} />
    <Slider title="Ratio 1" min="1" max="10" bind:value={parameters[id].c1ratio} func={uc1ratio} />
    <Slider title="Ratio 2" min="1" max="10" bind:value={parameters[id].c2ratio} func={uc2ratio} />
    <Slider title="Ratio 3" min="1" max="10" bind:value={parameters[id].c3ratio} func={uc3ratio} />
    <Slider title="Feedback 1" min="0" max="2000" bind:value={parameters[id].fm2to1} func={ufm2to1} />
    <Slider title="Feedback 2" min="0" max="2000" bind:value={parameters[id].fm3to1} func={ufm3to1} />
    <Slider title="Feedback 3" min="0" max="2000" bind:value={parameters[id].fm3to2} func={ufm3to2} />
    <Slider title="Envelope Length 1" min="0.05" max="5" bind:value={parameters[id].c1env} func={uc1env} />
    <Slider title="Envelope Length 2" min="0.05" max="5" bind:value={parameters[id].c2env} func={uc2env} />
    <Slider title="Envelope Length 3" min="0.05" max="5" bind:value={parameters[id].c3env} func={uc3env} />
    <Presets bind:data={parameters} key={id} />
</ControlContainer>