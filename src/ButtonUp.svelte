<svelte:window bind:scrollY={scrollHeight} />
{#if showGotoTop}
    <button
        class="fixed bottom-4 left-4 z-20 h-10 w-10 cursor-pointer rounded-full bg-[#a1a1a3] opacity-50 transition-colors hover:bg-[#b8b8bb] hover:text-white hover:opacity-100"
        on:click={() => scrollTo({top: 0, behavior: 'smooth'})}
        transition:fade={{duration: 300}}
    >
        <CaretUp class="mx-auto " color="#fff" size={20} weight="bold" />
    </button>
{/if}

<script>
import CaretUp from 'phosphor-svelte/lib/CaretUp'
import {fade} from 'svelte/transition'

export let showAtPixel = 500

let scrollHeight = 0
let showGotoTop = 0
let lastScrollHeight = 0
$: {
    showGotoTop = scrollHeight < lastScrollHeight && scrollHeight > showAtPixel
    lastScrollHeight = scrollHeight
}
</script>
