<div class="relative" dir="rtl">
    <input
        type="text"
        role="combobox"
        autocomplete="off"
        class="mb-0"
        bind:this={input_el}
        {placeholder}
        on:input={debounce(handleInput, delay)}
        on:blur={() => (open = false)}
        on:keydown={handleKeydown}
    />
    <ul bind:this={listBox} role="listbox" hidden={!open}>
        {#each matches as item, index}
            {@const active = index === selected_i}
            <li
                class:active
                role="option"
                aria-selected={active}
                on:click={() => select(item, index)}
            >
                <slot {item} {index} {active} {query}>
                    {@html formatItem(item, query)}
                </slot>
            </li>
        {:else}
            <li>{no_results_msg}</li>
        {/each}
    </ul>

    <span role="status" aria-live="assertive" aria-atomic="true" class="sr-only">{status}</span>
</div>

<script>
import {blur} from 'svelte/transition'
import {debounce} from 'components/src/util.js'
import escape_regex from 'escape-string-regexp'

export let items = []
export let min_query_ln = 0
export let autoFirst = true
export let delay = 150
export let placeholder = 'search'
export let no_results_msg = 'no results'
export const default_status =
    min_query_ln > 0
        ? `Type ${min_query_ln} or more characters for results.`
        : 'Begin typing for results.'
export let filterer = default_filterer

let matches = []
let selected_i = -1
let status = default_status
let query
let open = false
let listBox
let input_el

$: (selected_i, set_sr_status())
$: listBox?.children?.[selected_i]?.scrollIntoView({behavior: 'smooth', block: 'nearest'})
$: if (!open) reset()

function formatItem(item, input) {
    return input ? item.replace(RegExp(escape_regex(input), 'gi'), '<mark>$&</mark>') : item
}

function handleInput(e) {
    query = e?.target?.value || ''
    matches = filterer(query)

    // reset selection whenever `selected_i` is not in matches index range
    if (matches.length - 1 > selected_i && selected_i > -1) {
        selected_i = -1
    }

    open = true
    set_sr_status()
}

function reset() {
    selected_i = -1
    status = default_status
}

function select(item, index) {
    input_el.value = item.name
    open = false
    dispatch('input', {item, index})
}
function handleKeydown(e) {
    if (!open) return
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
        case 'Escape':
            e.preventDefault()
            open = false
            break
    }
}
function set_sr_status() {
    if (open) status = matches.length + ' result(s)'
    if (selected_i > -1) {
        status = matches[selected_i] + ', ' + status
    }
}
function default_filterer(query) {
    if (!items.length || input.length < min_query_ln) return []

    for (let i = 0, l = items.length; i < l; i++) {
        if (items[i].includes(prepped_query)) matches.push(items[i])
    }
    return matches
}
</script>

<style>
ul[role='listbox'] {
    position: absolute;
    left: 0;
    z-index: 1;
    width: 100%;
    max-height: calc(95vh);
    overflow-y: auto;
    list-style: none;
    line-height: 1.7;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-top: 0;
    border-radius: 0 0 0.3rem 0.3rem;
    box-shadow: 0.05rem 0.2rem 0.6rem rgba(0, 0, 0, 0.2);

    & > li {
        cursor: pointer;
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
}
@media (min-height: 500px) {
    ul[role='listbox'] {
        max-height: calc(100vh - 200px);
    }
}
</style>
