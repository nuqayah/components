import {debounce, on, off} from 'components/src/util.js'

export default function combobox(el, props) {
    let selected_i = 0
    function handle_input(e) {
        props.filterer(e?.target?.value || '')
        selected_i = 0
        set_kbd_selected(selected_i)
    }
    function set_kbd_selected() {
        props.listbox.children[selected_i]?.scrollIntoView({behavior: 'smooth', block: 'nearest'})
        props.on_kbd_selected(selected_i)
    }
    function handle_keydown(e) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault()
            if (e.key === 'ArrowUp')
                selected_i = (selected_i || props.listbox.children.length) - 1
            else if (e.key === 'ArrowDown')
                selected_i = (selected_i + 1) % props.listbox.children.length
            set_kbd_selected(selected_i)
        }
        else if (e.key === 'Enter') {
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
        update(props_) {
            props = props_ // required for listbox
        },
    }
}
