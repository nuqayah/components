<div class=split-container style="--dir: {dir === 'rtl' ? 'right' : 'left'}" bind:this={container} bind:clientWidth={w} bind:clientHeight={h}>
  <div class=pane style="{dimension}: {pos}%">
    <slot name=a />
  </div>

  <div class=pane style="{dimension}: {100 - (pos)}%">
    <slot name=b />
  </div>

  {#if !fixed && !hide_b}
    <div class="{type} divider" style="{side}: calc({pos}% - 8px)" use:drag={setPos} use:touchDrag={setTouchPos}></div>
  {/if}
</div>

{#if dragging}
  <div class=mousecatcher></div>
{/if}

<script>
import {onMount} from 'svelte'
import {on, off, int_clamp} from 'components/src/util.js'

export let type
export let pos = 50
export let fixed = false
export let buffer = 42
export let min
export let max
export let dir
export let hide_b = false

let container
let w
let h
$: size = type === 'vertical' ? h : w

$: min = 100 * (buffer / size)
$: max = 100 - min
$: pos = hide_b ? 100 : int_clamp(pos, min, max)
onMount(() => {
    if (!hide_b && w < 1000)
        pos = 65
})

let dragging = false
let rtl = document.dir == 'rtl'

function setPos(event) {
    const { top, left, right } = container.getBoundingClientRect()

    const px = type === 'vertical'
        ? (event.clientY - top)
        : rtl
            ? right - event.clientX
            : event.clientX - left

    pos = 100 * px / size
    dispatch('change')
}

function setTouchPos(event) {
    const { top, left } = container.getBoundingClientRect()

    const px = type === 'vertical'
        ? (event.touches[0].clientY - top)
        : (event.touches[0].clientX - left)

    pos = 100 * px / size
    dispatch('change')
}

function drag(node, callback) {
    const mousedown = event => {
        if (event.which !== 1) return

        event.preventDefault()

        dragging = true

        const onmouseup = () => {
            dragging = false

            off(window, 'mousemove', callback)
            off(window, 'mouseup', onmouseup)
        }

        on(window, 'mousemove', callback)
        on(window, 'mouseup', onmouseup)
    }

    on(node, 'mousedown', mousedown)

    return {
        destroy() {
            off(node, 'mousedown', mousedown)
        }
    }
}

function touchDrag(node, callback) {
    const touchdown = event => {
        if (event.targetTouches.length > 1) return

        event.preventDefault()

        dragging = true

        const ontouchend = () => {
            dragging = false

            off(window, 'touchmove', callback)
            off(window, 'touchend', ontouchend)
        }

        on(window, 'touchmove', callback)
        on(window, 'touchend', ontouchend)
    }

    on(node, 'touchstart', touchdown)

    return {
        destroy() {
            off(node, 'touchstart', touchdown)
        },
    }
}

$: side = type === 'horizontal' ? (rtl ? 'right' : 'left') : 'top'
$: dimension = type === 'horizontal' ? 'width' : 'height'
</script>

<style>
.split-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.pane {
  position: relative;
  float: var(--dir);
  width: 100%;
  height: 100%;
  overflow: auto;
}
.mousecatcher {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,.01);
}
.divider {
  position: absolute;
  z-index: 1;
  display: none;
}
.divider::after {
  content: '';
  position: absolute;
  background-color: #777;
}
.horizontal {
  padding: 0 8px;
  width: 0;
  height: 100%;
  cursor: ew-resize;
}
.horizontal::after {
  left: 8px;
  top: 0;
  width: 1px;
  height: 100%;
}
.vertical {
  padding: 8px 0;
  width: 100%;
  height: 0;
  cursor: ns-resize;
}
.vertical::after {
  top: 8px;
  left: 0;
  width: 100%;
  height: 1px;
}
.left, .right, .divider {
  display: block;
}
.left, .right {
  height: 100%;
  float: left;
}
.top, .bottom {
  position: absolute;
  width: 100%;
}
.top { top: 0; }
.bottom { bottom: 0; }
</style>
