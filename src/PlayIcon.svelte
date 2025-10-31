<svg viewBox="8 10 16 16" fill="#555555" use:animate={playing}>
    <path d="M11,10 L16.46,13.74 L16.46,22.28 L11,26 M16.46,13.74 L22.7,18 L22.7,18 L16.46,22.28">
        <animate
            begin="indefinite"
            attributeName="d"
            fill="freeze"
            dur="0.1s"
            data-to="M11,10 L15,10 15,26 11,26 M17,10 L21,10 21,26 17,26"
        />
    </path>
</svg>

<script>
/** @type {{playing?: boolean}} */
let {playing = false} = $props()

function animate(svg) {
    const el = svg.querySelector('animate')
    el.dataset.from = svg.querySelector('path').getAttribute('d')
    function update(playing) {
        el.setAttribute('from', el.dataset[playing ? 'from' : 'to'])
        el.setAttribute('to', el.dataset[playing ? 'to' : 'from'])
        el.beginElement()
    }
    return {update}
}
</script>
