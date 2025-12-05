AudioPlayer
scp -C dist/index.html web:/srv/apps/islamsh/player-sv.html

<!-- https://islam.sh/player.html -->
<main class="max-w-[650px] mx-auto">
  <Player bind:audio={audio_el} {src} {kv}/>
  <ul id=playlist class="max-h-[80vh]">
    {#each playlist as f, i}
    <li class="part-item" class:active={i === part_i}>
        <button onclick={() => part_i = i} class="flex items-center w-full text-start">
          <span class="part-num">{ar_nums(i + 1)}</span>
          <span class="part-title">{f.title || ''}</span>
          <span class="part-duration">{f.duration ? fmt_time(f.duration) : '-'}</span>
          <a class="download-link" href="{f.file}" download target="_blank" aria-label="download"><icon id=download></a>
        </button>
    </li>
    {/each}
  </ul>
</main>

<label class=block>files <input type=text onpaste={set_files} class="block"></label>

<script>
import {run} from 'svelte/legacy'

import * as kv from 'idb-keyval'
import Player from 'components/src/Player.svelte'
import {fmt_time, ar_nums, int_clamp, debounce, url_params} from 'components/src/util.js'

let audio_el = $state()
let src = $state('')
// part = int_clamp(part, 1, playlist.length)
// kv.set(playlist_id + 'part', part)

function parse_range_url(url) {
    if (!/\[(\d+)-(\d+)\]/.test(url))
        return [{file: url}]

    const [grp, start, end] = url.match(/\[(\d+)-(\d+)\]/)
    const pad = start.length > 1 && start[0] === '0'
    return Array((+end + 1) - +start).fill().map((_, i) => {
        i += +start
        return {file: url.replace(grp, pad ? ('' + i).padStart(end.length, '0') : i)}
    })
}

const sources = {
    archive(qs) {
        return fetch(`https://archive.org/embed/${qs.id}?output=json`).then(r => r.json()).then(json => {
            return json.map(f => {
                const file = 'https://archive.org' + f.sources[0].file
                return {file, title: ar_nums(f.title), duration: f.duration}
            })
        })
    },
    islamweb(qs) {
        const url = `get.php?src=islamweb&sid=${qs.sid}&id=${qs.id}`
        return fetch(url).then(r => r.json()).then(json => json.data)
    },
    json(qs) {
        return fetch(qs.id).then(r => r.json()).then(json => json.files)
    },
    url(qs) {
        if (qs.id.endsWith('.txt'))
            return fetch(qs.id).then(r => r.text()).then(text => text.trim().split('\n').map(file => ({file})))
        else
            return parse_range_url(qs.id)
    },
}

let playlist = $state([])
let playlist_id = ''
let part_i = $state(0)
;(async function init() {
    if (!location.search)
        return
    const qs = url_params(location.search)
    if (!qs.id || !sources[qs.src])
        return
    playlist_id = `${qs.src}-${qs.id}-`
    playlist = await sources[qs.src](qs)
    part_i = (await kv.get(playlist_id + 'part')) || 0
})()

function set_files(e) {
    let val = ''
    if (e.preventDefault) {
        e.preventDefault()
        val = e.clipboardData.getData('text/plain').trim()
    }
    const files = val.trim().split('\n').map(file => ({file, title: file.split('/').pop()}))
    playlist = files
    part_i = 0
}
run(() => {
    src = playlist[part_i]?.file || ''
})
</script>

<style>
#playlist {
  overflow-y: auto;
  font-size: 0.85rem;
}
#playlist li {
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  color: #036b79;
}
#playlist li:first-child {
  padding-top: 8px;
}
#playlist li:not(:last-child) {
  border-bottom: 1px solid #f5f5f5;
}
#playlist li.active {
  background: #f5f5f5;
}
#playlist li:hover {
  background: #f9f9f9
}

.part-num {
  color: #0d0909;
  padding-left: 1rem;
  display: inline-block;
  font-weight: bold;
}
.part-title {
  flex: 1;
}
.part-duration {
  font-size: 0.6rem;
  font-family: sans-serif;
}
a.download-link {
  padding-right: 0.5rem;
}
.icon-download {
  width: 15px;
}
</style>
