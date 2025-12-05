<div class=viewport bind:this={viewport} onscroll={handle_scroll} style="--font-size: {font_size}; --min-height: {min_height}px">
  <div bind:this={contents} style="padding-top: {top}px; padding-bottom: {bottom}px;">
    {#each visible as index (index)}
      {@const cmp = get_component(index)}
      <div class=page in:slide>
        <cmp.component {...cmp.props}/>
      </div>
    {/each}
  </div>
</div>

<script>
  import { run } from 'svelte/legacy';

import {onMount, tick} from 'svelte'
import {slide} from 'svelte/transition'

  /** @type {{get_component: any, count: any, font_size: any, start?: number, min_height?: number}} */
  let {
    get_component,
    count,
    font_size,
    start = $bindable(0),
    min_height = 101
  } = $props();
let end = $state(0)
let top = $state(0)
let bottom = $state(0)
let NO_VIRTUALIZE_LIMIT = 50

let viewport = $state()
let contents = $state()

export function go_to_page(page_no) {
    if (count < NO_VIRTUALIZE_LIMIT) {
        setTimeout(() => {
            contents.children[page_no].scrollIntoView()
        }, 200)
        return
    }
    // This makes going to a page a bit more robust, especially on first load.
    setTimeout(() => {
        if (!viewport) // Likely destroyed
            return
        if (viewport.scrollTop === 0 && page_no === 1) // viewport.scrollTop will be 0, so fire manually
            handle_scroll()
        else {
            viewport.scrollTop = min_height * (page_no - 1)
            setTimeout(() => {
                if (viewport)
                    viewport.scrollTop = min_height * (page_no - 1)
            }, 50)
        }
    }, 0)
}
export async function reset_pages() {
    if (count < NO_VIRTUALIZE_LIMIT) return
    viewport.scrollTop = 0
    visible = []
    await tick()
    handle_scroll()
}
export async function refresh_pages() {
    visible = visible
}
function get_page_el(i) {
    if (i >= start && i <= end)
        return contents.children[i - start]
}

let visible;
  run(() => {
    visible = Array(count < NO_VIRTUALIZE_LIMIT ? (count) : end - start).fill().map((_, i) => i + start)
  });
run(() => {
    console.log(visible)
  });

function handle_scroll() {
    if (count < NO_VIRTUALIZE_LIMIT || !viewport) return;
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
        if (acclHeight + height > scrollTop)
            break
        acclHeight += height
        item++
    }
    if (start !== item) {
        if (item < start) {
            /*
             * We're going up, and adding an item to the top. Reduce top
             * padding so that the height difference doesn't cause a jump.
             */
        }
        else {
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
</style>
