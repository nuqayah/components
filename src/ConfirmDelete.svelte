<div class="flex justify-center">
  <button class="btn cancel" data-close>إلغاء</button>
  <button class="btn confirm" on:click={callback} data-close>نعم، احذف هذه الحزمة</button>
</div>

<script>
export const title = 'هل تريد حذف هذه الحزمة؟'
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
