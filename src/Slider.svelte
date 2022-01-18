<simple-slider class=block>
  <section class=wrapper use:observe bind:this={wrapper}>
    <slot/>
  </section>
  <ul class=crumbs on:click={crumbs_clicked} bind:this={crumbs}>
    {#each Array(count) as _, i}<li/>{/each}
  </ul>
</simple-slider>

<script>
const el_index = el => [...el.parentElement.children].indexOf(el)

export let count
let crumbs
let wrapper

if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
    const src = 'https://cdn.jsdelivr.net/npm/seamless-scroll-polyfill@0.5.3/dist/seamless.browser.min.js'
    document.head.append(Object.assign(document.createElement('script'), {src: src}))
}
const observer = new IntersectionObserver(handle_intersection, {threshold: 0.5})
function handle_intersection(entries) {
    entries.forEach(entry => {
        const crumb = crumbs.children[el_index(entry.target)]
        crumb.classList.toggle('active', entry.isIntersecting)
    })
}
function observe(el) {
    [...el.children].forEach(el => { observer.observe(el) })
}
function crumbs_clicked(e) {
    if (e.target === e.currentTarget)
        return
    wrapper.children[el_index(e.target)].scrollIntoView({behavior: 'smooth', block: 'nearest'})
}
onDestroy(() => {
    observer.disconnect()
});
</script>

<style>
section {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
}
section > :global(article) {
  flex: 1;
  min-width: 100%;
  padding: 1rem;

  scroll-snap-align: start;
  scroll-snap-stop: always;
}
ul.crumbs {
  margin: 0.5rem;
  padding: 0;
  text-align: center;
}
.crumbs li {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin: 0 8px;
  background: #333;
  border-radius: 50%;
  opacity: 0.25;
  cursor: pointer;
  transition: opacity 350ms;
}
.crumbs :global(li.active) {
  opacity: 1;
}
</style>
