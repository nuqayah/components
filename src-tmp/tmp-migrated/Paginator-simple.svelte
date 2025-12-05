<!-- see photo -->
<div class="text-center border-t-2 border-gray-300">
  <button class=btn disabled={cur_page === 1 } onclick={() => cur_page -= cur_page > 1 ? 1 : 0}><icon id=chevron-right/></button>
    الجزء
    <input
      type=text
      inputmode=numeric
      value={ar_nums(cur_page)}
      pattern="[\d٠-٩]+"
      class="w-8 text-center text-[0.8rem] py-0 leading-[1.7] border-0 border-b-2 border-black rounded-none"
      oninput={e => prep_value(e.target)}
    >
    من {ar_nums(total_pages)}
  <button class=btn disabled={cur_page === total_pages} onclick={() => cur_page += cur_page < total_pages ? 1 : 0}><icon id=chevron-left/></button>
</div>

<script>
import {ar_nums, en_nums} from 'components/src/util.js'

  /** @type {{per_page?: number, cur_page: any, count: any}} */
  let { per_page = 10, cur_page = $bindable(), count } = $props();

let total_pages = $derived(Math.ceil(count / per_page))

function prep_value(el) {
    el.value = ar_nums(el.value).replace(/[^٠-٩-]/, '')
    const val = +en_nums(el.value)
    if (val && val > 0 && val <= total_pages)
        cur_page = val
}
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
