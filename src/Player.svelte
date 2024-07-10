<section class=player-cont>
  <input
    type=range
    min=0
    max={duration || 1}
    step=any
    on:input={seeker_input}
    on:click={window._useragent?.ios ? ios_seeker_click : () => {}}
    value={seeker_value}
    style="--bg-size: {seeker_size}%"
  >
  <div class=now-playing>
    <span class=time-passed>{fmt_time(time_passed)}</span>
    <PlayButton on:click={toggle_playing} {playing} bind:button={play_btn}/>
    <span class=time-remaining>-{fmt_time(duration - time_passed)}</span>
  </div>
  <div class=seek-btns>
    <button use:repeat_click={() => audio.playbackRate = int_clamp(audio.playbackRate - 0.1, 0.4, 4)}><icon id=slower></button>
    <output class=play-speed><icon id=speed><span>{audio.playbackRate.toFixed(2)}x</span></output>
    <button use:repeat_click={() => audio.playbackRate = int_clamp(audio.playbackRate + 0.1, 0.4, 4)}><icon id=faster></button>
    <span></span>
    <button use:repeat_click={() => { audio.currentTime += -5 }}><icon id=skip-back></button>
    <span> </span>
    <button use:repeat_click={() => { audio.currentTime += 5 }}><icon id=skip-forward></button>
  </div>
</section>

<svelte:window on:keydown={handle_keydown}/>

<script>
import PlayButton from './PlayButton.svelte'
import {int_clamp, repeat_click, fmt_time} from 'components/src/util.js'
import {onDestroy, createEventDispatcher} from 'svelte'

export let src
export let kv = undefined
export let duration = 0
export let timeupdate = null

const dispatch = createEventDispatcher()

let play_btn
let playing = false
let time_passed = duration
let seeker_value = 0
let seeker_size = 0

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
    if (kv)
        kv.set(src, 0)
})
let every_forth = 0
audio.addEventListener('timeupdate', () => {
    requestAnimationFrame(() => {
        const cur = audio.currentTime
        time_passed = cur
        seeker_value = cur
        seeker_size = int_clamp((cur / (duration || 1)) * 100, 1, 100)
    })
    timeupdate?.(audio.currentTime)
    if (!(every_forth = (every_forth + 1) % 4) && kv && audio.currentTime > 10)
        kv.set(src, audio.currentTime)
})
const toggle_playing = () => { audio[audio.paused ? 'play' : 'pause']() }

export function set_time(time) {
    if (audio.readyState)
        audio.currentTime = time
    else {
        const e = window._useragent?.safari ? 'canplay' : 'loadedmetadata'
        audio.addEventListener(e, () => { audio.currentTime = time }, {once: true})
    }
}

async function set_audio(src) {
    const pbr = audio.playbackRate
    audio.src = src
    audio.play().catch(() => {})
    audio.playbackRate = pbr
    audio.addEventListener('durationchange', () => {
        // I suspect this event sometimes fires incorrectly on iOS, giving us NaN
        duration = audio.duration || 0
    })
    if (kv && await kv.get(src))
        set_time(await kv.get(src))
}
$: set_audio(src)


// Seeker
function seeker_input(e) {
    const val = +e.target.value
    audio.currentTime = val
    audio.dispatchEvent(new CustomEvent('timeupdate'))
}
const ios_seeker_click = e => { audio.currentTime = (e.offsetX / e.target.offsetWidth) * duration }

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
