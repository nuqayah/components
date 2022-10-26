<slot name=button {show}/>

{#if shown}
  <div class="absolute z-10" transition:fly|local={{duration: 150, y: 10}} bind:this={wrapper}>
    <slot/>
  </div>
{/if}

<svelte:window on:resize={position_cont} on:mousedown={e => setTimeout(() => hide_cont(e), 5)}/>

<script>
import positioner from 'positioner'

export let hide_on_click = true

let wrapper
let shown = false

function position_cont() {
   if (shown && wrapper)
      positioner(wrapper, wrapper.previousElementSibling.getBoundingClientRect(), 'bottom')
}
async function show(e) {
    if (shown) {
        if (!e.screenX)
            shown = false // Only hide if kbd click; hide_cont takes care of mouse click.
        return
    }
    shown = true
    await tick()
    position_cont()
}
function hide_cont(e) {
    if (!e.screenX) // Vimium triggers mousedown
        return
    const el = e.target
    // if clicked inside: only hide if hide_on_click is true and the el we clicked on isn't an input
    if (shown && wrapper && (!wrapper.contains(el) || (hide_on_click && el.tagName !== 'INPUT')))
        // Delay so that show runs first
        setTimeout(() => shown = false, 120)
}
</script>
