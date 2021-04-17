<script>
    import { socket, params, length } from "../stores.js";
    import { snare } from "../../../instruments/ensemble.js";
    import ASlider from "../ASlider.svelte";
    import ControlTitle from "./ControlTitle.svelte";
    import ControlContainer from "./ControlContainer.svelte";
    import Presets from "./Presets.svelte";
    import { rng } from "./rng.js";
    
    $: snare.filter.frequency.value = $params.snare.frequency;
    $: snare.env.attack = $params.snare.attack * $length;
    $: snare.env.decay = $params.snare.decay * $length;
    $: snare.env.release = $params.snare.release * $length;
    $: snare.env.sustain = $params.snare.sustain
    $: snare.membrane.frequency.rampTo($params.snare.membraneFreq, 0.1)
    $: snare.waveshaper.order = $params.snare.order;

    const uFrequency = () => {
        socket.emit('params::snare', 'frequency', $params.snare.frequency);
    };

    const uAttack = () => {
        socket.emit('params::snare', 'attack', $params.snare.attack);
    }

    const uDecay = () => {
        socket.emit('params::snare', 'decay', $params.snare.decay);
    }

    const uSustain = () => {
        socket.emit('params::snare', 'sustain', $params.snare.sustain);
    }

    const uRelease = () => {
        socket.emit('params::snare', 'release', $params.snare.release);
    }

    const uMembraneFreq = () => {
        socket.emit('params::snare', 'membraneFreq', $params.snare.membraneFreq);
    }

    const uOrder = () => {
        socket.emit('params::snare', 'order', $params.snare.order)
    }

    socket.on('params::snare::frequency', data => $params.snare.frequency = data);
    socket.on('params::snare::attack', data => $params.snare.attack = data);
    socket.on('params::snare::decay', data => $params.snare.decay = data);
    socket.on('params::snare::sustain', data => $params.snare.sustain = data);
    socket.on('params::snare::release', data => $params.snare.release = data);
    socket.on('params::snare::order', data => $params.snare.order = data);
    socket.on('params::snare::membraneFreq', data => $params.snare.membraneFreq = data);

    const randomise = () => {
        $params.snare.frequency = rng(300, 5000); uFrequency();
        $params.snare.attack = rng(0.001, 0.09); uAttack();
        $params.snare.decay = rng(0.001, 1); uDecay();
        $params.snare.sustain = rng(0.001, 1); uSustain();
        $params.snare.release = rng(0.001, 1); uRelease();
        $params.snare.order = rng(1, 50); uOrder();
    }
</script>

<ControlContainer>
    <ControlTitle title="Snare"/>
    <ASlider min="300" max="5000" step="1" title="filter freq" bind:value={$params.snare.frequency} func={uFrequency} />
    <ASlider min="0.001" max="1.0" step="0.001" title="attack" bind:value={$params.snare.attack} func={uAttack} />
    <ASlider min="0.001" max="1.0" step="0.001" title="decay" bind:value={$params.snare.decay} func={uDecay} />
    <ASlider min="0.001" max="1.0" step="0.001" title="sustain" bind:value={$params.snare.sustain} func={uSustain} />
    <ASlider min="0.001" max="1.0" step="0.001" title="release" bind:value={$params.snare.release} func={uRelease} />    
    <ASlider min="30" max="15000" step="1" title="membrane frequency" bind:value={$params.snare.membraneFreq} func={uMembraneFreq} />
    <ASlider min="1" max="50" step="1" title="waveshaping" bind:value={$params.snare.order} func={uOrder} />
    <Presets bind:data={$params} key={'snare'} />
</ControlContainer>