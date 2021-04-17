<svelte:window on:mousemove={moveHandler} on:mouseup={upHandler} />

<div class="knob-control" style="{style}" bind:this={knob} on:mousedown|preventDefault={downHandler}>
    <svg width="{computedSize}" height="{computedSize}" viewBox="0 0 120 120">
        <text
        x="60"
        y="20"
        text-anchor="middle"
        fill="{textColor}"
        class="knob-control__text-display"
        >
        {title}
    </text>
    <path
    d="{rangePath}"
    stroke-width="{strokeWidth}"
    stroke="{secondaryColor}"
    class="knob-control__range">
</path>
<path
d="{valuePath}"
stroke-width="{strokeWidth}"
stroke={primaryColor}
bind:this={pathValue}
data-dash="{length}"
style="{dashStyle}"
class="knob-control__value">
</path>

<path
d={pointerPath}
stroke-width=2
stroke={secondaryColor}
>
</path>

{#if showValue}
<text
x={MID_X}
y={MID_Y+50}
text-anchor="middle"
fill="{textColor}"
class="knob-control__text-display"
>
{value}
</text>
{/if}
</svg>
</div>


<script>
    import { onMount } from 'svelte';
    const clip = (i, low, high) => {
        return Math.min(Math.max(i, low), high)
    }
    
    const RADIUS = 25;
    const MID_X = 60;
    const MID_Y = 60;
    const MIN_RADIANS = 4 * Math.PI / 3;
    const MAX_RADIANS = -Math.PI / 3;
    
    let pathValue;
    let knob;
    
    let length = 0;
    let interval = null;
    
    export let title = "";
    
    export let animation = {
        animated: false,
        animateValue: false,
        animationDuration: 10,
        animationFunction: 'ease-in-out',
    }
    
    export let value;
    export let max = 100;
    export let min = 0;
    export let showValue = true;
    
    export let enabled = true;
    export let step = 1;
    export let size = 100;
    export let responsive = false;
    export let secondaryColor = '#989898';
    export let strokeWidth = 2;

    $: primaryColor = enabled ? '#59a245' : '#989898';
    $: textColor = enabled ? '#000000' : '#989898';
    
    export let func = () => {};
    
    onMount(() => {
        dashLength();
        clearInterval(interval);
        interval = null;
    });
    
    $: dashStyle = {
        strokeDasharray: length,
        strokeDashoffset: length
    }
    
    $: style = 'height:' + (responsive ? size + '%' : size - 5 + 'px');
    $: computedSize = responsive ? size + '%' : size
    $: rangePath = `M ${minX} ${minY} A ${RADIUS} ${RADIUS} 0 1 1 ${maxX} ${maxY}`;
    $: valuePath = `M ${zeroX} ${zeroY} A ${RADIUS} ${RADIUS} 0 ${largeArc} ${sweep} ${valueX} ${valueY}`;
    $: pointerPath = `M ${MID_X} ${MID_Y} L ${valueX} ${valueY}`;
    $: zeroRadians = (min > 0 && max > 0) ?mapRange(min, min, max, MIN_RADIANS, MAX_RADIANS):mapRange(0, min, max, MIN_RADIANS, MAX_RADIANS);
    $: valueRadians = mapRange(value, min, max, MIN_RADIANS, MAX_RADIANS);
    $: minX = MID_X + Math.cos(MIN_RADIANS) * RADIUS;
    $: minY = MID_Y - Math.sin(MIN_RADIANS) * RADIUS;
    $: maxX = MID_X + Math.cos(MAX_RADIANS) * RADIUS;
    $: maxY = MID_Y - Math.sin(MAX_RADIANS) * RADIUS;
    $: zeroX = MID_X + Math.cos(zeroRadians) * RADIUS;
    $: zeroY =MID_Y - Math.sin(zeroRadians) * RADIUS;
    $: valueX =MID_X + Math.cos(valueRadians) * RADIUS;
    $: valueY = MID_Y - Math.sin(valueRadians) * RADIUS;
    $: largeArc = Math.abs(zeroRadians - valueRadians) < Math.PI ? 0 : 1;
    $: sweep = valueRadians > zeroRadians ? 0 : 1;
    
    export let scale = 1.0;
    let internal = value;
    let pv = null;
    const updatePosition = (change) => {
        internal += change * scale;
        internal = clip(internal, min, max);
        value = internal
        value = Math.round((value - min) / step) * step + min;
        if (pv !== value)
            func()
        pv = internal
    }
    
    let anchor = null;
    let down = false;
    const moveHandler = (e) => {
        if (enabled) {
            if (anchor != null && down === true) {
                updatePosition(e.movementY * -1)
            }
        }
    };
    
    const downHandler = (e) => {
        if (enabled) {
            down=true;
            primaryColor = '#008500';
            anchor = e.screenY;
        }
    }
    
    const upHandler = (e) => {
        if (enabled) {
            down=false;
            primaryColor = '#00c300';
        }
    }
    
    function dashLength() {
        let element = pathValue;
        let length = element.getTotalLength()
        if (animation.animated) {
            element.style.animationDuration = (animation.animationDuration / 1000) + 's'
            element.style.animationFunction = animation.animationFunction
        }
        element.dataset.dash = length
        length = length
    };
    
    function mapRange(x, inMin, inMax, outMin, outMax)  {
        return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    };
</script>

<style>
    @keyframes dash-frame {
        100% {
            stroke-dashoffset: 0;
        }
    }
    
    .knob-control__range {
        fill: none;
        transition: stroke .1s ease-in;
    }
    
    .knob-control__value {
        animation-name: dash-frame;
        animation-fill-mode: forwards;
        fill: none;
    }
    
    .knob-control__text-display {
        /* font-family: 'VT323', monospace; */
    	/* font-family: 'Major Mono Display', monospace; */
        font-family: 'Courier Prime', monospace;
        font-size: 1rem;
        text-align: center;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style>


