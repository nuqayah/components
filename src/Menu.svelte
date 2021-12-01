<button type=button title={btn_label} on:click={toggle_menu} on:blur={btn_blur}>
  {#if btn_title}
    {btn_title}
  {/if}
  {#if btn_icon}
    <icon id={btn_icon}>
  {/if}
</button>

{#if list}
  <ul class=dropdown-menu class:style-btns={style_btns} style="max-width: {max_width}" {hidden} bind:this={menu} aria-label={menu_label}>
    <slot/>
  </ul>
{:else}
  <div class=dropdown-menu class:style-btns={style_btns} style="max-width: {max_width}" {hidden} bind:this={menu} aria-label={menu_label}>
    <slot/>
  </div>
{/if}

<svelte:window on:resize={() => position_menu(menu, menu.previousElementSibling)}/>

<script>
import positioner from 'positioner'

export let btn_icon = ''
export let btn_title = ''
export let btn_label = ''
export let menu_label = ''
export let style_btns = true
export let max_width = 250
export let list = true

let menu
let hidden = true

const position_menu = (el, attach_to) => { positioner(el, attach_to.getBoundingClientRect(), 'bottom') }
async function toggle_menu(e) {
    if (window._useragent.safari)
        e.currentTarget.focus()
    hidden = !hidden

    if (hidden)
        e.target.blur()
    else {
        await tick()
        positioner(menu, e.target.getBoundingClientRect(), 'bottom')
    }
}
function btn_blur(e) {
    setTimeout(() => {
        if (!e.target.focused)
            hidden = true
    }, 200)
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
  min-width: 5rem;
  min-width: 10rem;
}

.dropdown-menu.style-btns :global(button), .dropdown-menu.style-btns :global(a) {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.15rem 0.3rem;
  border-radius: 0;
}
.dropdown-menu :global(button:hover), .dropdown-menu :global(a:hover) {
  background: #eee;
}
button {
  padding: 0 0.4rem;
}
button .icon {
  color: #777;
  height: 20px;
  vertical-align: middle;
}
button:focus .icon {
  color: #888;
}

.dropdown-menu :global(button .checkmark) {
  min-width: 30px;
  display: inline-block;
}
.dropdown-menu :global(button.selected .checkmark::after) {
  content: '';
  display: inline-block;
  width: 2px;
  height: 12px;
  border: solid #000;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  padding: 2px;
  margin: 0 0.8rem -2px 0.2rem;
}
</style>
