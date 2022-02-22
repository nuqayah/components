<slot name=button {toggle}/>

{#if show}
  <div class="absolute z-10" transition:fly|local={{duration: 150, y: 10}} bind:this={wrapper}>
    <slot/>
  </div>
{/if}

<svelte:window on:resize={() => position_cont(wrapper, wrapper.previousElementSibling)} on:mousedown={hide_cont}/>

<script>
import positioner from 'positioner'

let wrapper
let show = false

const position_cont = (el, attach_to) => { if (wrapper) positioner(el, attach_to.getBoundingClientRect(), 'bottom') }
async function toggle(e) {
    show = !show

    if (show) {
        await tick()
        position_cont(wrapper, e.target)
    }
    else
        hide_cont()
}
function hide_cont(e) {
    if (e && wrapper && !wrapper.contains(e.target))
        setTimeout(() => show = false, 50)
}
</script>
