<slot name=button show={() => shown = !shown} {shown}/>

<div class="block w-full transition-[max-height] overflow-auto" style:max-height={shown ? max_height : '0'}>
  <slot/>
</div>

<script>
export let shown = false
export let max_height
</script>
