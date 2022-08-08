<section class=diff-cont dir=auto bind:this={diff_cont} on:scroll={debounce(add_diffs, 5)}>
  {#each diff_data as [op, text], i (i)}
    {#if op == DiffMatchPatch.DIFF_INSERT}
      <ins>{text}</ins>
    {:else if op == DiffMatchPatch.DIFF_DELETE}
      <del>{text}</del>
    {:else if op == DiffMatchPatch.DIFF_EQUAL}
      <span>{text}</span>
    {/if}
  {/each}
</section>

<script>
import * as DiffMatchPatch from 'diff-match-patch'
import {debounce, int_clamp} from 'components/src/util.js'

export let a = ''
export let b = ''
export let changes_count = 0

const dmp = new DiffMatchPatch.diff_match_patch()
dmp.Diff_Timeout = 30
dmp.Diff_EditCost = 4

const DIFF_CHUNKS_COUNT = 250
let diff_cont
let els = []
let current_el = -1
let diff_data = []
let diff_data_all = []

$: if (a && b) {
    show_diff(a, b)
}
$: if (diff_data && diff_cont) {
    current_el = -1
    tick().then(() => {
        els = diff_cont.querySelectorAll('ins, del')
    })
}

export async function show_diff(a, b) {
    diff_data_all = dmp.diff_main(a, b)
    dmp.diff_cleanupSemantic(diff_data_all)
    changes_count = diff_data_all.reduce((acc, [op]) => acc + (op === DiffMatchPatch.DIFF_EQUAL ? 0 : 1) , 0)
    if (diff_data_all.length > 1e3 || Math.max(a.length, b.length) > 2e5) {
        diff_data = diff_data_all.splice(0, DIFF_CHUNKS_COUNT)
        await tick()
        while (diff_data_all.length && diff_cont.scrollHeight <= diff_cont.clientHeight + 100) {
            diff_data = diff_data.concat(diff_data_all.splice(0, DIFF_CHUNKS_COUNT))
            await tick()
        }
    }
    else
        diff_data = diff_data_all
}
async function add_diffs() {
    const el = diff_cont
    if (diff_data_all.length && Math.ceil(el.scrollTop + el.offsetHeight + 200) > el.scrollHeight)
        diff_data = diff_data.concat(diff_data_all.splice(0, DIFF_CHUNKS_COUNT))
}

export function highlight_change(dir) {
    if (!els.length)
        return
    current_el = int_clamp(current_el + dir, 0, els.length - 1)
    els[current_el].scrollIntoView({behavior: 'smooth', block: 'center'})
    els[current_el].classList.add('active')
    els[current_el].addEventListener('transitionend', e => {
        e.target.classList.remove('active')
    }, {once: true})
}
</script>

<style>
section.diff-cont {
  border-top: 2px solid;
  border-left: 2px solid;
  white-space: pre-line;
  height: 100%;
  overflow: auto;

  padding: 0.2rem 0.3rem;
  border-radius: 3px;
  unicode-bidi: plaintext;
}
ins { background: lightgreen }
del { background: lightcoral }
ins, del {
  text-decoration: none;
  transition: background-color 200ms, padding 200ms;
}
.diff-cont :global(:is(ins,del).active) {
  background-color: orange !important;
  padding: 0.2rem 0.5rem;
}
</style>
