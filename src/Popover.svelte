{@render button?.({ show, })}

{#if shown}
    <div
        class={append_to_body ? 'fixed z-10' : 'absolute z-10'}
        transition:fly|local={{duration: 150, y: 10}}
        bind:this={wrapper}
    >
        {@render children?.()}
    </div>
{/if}

<!-- iOS rarely fires window.mouseup, so we need to use document -->
<svelte:document onmouseup={e => setTimeout(() => hide_cont(e), 5)} />

<script>
import {autoUpdate, computePosition, flip, offset, shift} from '@floating-ui/dom'
import {onDestroy, tick} from 'svelte'
import {fly} from 'svelte/transition'

/**
 * @typedef {Object} PopoverProps
 * @property {boolean} [hide_on_click]
 * @property {boolean} [append_to_body]
 * @property {boolean} [shown] - rarely needed but useful for debugging
 * @property {import('svelte').Snippet<[any]>} [button]
 * @property {import('svelte').Snippet} [children]
 */

/** @type {PopoverProps} */
let {
    hide_on_click = true,
    append_to_body = false,
    shown = $bindable(false),
    button,
    children
} = $props()

let wrapper = $state()
let show_el = null
let cleanup_position = null

function close() {
    shown = false
    cleanup_position?.()
    cleanup_position = null
}

async function position_cont() {
    if (!shown || !wrapper) return

    const {x, y} = await computePosition(show_el, wrapper, {
        placement: 'bottom',
        strategy: append_to_body ? 'fixed' : 'absolute',
        middleware: [offset(10), flip(), shift()],
    })

    Object.assign(wrapper.style, {
        left: `${x}px`,
        top: `${y}px`,
    })
}

async function show(e) {
    show_el = e.currentTarget
    // For mobile, as this runs first, hide_cont will hide
    await new Promise(r => setTimeout(r, 50))
    if (shown) {
        if (!e.screenX) close() // Only hide if kbd click; hide_cont takes care of mouse click.
        return
    }
    shown = true
    await tick()
    if (append_to_body) document.body.appendChild(wrapper)
    cleanup_position = autoUpdate(show_el, wrapper, position_cont)
}
function hide_cont(e) {
    if (!e.screenX)
        // Vimium triggers mouseup
        return
    const el = e.target
    // if clicked inside: only hide if hide_on_click is true and the el we clicked on isn't an input
    if (shown && wrapper && (!wrapper.contains(el) || (hide_on_click && el.tagName !== 'INPUT')))
        // Delay so that show runs first. Note: mouseup and click run in
        // opposite order on mobile devices, so might not be needed by mobile
        setTimeout(close, show_el?.contains(el) ? 200 : 80)
}

onDestroy(() => {
    cleanup_position?.()
    // eslint-disable-next-line svelte/no-dom-manipulating
    if (append_to_body) wrapper?.remove()
})

$effect(() => {
    if (!shown) {
        cleanup_position?.()
        cleanup_position = null
    }
})
</script>
