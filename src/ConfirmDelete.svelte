<div class="flex justify-center">
  <button class="btn cancel" data-close>إلغاء</button>
  <button class="btn confirm" on:click={callback} data-close>{confirm_msg}</button>
</div>

<script>
export let title = ''
export let confirm_msg
export let callback
</script>

<style>
button {
  margin: 0 5px;
}
.confirm {
  color: red;
}
</style>
