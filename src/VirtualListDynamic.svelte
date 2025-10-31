<div
    class="viewport"
    bind:this={viewport}
    on:scroll={handle_scroll}
    style="--font-size: {font_size}; --min-height: {min_height}px"
>
    <div bind:this={contents} style="padding-top: {top}px; padding-bottom: {bottom}px;">
        {#each visible as index (index)}
            {@const cmp = get_component(index)}
            <div class="page" in:slide>
                <svelte:component this={cmp.component} {...cmp.props} />
            </div>
        {/each}
    </div>
</div>

<script>
import {onMount, tick} from 'svelte'
import {slide} from 'svelte/transition'
import {debounce, median} from 'components/src/util.js'

export let get_component
export let count
export let font_size
export let start = 0

export let min_height = 101
let end = 0
let top = 0
let bottom = 0
let height_map = {}

let go_to_page_first = -1 // Needed when going to end of deck I think
let viewport
let contents

const recalc_min_height = debounce(async () => {
    if (!viewport) return
    let old_start = start // Likely unneeded, but might be
    let new_min_height = median(Object.values(height_map))
    if (Math.abs(min_height - new_min_height) > 20) {
        min_height = new_min_height
        top = start * min_height
        await tick()
        viewport.scrollTop = min_height * (go_to_page_first || old_start)
        go_to_page_first = null
    }
}, 100)

export function go_to_page(page_no) {
    if (go_to_page_first === -1) go_to_page_first = page_no - 1
    // This makes going to a page a bit more robust, especially on first load.
    setTimeout(() => {
        if (!viewport)
            // Likely destroyed
            return
        if (viewport.scrollTop === 0 && page_no === 1)
            // viewport.scrollTop will be 0, so fire manually
            handle_scroll()
        else {
            viewport.scrollTop = min_height * (page_no - 1)
            setTimeout(async () => {
                if (!viewport) return
                viewport.scrollTop = min_height * (page_no - 1)
                await tick()
                get_page_el(page_no - 1)?.classList?.add('color-bg')
            }, 50)
        }
    }, 0)
}
export async function reset_pages() {
    viewport.scrollTop = 0
    visible = []
    await tick()
    handle_scroll()
}
export async function refresh_pages() {
    visible = visible
}
function get_page_el(i) {
    if (i >= start && i <= end) return contents.children[i - start]
}

$: visible = Array(end - start)
    .fill()
    .map((_, i) => i + start)

function handle_scroll() {
    if (!viewport) return
    const {scrollTop, offsetHeight} = viewport

    let item = 0
    let acclHeight = 0

    // Set start item and top padding
    while (item < count) {
        /*
         * The difference between the rendered height and `min_height` affects
         * `start`. It will declare that an item currently rendered shouldn't
         * be rendered, since its `min_height` is less.
         * The fix: if `item` is a rendered item, then consider its height.
         */
        const page_el = get_page_el(item)
        const height = page_el ? page_el.offsetHeight : min_height
        if (acclHeight + height > scrollTop) break
        acclHeight += height
        item++
    }
    if (start !== item) {
        if (item < start) {
            /*
             * We're going up, and adding an item to the top. Reduce top
             * padding so that the height difference doesn't cause a jump.
             */
        } else {
            /*
             * We're removing an item from the top. Reduce the scroll and the padding
             * so that we don't jump up when removing the item, due to its
             * extra height.
             */
            const page_el = get_page_el(start)
            if (page_el) {
                const diff = page_el.offsetHeight - min_height
                acclHeight -= diff
                viewport.scrollTop -= diff
            }
        }
        top = acclHeight
        start = item
    }

    // Get end
    while (item < count && acclHeight <= scrollTop + offsetHeight) {
        const height = get_page_el(item) ? get_page_el(item).offsetHeight : min_height
        acclHeight += height
        item++
    }
    // Force reactivity (search results of length 8 weren't showing)
    end = -1
    // Add an extra page to the end. This avoids a bug where a page sometimes disappears.
    end = Math.min(item + 1, count)
    bottom = min_height * (count - end)
    tick().then(() => {
        visible.forEach(i => {
            if (!height_map[i] && get_page_el(i)?.scrollHeight)
                height_map[i] = get_page_el(i).scrollHeight
        })
        recalc_min_height()
    })
}
onMount(handle_scroll)
</script>

<style>
.viewport {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: 100%;
}
.viewport::-webkit-scrollbar {
    width: 0;
}
.page {
    min-height: calc(var(--min-height) - 1px);
    font-size: calc(0.0525rem * var(--font-size));
    border-bottom: 1px solid #aaa;
    overflow-x: auto;
}
.viewport :global(.color-bg) {
    background: #fffef6;
}
</style>
