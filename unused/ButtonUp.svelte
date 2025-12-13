<svelte:window bind:scrollY={scroll_height} />

{#if show_goto_top}
    <button
        class="fixed bottom-4 left-4 z-20 h-10 w-10 cursor-pointer rounded-full bg-[#a1a1a3] opacity-50 transition-colors hover:bg-[#b8b8bb] hover:text-white hover:opacity-100"
        onclick={() => scrollTo({top: 0, behavior: 'smooth'})}
        transition:fade={{duration: 300}}
    >
        <ChevronUp class="mx-auto" color="#fff" size={20} />
    </button>
{/if}

<script>
import {ChevronUp} from '@lucide/svelte'
import {fade} from 'svelte/transition'

let show_at_pixel = 500
let scroll_height = $state(0)
let last_scroll_height = 0
let show_goto_top = $derived.by(() => {
    const c = scroll_height < last_scroll_height && scroll_height > show_at_pixel
    last_scroll_height = scroll_height
    return c
})
</script>
