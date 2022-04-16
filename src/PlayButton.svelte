<button title="Play or pause" tabindex=0 bind:this={button} on:click>
  <svg viewBox="8 10 16 16" fill="#555555" use:animate_play_btn={playing}>
    <path d="M11,10 L16.46,13.74 L16.46,22.28 L11,26 M16.46,13.74 L22.7,18 L22.7,18 L16.46,22.28">
      <animate begin=indefinite attributeName=d fill=freeze dur=0.1s
        data-to="M11,10 L15,10 15,26 11,26 M17,10 L21,10 21,26 17,26">
       </animate>
    </path>
  </svg>
</button>

<script>
export let playing = false
export let button

function animate_play_btn(btn) {
    const el = btn.querySelector('animate')
    el.dataset.from = btn.querySelector('path').getAttribute('d')
    function update(playing) {
        el.setAttribute('from', el.dataset[playing ? 'from' : 'to'])
        el.setAttribute('to', el.dataset[playing ? 'to' : 'from'])
        el.beginElement()
    }
    return {update}
}
</script>

<style>
button {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.5rem 0.5rem;
}
</style>
