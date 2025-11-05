<div
    class="viewport"
    style="--item-height: {item_height}px"
    bind:this={viewport}
    onscroll={handle_scroll}
>
    <div style="padding-top: {top}px; padding-bottom: {bottom}px;">
        {#each visible as row_index (row_index)}
            <div class="row"><slot index={row_index} /></div>
        {:else}
            {#if show_no_results}
                <div class="no-results">{results_message}</div>
            {/if}
        {/each}
    </div>
</div>

<svelte:window on:resize={debounce(handle_scroll, 100)} />

<script>
import {onMount} from 'svelte'
import {debounce} from './util.js'

let {
    count,
    item_height,
    on_first_changed = undefined,
    hidden = false,
    show_no_results = true,
    results_message = 'لا نتائج',
} = $props()

let viewport
let start = $state(0)
let end = $state(0)
let top = $state(0)
let bottom = $state(0)

let visible = $derived(
    Array(end - start)
        .fill(null)
        .map((_, i) => i + start),
)

$effect(() => {
    if (viewport) {
        if (count) {
            viewport.scrollTop = 0
            setTimeout(handle_scroll, 15)
        } else {
            handle_scroll()
        }
    }
})

$effect(() => {
    if (!hidden) setTimeout(handle_scroll, 20)
})

function handle_scroll() {
    if (!viewport) return
    const {scrollTop, offsetHeight} = viewport

    let item = 0
    let accl_height = 0

    // Set start item and top padding
    while (item < count && accl_height + item_height <= scrollTop) {
        accl_height += item_height
        item++
    }
    if (on_first_changed && start !== item) on_first_changed(item)
    start = item
    top = accl_height

    // Get end
    while (item < count && accl_height <= scrollTop + offsetHeight) {
        accl_height += item_height
        item++
    }
    end = item
    bottom = item_height * (count - end)
}

onMount(handle_scroll)
</script>

<style>
.viewport {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
.row {
    height: var(--item-height);
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.row:not(:last-child) {
    border-bottom: 1px solid #eee;
}
.no-results {
    text-align: center;
    font-size: 2rem;
    color: #999;
    margin: 2rem;
}
</style>
