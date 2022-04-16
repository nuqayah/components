<section class=player-cont>
  <input
    type=range
    min=0
    max={duration || 1}
    step=any
    on:input={seeker_input}
    on:click={window._useragent.ios ? ios_seeker_click : () => {}}
    value={seeker_value}
    style="--bg-size: {seeker_style}%"
  >
  <div class=now-playing>
    <span class=time-passed>{fmt_time(time_passed)}</span>
    <PlayButton on:click={toggle_playing} {playing} bind:button={play_btn}/>
    <span class=time-remaining>-{fmt_time(duration - time_passed)}</span>
  </div>
  <div class=seek-btns use:init_seek_btns>
    <button class="speed decrease"><icon id=slower></button>
    <output class=play-speed><icon id=speed><span>{playback_rate.toFixed(2)}x</span></output>
    <button class="speed increase"><icon id=faster></button>
    <span class=sep />
    <button class="skip decrease"><icon id=skip-back></button>
    <span> </span>
    <button class="skip increase"><icon id=skip-forward></button>
  </div>
</section>

<svelte:window on:keydown={handle_keydown}/>

<script>
import PlayButton from './PlayButton.svelte'

const fmt_time = s => (new Date(s * 1000).toISOString().slice(10, 19)).replace(/T(00:)?/, '')
const int_bound = (int, min, max) => Math.max(Math.min(int, max), min)

export let src
export let duration = 0
export let timeupdate = false


let play_btn
let playback_rate = 1
let playing = false
let time_passed = duration
let seeker_value = 0
let seeker_style = 0


// Audio
export const audio = new Audio()
audio.addEventListener('play', () => { playing = true })
audio.addEventListener('pause', () => {
    setTimeout(() => {
        if (audio.paused)
            playing = false
    }, 75)
})
audio.addEventListener('ended', () => {
    dispatch('ended')
})
audio.addEventListener('timeupdate', () => {
    requestAnimationFrame(() => {
        const cur = audio.currentTime
        time_passed = cur
        seeker_value = cur
        seeker_style = int_bound((cur / (duration || 1)) * 100, 1, 100)
    })
    if (timeupdate)
        dispatch('timeupdate', audio.currentTime)
})
$: audio.playbackRate = playback_rate
const toggle_playing = () => { audio[audio.paused ? 'play' : 'pause']() }

async function set_time(time) {
    audio.currentTime = time
    if (!audio.readyState && window._useragent.safari)
        audio.addEventListener('canplay', () => { audio.currentTime = time }, {once: true})
    audio.dispatchEvent(new CustomEvent('timeupdate')) // TODO: if safari isnt't this wrong?
}

async function set_audio(src) {
    audio.src = src
    audio.play().catch(() => {})
    const pbr = playback_rate
    playback_rate = -1
    playback_rate = pbr
    audio.addEventListener('durationchange', () => {
        duration = audio.duration
    }, {once: true})
}
$: set_audio(src)


// Seeker
function seeker_input(e) {
    const val = +e.target.value
    audio.currentTime = val
    audio.dispatchEvent(new CustomEvent('timeupdate'))
}
const ios_seeker_click = e => { audio.currentTime = (e.offsetX / e.target.offsetWidth) * duration }


// Seek btns
function init_seek_btns(cont) {
    function val_change(e) {
        const sign = e.target.classList.contains('decrease') ? -1 : 1
        if (e.target.classList.contains('skip'))
            audio.currentTime += 5 * sign
        else {
            playback_rate = int_bound(playback_rate + 0.1 * sign, 0.4, 4)
        }
        if (e.preventDefault)
            e.preventDefault()
    }

    let repeat_interval
    function val_change_wrapper(e) {
        val_change(e)
        clearInterval(repeat_interval)
        repeat_interval = setInterval(() => val_change(e), 150)
    }
    const btns = cont.querySelectorAll('button')
    ;[...btns].forEach(btn => btn.addEventListener('mousedown', val_change_wrapper))
    ;[...btns].forEach(btn => btn.addEventListener('touchstart', val_change_wrapper))
    document.documentElement.addEventListener('mouseup', () => clearInterval(repeat_interval))
    ;[...btns].forEach(btn => btn.addEventListener('touchend', () => clearInterval(repeat_interval)))
}


// Misc
function handle_keydown(e) {
    if (e.key === ' ' && document.activeElement !== play_btn)
        toggle_playing()
}

onDestroy(() => {
    audio.src = ''
    audio.pause()
})
</script>

<style>
.player-cont {
  direction: ltr;
  padding: 0.5rem;
  box-shadow: 0 2px 1px 0 whitesmoke;

  background: #fff;
  box-shadow: 0 -3px 1px 0 #f5f5f5;
}

/* Seeker */
input[type=range] {
  display: block;
  width: 100%;
  border: 0;
  margin: 0;
  height: 20px;
  background: transparent;
  cursor: pointer;
  outline: 0;
  -webkit-appearance: none;
  --bg-size: 1%;
}
input[type=range]::-webkit-slider-runnable-track {
  height: 9px;
  border-radius: 5px;
  border: solid 1px #eee;
  background: linear-gradient(#016982, #016982) no-repeat, linear-gradient(#ccc, #ccc);
  background-size: var(--bg-size) 100%;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  margin-top: -5px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 6px #aaa;
  border: 0; /* iOS */
}
input[type=range]::-moz-range-thumb {
  margin-top: -5px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 6px #aaa;
  border: 0; /* Fx */
}
input[type=range]::-moz-range-progress {
  background-color: #016982;
}
input[type=range]::-moz-range-track {
  background-color: #ccc;
}
input[type=range]::-moz-focus-outer {
  border: 0;
}
input[type=range]::-ms-fill-upper {
  background-color: #ccc;
}
input[type=range]::-ms-fill-lower {
  background-color: #016982;
}

/* Times & play button */
.now-playing {
  display: flex;
  text-align: center;
  padding: 0.3rem 0;
}
.time-passed, .time-remaining {
  color: #aaa;
  font-family: sans-serif;
  font-size: 0.7rem;
  flex: 1;
}

/* Seek buttons */
.seek-btns {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.seek-btns .icon {
  color: #777;
}
.play-speed {
  font: 0.6rem sans-serif;
  line-height: 0.7;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
}
</style>
