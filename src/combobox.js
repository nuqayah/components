import {debounce, on, off} from './util.js'

/**
 * @typedef {Object} ComboboxProps
 * @property {HTMLElement | null} listbox
 * @property {(value: string) => void} filterer
 * @property {(i: number) => void} on_kbd_selected
 * @property {(i: number) => void} on_select
 */

/**
 * @param {HTMLInputElement} el
 * @param {ComboboxProps} props
 */
export default function combobox(el, props) {
    let selected_i = 0

    /** @param {Event} e */
    function handle_input(e) {
        props.filterer(/** @type {HTMLInputElement} */ (e.target).value)
        selected_i = 0
        set_kbd_selected(selected_i)
    }

    /** @param {number} i */
    function set_kbd_selected(i) {
        selected_i = i
        props.listbox.children[i]?.scrollIntoView({block: 'nearest'})
        props.on_kbd_selected(i)
    }

    /** @param {KeyboardEvent} e */
    function handle_keydown(e) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault()
            if (e.key === 'ArrowUp') selected_i = (selected_i || props.listbox.children.length) - 1
            else if (e.key === 'ArrowDown')
                selected_i = (selected_i + 1) % props.listbox.children.length
            set_kbd_selected(selected_i)
        } else if (/Page(Up|Down)/.test(e.key)) {
            e.preventDefault()
            const {children} = props.listbox
            let h = props.listbox.offsetHeight
            let i = selected_i
            if (e.key.endsWith('Down')) {
                const ln = children.length
                while (i < ln - 1 && h > 0) {
                    h -= /** @type {HTMLElement} */ (children[i]).offsetHeight
                    i++
                }
            } else {
                while (i > 0 && h > 0) {
                    h -= /** @type {HTMLElement} */ (children[i]).offsetHeight
                    i--
                }
            }
            set_kbd_selected(i)
        } else if (e.key === 'Home') {
            e.preventDefault()
            set_kbd_selected(0)
        } else if (e.key === 'End') {
            e.preventDefault()
            set_kbd_selected(props.listbox.children.length - 1)
        } else if (e.key === 'Enter') {
            e.preventDefault()
            props.on_select(selected_i)
        }
    }

    const handle_input_debounced = debounce(handle_input, 150)
    on(el, 'input', handle_input_debounced)
    on(el, 'keydown', handle_keydown)
    return {
        destroy() {
            off(el, 'input', handle_input_debounced)
            off(el, 'keydown', handle_keydown)
        },
        /** @param {ComboboxProps} props_ */
        update(props_) {
            props = props_ // required for listbox
        },
    }
}
