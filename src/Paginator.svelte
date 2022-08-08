<ul class=pagination>
  <li><button class=btn disabled={cur_page === 1 } on:click={() => cur_page -= cur_page > 1 ? 1 : 0}><icon id=chevron-right></button></li>
  {#each pages as pg}
    {#if pg === cur_page}
      <li>{ar_nums(pg)}</li>
    {:else if pg === '...'}
      <li class=ellipsis>…</li>
    {:else}
      <li><button class=btn on:click={() => cur_page = pg}>{ar_nums(pg)}</button></li>
    {/if}
  {:else}
    <li>١</li>
  {/each}
  <li><button class=btn disabled={cur_page === total_pages} on:click={() => cur_page += cur_page < total_pages ? 1 : 0}><icon id=chevron-left></button></li>
</ul>

<script>
import {ar_nums} from 'components/src/util.js'

export let per_page = 10
export let cur_page
export let count

$: total_pages = Math.ceil(count / per_page)
$: pages = paginate(cur_page, total_pages)

function paginate(cur_pg, last_pg, delta = 2) {
    const left = cur_pg - delta
    const right = cur_pg + delta + 1
    const range = []
    const rangeWithDots = []

    for (let i = 1; i <= last_pg; i++)
        if (i == 1 || i == last_pg || i >= left && i < right)
            range.push(i)

    let l
    range.forEach(i => {
        if (l && i - l === 2)
            rangeWithDots.push(l + 1)
        else if (l && i - l !== 1)
            rangeWithDots.push('...')
        rangeWithDots.push(i)
        l = i
    })

    return rangeWithDots
}
export function go_to_page(pg) {
    if (pg < 0)
        pg += total_pages + 1 // Add one since pages are 1-indexed
    else if (pg === 0)
        pg = 1
    cur_page = Math.min(pg, total_pages)
}

/*
// Usage:
{#each all.slice((cur_page - 1) * per_page, cur_page * per_page) as i}
  <li>{i}</li>
{/each}
<Paginator count=30 bind:cur_page/>

<script>
import Paginator from './Paginator.svelte'

const all = Array(30).fill().map((_, i) => i)
const per_page = 10
let cur_page = 1
<\/script>
*/
</script>

<style>
ul {
  display: flex;
  justify-content: center;
  font-size: 0.8rem;
  margin: 0.7rem 0;
  user-select: none;
}
li {
  margin: 0 0.2rem;
}
</style>
