<nav class="flex" on:click={tab_bar_click} bind:this={tab_bar_cont}>
  <slot name=buttons/>
</nav>

<section class=tabs-cont bind:this={tabs_cont}>
  <slot/>
</section>

<script>
export let current_tab = 1

let tabs_cont
let tab_bar_cont
let CHANGING_TAB = false

function tab_bar_click(e) {
    const btn = e.target.closest('button.tab-btn')
    if (!btn || btn.classList.contains('active') || CHANGING_TAB)
        return
    change_tab(btn)
}
function change_tab(btn) {
    CHANGING_TAB = true
    tab_bar_cont.querySelector('button.active').classList.remove('active')
    btn.classList.add('active')

    const i = [...tab_bar_cont.querySelectorAll('.tab-btn')].indexOf(btn)
    const cur_tab = tabs_cont.querySelector('section.active')
    cur_tab.style.opacity = 0
    cur_tab.addEventListener('transitionend', () => {
        cur_tab.classList.remove('active')
        tabs_cont.scrollTop = 0

        const new_tab = tabs_cont.querySelector(`section:nth-child(${i+1})`)
        new_tab.classList.add('active')
        new_tab.style.opacity = 0
        // Pause between the opacity change so it gets transitioned
        setTimeout(() => {
            new_tab.style.opacity = 1
            current_tab = i + 1
            new_tab.addEventListener('transitionend', () => { CHANGING_TAB = false }, {once: true})
        }, 50)
    }, {once: true})
}
export function set_tab(tab_num) {
    const btn = [...tab_bar_cont.children][tab_num - 1]
    if (btn.classList.contains('active') || CHANGING_TAB)
        return
    change_tab(btn)
}

onMount(() => {
    tab_bar_cont.querySelector(`button.tab-btn:nth-child(${current_tab})`).classList.add('active')
    tabs_cont.querySelector(`:scope > section:nth-child(${current_tab})`).classList.add('active')
})
</script>

<style>
.tabs-cont {
  flex: 1;
  overflow-y: auto;
  display: flex;
}
.tabs-cont > :global(section) {
  padding: 0.3rem;
  transition: opacity 0.3s;
  width: 100%;
}
.tabs-cont > :global(section:not(.active)) {
  display: none !important;
}
</style>
