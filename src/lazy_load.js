import {tick} from 'svelte'
import {debounce} from './util.js'

/**
 * @template T
 * @typedef {Object} LazyLoadProps
 * @property {T[]} items
 * @property {(items: T[]) => void} set_items
 */

/**
 * @template T
 * @param {HTMLElement} el
 * @param {LazyLoadProps<T>} props
 */
export default function lazy_load(el, props) {
    let OFFSET = 200
    let PER_PAGE = 25
    let visible = []
    let prev_items_length = 0

    function add_results() {
        if (
            visible.length < props.items.length &&
            Math.ceil(el.scrollTop + el.offsetHeight + OFFSET) > el.scrollHeight
        ) {
            visible = visible.concat(props.items.slice(visible.length, visible.length + PER_PAGE))
            props.set_items(visible)
        }
    }

    async function pad_results() {
        visible = []
        props.set_items([])
        await tick()
        // If the current props.items don't overflow then add until they do
        if (!el.clientHeight) return
        while (visible.length < props.items.length && el.scrollHeight <= el.clientHeight + 100) {
            await tick()
            visible = visible.concat(props.items.slice(visible.length, visible.length + 3))
            props.set_items(visible)
        }
    }

    function update(props_updated) {
        const old_length = prev_items_length
        props = props_updated
        prev_items_length = props.items.length

        // If items were appended (length grew and visible already has items), just add more
        if (old_length > 0 && props.items.length > old_length && visible.length > 0) {
            add_results()
        } else {
            // Fresh data, reset everything
            pad_results()
        }
    }

    const add_results_debounced = debounce(add_results, 5)
    window.addEventListener('resize', add_results_debounced)
    el.addEventListener('scroll', add_results_debounced)
    setTimeout(() => pad_results(), 50)
    return {
        update,
        destroy() {
            window.removeEventListener('resize', add_results_debounced)
        },
    }
}
