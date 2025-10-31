<div
    class="viewport"
    {hidden}
    on:scroll={use_compat ? debounce(handle_scroll, 35) : handle_scroll}
    bind:this={viewport}
    on:touchstart={window._useragent.ios ? () => (touch_down = true) : () => {}}
    on:touchend={window._useragent.ios ? () => (touch_down = false) : () => {}}
>
    {#each current_pgs as pg (pg.num)}
        {#if pg.contents}
            <div class="page" id="pg-{pg.num}">
                <div>{@html pg.contents}</div>
            </div>
        {/if}
    {/each}
</div>

<script>
import {onMount, tick} from 'svelte'
import {debounce} from 'components/src/util.js'

export let count
export let get_page_contents
export let hidden = false
export let start = 1

const use_compat = !CSS.supports('overflow-anchor: none')
let touch_down = false // Loading pages while touch_down causes too much jumping as pages load from above

const page_heights_map = new WeakMap()
let current_pgs = []
let last_scroll = 0
let viewport
let loading_pages = 0

async function set_page_contents(pg) {
    loading_pages++
    const contents = await get_page_contents(pg.num)
    if (!viewport)
        // destroyed
        return

    // If we're at the very top and we want to add results before, scroll down first
    // to avoid jump, as overflow-anchor only works if not at top.
    // use_compat doesn't need this since as no overflow-anchor, so we compensate below
    // Theoretically, we could be going down, not up, but that's unlikely, and even so no harm
    if (!use_compat && viewport.scrollTop === 0) viewport.scrollTop += 5

    pg.contents = contents
    current_pgs = current_pgs
    // Not enough results to cause overflow, which means no more pages can load
    // This should only occur by go_to_page to the end; never when scrolling
    if (!loading_pages && viewport.scrollHeight === viewport.offsetHeight)
        add_results(viewport, false)

    if (use_compat && current_pgs.indexOf(pg) === 0) {
        await tick()
        viewport.scrollTop += viewport.children[0].offsetHeight
        await new Promise(r => setTimeout(r, 500))
    }
    loading_pages--
}

function add_results(el, going_down) {
    const ln = current_pgs.length
    if (!ln || loading_pages > 30)
        // !ln is during go_to_page; `loading_pages > 30` is a safety measure
        return
    if (going_down) {
        const last_num = current_pgs.at(-1).num
        if (
            last_num < count &&
            Math.ceil(el.scrollTop + el.offsetHeight + 1500) > el.scrollHeight
        ) {
            current_pgs = [...current_pgs, {num: last_num + 1}]
            set_page_contents(current_pgs.at(-1))
        }
    } else {
        if (use_compat && loading_pages) return
        // `el.scrollTop < 1500` can be false if the current page is very tall
        if (current_pgs[0].num > 1 && (el.scrollTop < 1500 || start - current_pgs[0].num < 2)) {
            current_pgs = [{num: current_pgs[0].num - 1}, ...current_pgs]
            set_page_contents(current_pgs[0])
        }
    }
    if (ln > 500)
        // ↓: slice(10, ln); ↑: slice(0, ln - 10)
        current_pgs = current_pgs.slice(going_down ? 10 : 0, going_down ? ln : ln - 10)
}

export async function go_to_page(page_no) {
    const length = page_no + 5 > count ? count + 1 - page_no : 5
    current_pgs = []
    /*
     * The add_results() below shifts the scrollbar in a way that affects *future* go_to_page
     * Instead of the 100ms timeout, I tried `await tick()` and `overflow = hidden`, but neither helped.
     */
    await new Promise(r => setTimeout(r, 200))
    current_pgs = Array.from({length}, (_, i) => ({num: i + page_no}))
    // Don't preload until all pages have been loaded (reduces jumping)
    await Promise.all(current_pgs.map(pg => set_page_contents(pg)))
    setTimeout(async () => {
        if (!viewport) return // destroyed
        const pg_el = viewport.querySelector('#pg-' + page_no)
        pg_el.scrollIntoView()
        viewport.scrollTop += 2
        await new Promise(r => setTimeout(r, 100))
        add_results(viewport, false)
        if (use_compat && viewport) pg_el.scrollIntoView()
    }, 500)
}
export function refresh_pages() {
    // TODO: might be better to first refresh pages in viewport.
    // Only makes a difference when many pages are loaded
    current_pgs.forEach(pg => {
        set_page_contents(pg)
    })
}

function handle_scroll() {
    if (!current_pgs.length || touch_down) return // No current_pgs during go_to_page
    let s = viewport.scrollTop

    add_results(viewport, s > last_scroll)
    last_scroll = s

    let i = 0
    while (s > 0) {
        const el = viewport.children[i]
        let h = page_heights_map.get(el)
        if (!h) {
            h = el.offsetHeight
            page_heights_map.set(el, h)
        }
        s -= h
        i++
    }
    // offset + # of pages. `- 1` to not count first page twice.
    // 0 is rare, but when at start of book, and not one px of first page is scrolled over
    start = current_pgs[0].num + i - 1 || 1
}
onMount(() => {
    go_to_page(start)
})
</script>

<style>
.viewport {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: calc(100vh - var(--top-offset));
}
</style>
