<div class="flex flex-col h-full" dir=rtl>
  <input
    type=text
    role=combobox
    autocomplete=off
    class="mb-0 border-0 rounded-none w-full outline-none border-b-2 border-solid border-black focus:border-blue-600"
    bind:this={input_el}
    {placeholder}
    oninput={debounce(handle_input, 150)}
    onkeydown={handle_keydown}
  >
  <ul bind:this={list_box} role=listbox>
    {#each matches as item, index}
      {@const active = index === selected_i}
      <li class:active role=option aria-selected={active} onclick={() => select(item, index)}>
        {@render children?.({ item, index, active, query, })}
      </li>
    {:else}
      <li>{no_results_msg}</li>
    {/each}
  </ul>
</div>

<script>
  import { run } from 'svelte/legacy';

import {debounce} from 'components/src/util.js'

  /** @type {{items: any, filterer: any, placeholder?: string, no_results_msg?: string, children?: import('svelte').Snippet<[any]>}} */
  let {
    items,
    filterer,
    placeholder = 'search',
    no_results_msg = 'no results',
    children
  } = $props();

let list_box = $state()
let matches = $state([])
let selected_i = $state(0)
let query = $state()
let input_el = $state()

run(() => {
    if (items) matches = items
  });
run(() => {
    list_box?.children?.[selected_i]?.scrollIntoView({behavior: 'smooth', block: 'nearest'})
  });

function select(item, index) {
    input_el.value = item.name
    dispatch('input', {item, index})
}
function handle_input(e) {
    query = e?.target?.value || ''
    matches = filterer(query)
    selected_i = 0
}
function handle_keydown(e) {
    const count = matches.length
    switch (e.key) {
        case 'ArrowUp':
            e.preventDefault()
            const position = selected_i - 1
            selected_i = selected_i > -1 && position !== -1 ? position : count - 1
            break
        case 'ArrowDown':
            e.preventDefault()
            selected_i = selected_i < count - 1 ? selected_i + 1 : count ? 0 : 1
            break
        case 'Enter':
            e.preventDefault()
            select(matches[selected_i], selected_i)
            break
    }
}
</script>

<style>
ul[role=listbox] {
  overflow-y: auto;
  flex: 1;

  & > li {
    cursor: pointer;
    padding-inline-start: 0.2rem;
  }
  & > li:not(:first-child) {
    border-top: solid 1px #f0f0f0;
  }
  & > li:hover,
  & > li > :global(a:hover),
  & > li > :global(a:focus),
  & > li.active > :global(a) {
    background-color: #ebebeb;
  }
  & > li[aria-selected='true'] {
    background: #ddd;
  }
  & > li :global(mark) {
    color: red;
    font-weight: bold;
    background: none;
  }
}
</style>
