<div class="range-wrapper">
    <output for="page-slider" hidden={!range_active} style:--offset={output_offset + 'px'}
        >{output_text}</output
    >
    <input
        id="page-slider"
        type="range"
        min="1"
        {max}
        value={cur_page_i + 1}
        on:click={ios_click}
        on:mouseenter={start_move_thumb}
        on:mouseleave={() => (range_active = false)}
        on:mouseup={end_move_thumb}
        on:touchstart={start_move_thumb}
        on:touchend={end_move_thumb}
        on:input={update_output}
    />
</div>

<script>
import {get_x_offset_percent, ar_nums_fmt} from 'components/src/util.js'

export let virtual_list
export let cur_page_i
export let max

let range_active = false
let output_text = ''
function ios_click(e) {
    if (window._useragent.ios) virtual_list.go_to_page(Math.floor(get_x_offset_percent(e) * max))
}
function start_move_thumb(e) {
    range_active = true
    update_output(e)
}
let output_offset
function update_output(e) {
    const pg = +e.target.value
    output_text = ar_nums_fmt(pg)
    output_offset = ((max - pg) / max) * (e.target.offsetWidth - 10)
}
function end_move_thumb(e) {
    range_active = false
    const i = +e.target.value
    virtual_list.go_to_page(i)
}
</script>

<style>
.range-wrapper {
    flex: 1;
    display: flex;
    position: relative;
}
input[type='range'] {
    width: 100%;
    margin: 0;
    background: transparent;
    cursor: pointer;
    outline: 0;
    -webkit-appearance: none;
    border: initial;
    box-shadow: none;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
}
input[type='range']::-webkit-slider-runnable-track {
    height: 14px;
    border-radius: 8px;
    border: solid 1px #eee;
    background: #ccc;
}
input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    margin-top: -3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #016982;
    box-shadow: 0 0 2px #aaa;
    border: 0; /* iOS */
}
input[type='range']::-moz-range-thumb {
    margin-top: -3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #016982;
    box-shadow: 0 0 2px #aaa;
    border: 0;
}
input[type='range']::-moz-range-track,
input[type='range']::-moz-range-progress {
    background-color: #ccc;
    height: 14px;
    border-radius: 8px;
}
input[type='range']::-moz-range-progress {
    background: var(--light-blue);
}
input[type='range']::-moz-focus-outer {
    border: 0;
}
output {
    display: block;
    position: absolute;
    left: 9px;
    top: -35px;
    padding: 7px 5px;
    border-radius: 3px;
    background: #333;
    color: #eee;
    text-align: center;
    line-height: 1;
    font-size: 0.75rem;
    transform: translateX(calc(var(--offset, 0px) - 50%));
    white-space: pre-wrap;
}
</style>
