<slot name=button {show}/>

{#if shown}
  <div class="absolute z-10" transition:fly|local={{duration: 150, y: 10}} bind:this={wrapper}>
    <slot/>
  </div>
{/if}

<svelte:window on:resize={position_cont}/>
<!-- iOS rarely fires window.mouseup, so we need to use document -->
<svelte:document on:mouseup={e => setTimeout(() => hide_cont(e), 5)}/>

<script>
import {onDestroy, tick} from 'svelte'
import {fly} from 'svelte/transition'
import positioner from 'positioner'

export let hide_on_click = true
export let append_to_body = false
export let shown = false // rarely needed but useful for debugging

let wrapper
let show_el = null

function position_cont() {
   if (shown && wrapper)
      positioner(wrapper, wrapper.previousElementSibling.getBoundingClientRect(), 'bottom')
}
async function show(e) {
    show_el = e.target
    // For mobile, as this runs first, hide_cont will hide
    await new Promise(r => setTimeout(r, 50))
    if (shown) {
        if (!e.screenX)
            shown = false // Only hide if kbd click; hide_cont takes care of mouse click.
        return
    }
    shown = true
    await tick()
    position_cont()
    if (append_to_body)
        document.body.appendChild(wrapper)
}
function hide_cont(e) {
    if (!e.screenX) // Vimium triggers mouseup
        return
    const el = e.target
    // if clicked inside: only hide if hide_on_click is true and the el we clicked on isn't an input
    if (shown && wrapper && (!wrapper.contains(el) || (hide_on_click && el.tagName !== 'INPUT')))
        // Delay so that show runs first. Note: mouseup and click run in
        // opposite order on mobile devices, so might not be needed by mobile
        setTimeout(() => shown = false, e.target === show_el ? 200 : 80)
}

onDestroy(() => {
    if (append_to_body)
        wrapper?.remove()
})
</script>
