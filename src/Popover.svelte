<slot name=button {toggle}/>

{#if show}
  <div class="absolute z-10" transition:fly|local={{duration: 150, y: 10}} bind:this={wrapper}>
    <slot/>
  </div>
{/if}

<svelte:window on:resize={position_cont} on:mousedown={hide_cont}/>

<script>
import positioner from 'positioner'

let wrapper
let show = false

function position_cont() {
   if (show && wrapper)
      positioner(wrapper, wrapper.previousElementSibling.getBoundingClientRect(), 'bottom')
}
async function toggle() {
    show = !show

    if (show) {
        await tick()
        position_cont()
    }
}
function hide_cont(e) {
    if (show && wrapper && !wrapper.contains(e.target))
        setTimeout(() => show = false, 50)
}
</script>
