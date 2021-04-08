<script>
    import { socket } from "../stores.js";
    import ASlider from "../ASlider.svelte";
    import ControlTitle from "./ControlTitle.svelte";
    import ControlContainer from "./ControlContainer.svelte";
    import Presets from "./Presets.svelte";
    import { rng } from "./rng.js";

    export let instrument;
    export let parameters;
    export let id;

    $: instrument.fund.rampTo(parameters[id].frequency, 0.1)
    $: instrument.c1ratio.rampTo(parameters[id].c1ratio, 0.1)
    $: instrument.c2ratio.rampTo(parameters[id].c2ratio, 0.1)
    $: instrument.c3ratio.rampTo(parameters[id].c3ratio, 0.1)
    $: instrument.fm2to1.factor.rampTo(parameters[id].fm2to1, 0.1)
    $: instrument.fm3to2.factor.rampTo(parameters[id].fm3to2, 0.1)
    $: instrument.fm3to1.factor.rampTo(parameters[id].fm3to1, 0.1)
    $: instrument.c1env.release = parameters[id].c1env
    $: instrument.c2env.release = parameters[id].c2env
    $: instrument.c3env.release = parameters[id].c3env
    $: instrument.op1gain.gain.rampTo(parameters[id].op1gain * 0.333, 0.1);
    $: instrument.op2gain.gain.rampTo(parameters[id].op2gain * 0.333, 0.1);
    $: instrument.op3gain.gain.rampTo(parameters[id].op3gain * 0.333, 0.1);

    const uFrequency = () => {
        socket.emit('params::'+id, 'frequency', parameters[id].frequency);
    };
    const uc1ratio = () => {
        socket.emit('params::'+id, 'c1ratio', parameters[id].c1ratio);
    };
    const uc2ratio = () => {
        socket.emit('params::'+id, 'c2ratio', parameters[id].c2ratio);
    };
    const uc3ratio = () => {
        socket.emit('params::'+id, 'c3ratio', parameters[id].c3ratio);
    };
    const ufm2to1 = () => {
        socket.emit('params::'+id, 'fm2to1', parameters[id].fm2to1);
    };
    const ufm3to2 = () => {
        socket.emit('params::'+id, 'fm3to2', parameters[id].fm3to2);
    };
    const ufm3to1 = () => {
        socket.emit('params::'+id, 'fm3to1', parameters[id].fm3to1);
    };
    const uc1env = () => {
        socket.emit('params::'+id, 'c1env', parameters[id].c1env);
    };
    const uc2env = () => {
        socket.emit('params::'+id, 'c2env', parameters[id].c2env);
    };
    const uc3env = () => {
        socket.emit('params::'+id, 'c3env', parameters[id].c3env);
    };
    const uop1gain = () => {
        socket.emit('params::'+id, 'op1gain', parameters[id].op1gain);
    };
    const uop2gain = () => {
        socket.emit('params::'+id, 'op2gain', parameters[id].op2gain);
    };
    const uop3gain = () => {
        socket.emit('params::'+id, 'op3gain', parameters[id].op3gain);
    };
    
    socket.on('params::'+id+'::frequency', data => {parameters[id].frequency = data});
    socket.on('params::'+id+'::c1ratio', data => {parameters[id].c1ratio = data});
    socket.on('params::'+id+'::c2ratio', data => {parameters[id].c2ratio = data});
    socket.on('params::'+id+'::c3ratio', data => {parameters[id].c3ratio = data});
    socket.on('params::'+id+'::fm2to1', data => {parameters[id].fm2to1 = data});
    socket.on('params::'+id+'::fm3to1', data => {parameters[id].fm3to1 = data});
    socket.on('params::'+id+'::fm3to2', data => {parameters[id].fm3to2 = data});
    socket.on('params::'+id+'::c1env', data => {parameters[id].c1env = data});
    socket.on('params::'+id+'::c2env', data => {parameters[id].c2env = data});
    socket.on('params::'+id+'::c3env', data => {parameters[id].c3env = data});
    socket.on('params::'+id+'::op1gain', data => {parameters[id].op1gain = data});
    socket.on('params::'+id+'::op2gain', data => {parameters[id].op2gain = data});
    socket.on('params::'+id+'::op3gain', data => {parameters[id].op3gain = data});

    const randomise = () => {
        parameters[id].frequency = rng(20, 800); uFrequency();
        parameters[id].c1ratio = rng(1, 10); uc1ratio();
        parameters[id].c2ratio = rng(1, 10); uc2ratio();
        parameters[id].c3ratio = rng(1, 10); uc3ratio();
        parameters[id].fm2to1 = rng(0, 5000); ufm2to1();
        parameters[id].fm3to1 = rng(0, 5000); ufm3to1()
        parameters[id].fm3to2 = rng(0, 5000); ufm3to2();
        parameters[id].c1env = rng(0.05, 5); uc1env();
        parameters[id].c2env = rng(0.05, 5); uc2env();
        parameters[id].c3env = rng(0.05, 5); uc3env();
        parameters[id].op1gain = rng(0, 1); uop1gain();
        parameters[id].op2gain = rng(0, 1); uop2gain();
        parameters[id].op3gain = rng(0, 1); uop3gain(); 
    }
</script>

<ControlContainer>
    <ControlTitle title="3OP FM"/>
    <ASlider title="Frequency" min="1" max="15000" bind:value={parameters[id].frequency} func={uFrequency} />
    <ASlider title="Ratio 1" min="1" max="100" bind:value={parameters[id].c1ratio} func={uc1ratio} />
    <ASlider title="Ratio 2" min="1" max="100" bind:value={parameters[id].c2ratio} func={uc2ratio} />
    <ASlider title="Ratio 3" min="1" max="100" bind:value={parameters[id].c3ratio} func={uc3ratio} />
    <ASlider title="FB 2to1" min="0" max="20000" bind:value={parameters[id].fm2to1} func={ufm2to1} />
    <ASlider title="FB 3to1" min="0" max="20000" bind:value={parameters[id].fm3to1} func={ufm3to1} />
    <ASlider title="FB 3to2" min="0" max="20000" bind:value={parameters[id].fm3to2} func={ufm3to2} />
    <ASlider title="Envelope Length 1" min="0.05" max="5" bind:value={parameters[id].c1env} func={uc1env} />
    <ASlider title="Envelope Length 2" min="0.05" max="5" bind:value={parameters[id].c2env} func={uc2env} />
    <ASlider title="Envelope Length 3" min="0.05" max="5" bind:value={parameters[id].c3env} func={uc3env} />
    <ASlider title="OP1 Gain" min="0" max="1" step="0.001" bind:value={parameters[id].op1gain} func={uop1gain} />
    <ASlider title="OP2 Gain" min="0" max="1" step="0.001" bind:value={parameters[id].op2gain} func={uop2gain} />
    <ASlider title="OP3 Gain" min="0" max="1" step="0.001" bind:value={parameters[id].op3gain} func={uop3gain} />
    
    <Presets bind:data={parameters} key={id} />
    <button on:click={randomise}>randomise</button>
</ControlContainer>