<div on:mouseover={() => { should_hide = false }} on:focus={() => { should_hide = false }} on:mouseleave={hide_wrapped} bind:this={inner}>
<div hidden={!$options.show} role=tooltip class="tooltip tooltip-{$options.direction} slide-up-fade-in" use:reposition={$options}>
  <div class=tip-arrow />
  <div class=tooltip-inner>
    {#if $options.ok_btn}
      <button class=ok on:click={() => $options.show = false}>✔</button>
    {/if}
  </div>
</div>
</div>

<svelte:window on:resize={debounce(() => {$options = $options}, 12)} on:mousedown={hide_on_click}/>

<script context=module>
import {writable, get} from 'svelte/store'
export const options = writable({direction: 'top'})

let inner
function show(props, el) {
    function get_msg() {
        let msg = ''
        /*
         * If a message isn't passed in, first see if the element as a title attribute.
         * Second, see if the following element is <template>.
         */
        if (el.getAttribute('title') || el.dataset.title) {
            msg = el.getAttribute('title') || el.dataset.title
            el.removeAttribute('title')
            el.dataset.title = msg
        }
        else if (el.nextElementSibling?.tagName === 'TEMPLATE')
            msg = el.nextElementSibling.innerHTML
        else
            msg = el.nextElementSibling
        return msg
    }
    const defaults = {show: true, direction: 'top', attach_to: el, ok_btn: false}
    return () => {
        should_hide = false
        options.set({...defaults, ...props})
        tick().then(() => {
          const el = get_msg()
          if (el.hidden)
              inner.querySelector('.tooltip-inner').appendChild(el)
          el.hidden = false
        })
    }
}
function hide_on_click(e) {
    // Make sure we aren't clicking within the tooltip
    if (!e.target.closest('.tooltip')) // TODO: unsure if robust
        options.set({show: false})
}
const hide = debounce(() => {
    if (should_hide)
        options.set({show: false})
}, 100)
let should_hide = true
// Wrap `hide` so that we don't hide when mouseleaving to tooltip
function hide_wrapped(e) {
    if (get(options).type === 'hover') {
        should_hide = true
        hide()
    }
}
export function hover_action(el, props) {
    const cb = show({...props, type: 'hover'}, el)
    el.addEventListener('mouseover', cb)
    // hide_wrapped -> hide, but if we moused over the tooltip, then
    // should_hide was sent to false before the debounce timer ends
    el.addEventListener('mouseleave', hide_wrapped)
    return {
        destroy() {
            el.removeEventListener('mouseover', cb)
            el.removeEventListener('mouseleave', hide_wrapped)
        },
    }
}
export function click_action(el, props) {
    const cb = show({...props, type: 'click'}, el)
    el.addEventListener('click', cb)
    return {
        destroy() {
            el.removeEventListener('click', cb)
        },
    }
}
</script>

<script>
import positioner from 'positioner'
import {debounce} from '~/util/util.js'

function reposition(el) {
    async function update() {
        if (!$options.show)
            return
        await tick()
        positioner(el, $options.attach_to.getBoundingClientRect(), $options.direction || 'top')
    }
    update()
    return {update}
}
</script>

<style>
.slide-up-fade-in {
  animation: slide-up-fade-in ease 150ms forwards;
}
@keyframes slide-up-fade-in {
  0% { opacity: 0; transform: translate(0, 1rem); }
  100% { opacity: 1; transform: translate(0, 0); }
}
.tooltip {
  --tip-color: #fbfbfb;
  position: absolute;
  z-index: 2;
  word-wrap: break-word;
  margin: 0;
  padding-bottom: 5px;
  transition: opacity .2s;
}
.tooltip .tip-arrow {
  position: absolute;
}
.tooltip .tip-arrow::before {
  position: absolute;
  content: '';
  border-color: transparent;
  border-style: solid;
}
.tooltip-inner {
  max-width: 300px;
  padding: .25rem .5rem;
  background-color: #000;
  box-shadow: 0 0 15px #c6c6c6;
  border-radius: .25rem;
  max-height: 200px;
  overflow: auto;
  font-size: 0.9rem;
  line-height: 1.6;
  color: white;
}

/* Placement */
/* Top & Bottom */
.tooltip-top, .tooltip-bottom {
  padding: 0.4rem 0;
}
.tooltip-top .tip-arrow, .tooltip-bottom .tip-arrow {
  width: 0.8rem;
  height: 0.4rem;
}
.tooltip-top .tip-arrow {
  bottom: 0;
}
.tooltip-top .tip-arrow::before {
  top: 0;
  border-width: 0.4rem 0.4rem 0;
  border-top-color: var(--tip-color);
}
.tooltip-bottom .tip-arrow {
  top: 0;
}
.tooltip-bottom .tip-arrow::before {
  bottom: 0;
  border-width: 0 0.4rem 0.4rem;
  border-bottom-color: var(--tip-color);
}
/* Right & left */
.tooltip-right, .tooltip-left {
  padding: 0 0.4rem;
}
.tooltip-right .tip-arrow, .tooltip-left .tip-arrow {
  width: 0.4rem;
  height: 0.8rem;
}
.tooltip-right .tip-arrow {
  left: 0;
}
.tooltip-right .tip-arrow::before {
  right: 0;
  border-width: 0.4rem 0.4rem 0.4rem 0;
  border-right-color: var(--tip-color);
}
.tooltip-left .tip-arrow {
  right: 0;
}
.tooltip-left .tip-arrow::before {
  left: 0;
  border-width: 0.4rem 0 0.4rem 0.4rem;
  border-left-color: var(--tip-color);
}
.tooltip-inner {
  color: #444;
  background: var(--tip-color);
  box-shadow: 0 0 10px #ccc;
}
button.ok {
  display: block;
  margin-left: auto;
  padding: 0.75rem 0.5rem 0.5rem;
  box-shadow: 0 0 2px #aaa;
  border-radius: 1rem;
  background: #fff3db;
  border: 1px solid peachpuff;
  line-height: 1;
}
</style>
