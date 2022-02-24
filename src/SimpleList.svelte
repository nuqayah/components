<div class=viewport style="--font-size: {font_size}">
  <div bind:this={contents}>
    {#each Array(count) as _, index (index)}
      {@const cmp = get_component(index)}
      <div class=page>
        <svelte:component this={cmp.component} {...cmp.props}/>
      </div>
    {/each}
  </div>
</div>

<script>
export let get_component
export let count
export let font_size
export let start = 0

let contents

export function go_to_page(page_no) {
    setTimeout(() => {
        contents.children[page_no - 1].scrollIntoView()
    }, 100)
}
export function refresh_pages() {
    get_component = get_component // count = count doesn't work
}

const el_index = el => [...el.parentElement.children].indexOf(el)
const observer = new IntersectionObserver(handle_intersection, {threshold: 0.5})
function handle_intersection(entries) {
    let picked = false
    entries.forEach(entry => {
        if (!picked && entry.isIntersecting) {
            picked = true
            start = el_index(entry.target)
        }
    })
}
function observe(el) {
    [...el.children].forEach(el => { observer.observe(el) })
}

$: if (count && contents) observe(contents)
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
  font-size: calc(0.0525rem * var(--font-size));
  border-bottom: 1px solid #aaa;
  overflow-x: auto;
}
</style>
