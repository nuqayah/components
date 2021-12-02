<button class=btn on:click={toggle_menu}><icon id=people></button>
<div class=dropdown-menu bind:this={menu} on:focusout={focusout} hidden>
  <slot/>
</div>

<svelte:window on:resize={() => position_menu(menu, menu.previousElementSibling)}/>

<script>
import positioner from 'positioner'

let menu

const position_menu = (el, attach_to) => { positioner(el, attach_to.getBoundingClientRect(), 'bottom') }
function focusout() {
    setTimeout(() => {
        if (menu && !menu.contains(document.activeElement))
            setTimeout(() => menu.hidden = true, 50)
    }, 150)
}

async function toggle_menu(e) {
    menu.hidden = !menu.hidden
    if (menu.hidden)
        return

    if (window._useragent.safari)
        e.target.focus()
    await tick()
    position_menu(menu, e.target)
}
</script>

<style>
.dropdown-menu {
  position: absolute;
  z-index: 10;
  background: #fff;
  border-radius: 0.3rem;
  font-size: 0.85rem;
  box-shadow: 0 0 5px #aaa;
  transition: top 0.1s;
  max-width: 250px;
  min-width: 5rem;
}
</style>
