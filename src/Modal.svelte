{#if modal_options.show}
<div class=modal-overlay tabindex=-1 data-close on:click={overlay_click} transition:fade={{duration: 180}} use:focus_trap>
  <div class=modal-container role=dialog aria-modal=true style="max-width: {modal_options.max_width}">
    <header>
      {#if title}<h2 class="text-lg font-bold">{title}</h2>{/if}
      <button data-close><icon id=close></button>
    </header>
    <main>
      <svelte:component this={modal_options.component} bind:title {...modal_options.props} on:close={e => update_modal({show: false})}/>
    </main>
  </div>
</div>
{/if}

<svelte:window on:popstate={popstate} on:keydown={e => { if (e.keyCode === 27) update_modal({show: false}) }}/>

<script context=module>
import {writable} from 'svelte/store'

export const options = writable({})

export function show(component, props) {
    options.set({component, props})
}
</script>
<script>
import {createFocusTrap} from 'focus-trap'
function focus_trap(node, options) {
    const trap = createFocusTrap(node, options)
    trap.activate()
    return {destroy() {trap.deactivate()}}
}

$: if (!$options.shown && Object.keys($options).length) update_modal($options)

function overlay_click(e) {
    if ('close' in e.target.dataset)
        update_modal({show: false})
}

function set_body_scroll(shown) {
    document.documentElement.classList.toggle('open-modal', shown)
}
$: set_body_scroll(modal_options.show)

let title
let modal_options_tpl = {show: false, props: {}, component: null, max_width: '580px'}
let modal_options = {...modal_options_tpl}
function update_modal(ops) {
    if ('component' in ops && !('show' in ops))
        ops.show = true // If the component is being set, with no `show`, set `show` to true
    modal_options = {...modal_options_tpl, ...ops}

    if (modal_options.show)
        history.pushState(null, null, '')
    $options.shown = true
}
function popstate() {
    if (modal_options.show)
        update_modal({show: false})
}
</script>

<style>
/* Non-iOS */
:global(html.open-modal body) {
  touch-action: none;
  overflow: hidden;
  height: 100vh;
}
/* iOS */
:global(html.open-modal) .modal-overlay {
  touch-action: none;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.modal-container {
  width: min(90vw, 580px);
  margin: 1rem auto 0.2rem;
  box-shadow: 0 3px 10px #555;
  background-color: var(--bg-color, #fff);
}
header {
  position: relative;
  background-color: var(--bg-color);
  border-radius: 3px 3px 0 0;
}
h2 {
  margin: 0;
  text-align: center;
}
main {
  padding: 0.5rem;
  background-color: var(--bg-color);
  max-height: 76vh;
  overflow-y: auto;
  border-radius: 0 0 3px 3px;
}
button[data-close] {
  position: absolute;
  top: -18px;
  right: -15px;
  z-index: 1;
  background: var(--bg-color, #fff);
  border-radius: 50%;
  border: 4px solid #666;
  padding: 0.25rem;
  line-height: 1;
}
.icon-close {
  width: 1.25rem;
  height: 1.25rem;
  vertical-align: sub;
}
</style>
