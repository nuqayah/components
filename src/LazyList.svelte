<ul bind:this={container} on:scroll={debounce(add_results, 5)} style="max-height: {max_height}">
  {#each visible as item (get_key ? get_key(item) : item)}
    <li class=row><slot {item}/></li>
  {:else}
    <li class=no-results>{no_results_msg}</li>
  {/each}
</ul>

<script>
import {tick, onMount} from 'svelte'
import {debounce} from 'components/src/util.js'

export let items
export let hidden = false
export let OFFSET = 200
export let PER_PAGE = 25
export let max_height = '50vh'
export let no_results_msg = 'لا نتائج'
export let get_key = null

let container
let visible = []

$: {
    // `visible.length` first to avoid resetting size if items change
    visible = items.slice(0, visible.length || PER_PAGE)
    if (!hidden && container)
        pad_results()
}

function add_results(e) {
    const el = e.target
    if (visible.length < items.length && Math.ceil(el.scrollTop + el.offsetHeight + OFFSET) > el.scrollHeight)
        visible = visible.concat(items.slice(visible.length, visible.length + PER_PAGE))
}
async function pad_results() {
    await tick()
    // If the current items don't overflow then add until they do
    if (!container.clientHeight)
        return
    while (visible.length < items.length && container.scrollHeight <= container.clientHeight + 100) {
        await tick()
        visible = visible.concat(items.slice(visible.length, visible.length + 1))
    }
}

onMount(pad_results)
</script>

<style>
ul {
  overflow: auto;
}
.no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #999;
  margin: 2rem;
}
.row {
  border-bottom: 1px solid #eee;
}
</style>
