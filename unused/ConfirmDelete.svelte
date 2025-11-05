<div class="flex justify-center">
    <button class="btn cancel" data-close>إلغاء</button>
    <button class="btn confirm" onclick={callback} data-close>{confirm_msg}</button>
</div>

<script>
/** @type {{title?: string, confirm_msg: any, callback: any}} */
let {title = '', confirm_msg, callback} = $props()
</script>

<style>
button {
    margin: 0 5px;
}
.confirm {
    color: red;
}
</style>
