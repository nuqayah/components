import {tick} from 'svelte'

export default function lazy_load(el, props) {
    let OFFSET = 200
    let PER_PAGE = 25
    let visible = []
    function add_results() {
        if (visible.length < props.items.length && Math.ceil(el.scrollTop + el.offsetHeight + OFFSET) > el.scrollHeight) {
            visible = visible.concat(props.items.slice(visible.length, visible.length + PER_PAGE))
            props.set_items(visible)
        }
    }
    async function pad_results(props_updated) {
        props = props_updated
        visible = []
        await tick()
        // If the current props.items don't overflow then add until they do
        if (!el.clientHeight)
            return
        while (visible.length < props.items.length && el.scrollHeight <= el.clientHeight + 100) {
            await tick()
            visible = visible.concat(props.items.slice(visible.length, visible.length + 1))
            props.set_items(visible)
        }
    }
    el.addEventListener('scroll', debounce(add_results, 5))
    setTimeout(() => pad_results(props), 50)
    return {update: pad_results}
}
