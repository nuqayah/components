<input
    {id}
    {inputmode}
    {pattern}
    autocomplete="off"
    type="text"
    value={display_value}
    oninput={handle_change}
    onkeydown={handle_keydown}
    {placeholder}
    {disabled}
    class={[
        'rounded border px-2.5 py-2 text-base transition-all duration-150 ease-in-out focus:outline-none disabled:bg-gray-100',
        is_valid
            ? 'border-gray-300 bg-white text-gray-700'
            : 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500',
        class_name,
    ]}
    {...rest}
/>

<script>
import {ar_nums, en_nums} from 'components/src/util'
import {clamp} from 'es-toolkit'

let {
    value = $bindable(1),
    min = 1,
    max = 100,
    id = '',
    class: class_name = '',
    inputmode = 'numeric',
    pattern = '[\\d٠-٩]+',
    oninput = (val) => {},
    onpreinput = (val) => true,
    is_valid = $bindable(true),
    disabled = false,
    display_value = $bindable(''),
    placeholder = undefined,
    default_value = 1,
    get_max_value = () => max,
    handle_arrow_navigation = null,
    ...rest
} = $props()

function handle_keydown(e) {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
    e.preventDefault()

    const current = value ?? min

    // If custom arrow navigation is provided, use it
    if (handle_arrow_navigation && handle_arrow_navigation(e.key, current)) {
        return
    }

    // Otherwise use default arrow navigation
    const current_max = get_max_value()
    const delta = e.key === 'ArrowUp' ? 1 : -1
    const new_value = clamp(current + delta, min, current_max)

    // Call onpreinput before changing the value
    onpreinput(new_value)

    value = new_value
    is_valid = true
    oninput(new_value)
    display_value = ar_nums(new_value.toString())
}

function handle_change(e) {
    const raw_input = e.currentTarget.value.trim()
    display_value = ar_nums(raw_input)

    if (!raw_input) {
        onpreinput(default_value)
        value = default_value
        is_valid = false
        oninput(default_value)
        return
    }

    const input_value = en_nums(raw_input)
    const parsed_value = parseInt(input_value, 10)

    if (isNaN(parsed_value)) {
        onpreinput(default_value)
        value = default_value
        is_valid = false
        oninput(default_value)
        return
    }

    const current_max = get_max_value()
    if (parsed_value < min || parsed_value > current_max) {
        onpreinput(default_value)
        value = default_value
        is_valid = false
        oninput(default_value)
        return
    }

    onpreinput(parsed_value)
    is_valid = true
    value = parsed_value
    oninput(parsed_value)
    display_value = ar_nums(parsed_value.toString())
}
</script>
