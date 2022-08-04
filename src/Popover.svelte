<slot name=button {show}/>

{#if shown}
  <div class="absolute z-10" transition:fly|local={{duration: 150, y: 10}} bind:this={wrapper}>
    <slot/>
  </div>
{/if}

<svelte:window on:resize={position_cont} on:mousedown={hide_cont}/>

<script>
import positioner from 'positioner'

let wrapper
let shown = false

function position_cont() {
   if (shown && wrapper)
      positioner(wrapper, wrapper.previousElementSibling.getBoundingClientRect(), 'bottom')
}
async function show() {
    if (shown)
        return
    shown = true
    await tick()
    position_cont()
}
function hide_cont(e) {
    if (shown && wrapper && !wrapper.contains(e.target))
        // The delay causes show to run first
        setTimeout(() => shown = false, 100)
}
</script>
