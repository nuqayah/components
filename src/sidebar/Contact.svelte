<form method=post action=https://tafsir.app/msg.php on:submit|preventDefault={send_msg}>
  <input type=text name=name placeholder=الاسم autofocus>
  <input type=email name=email placeholder=email@example.com>
  <textarea type=textarea name=msg placeholder=الرسالة rows=5 required></textarea>
  <button type=submit name=submit>إرسال</button>
</form>

<button bind:this={closer} data-close hidden></button>
<script>
let closer

function send_msg(e) {
    const form = e.target
    const data = {
        site: location.toString().replace(/^https?:\/\//, ''),
        ...Object.fromEntries([...form.elements].slice(0, -1).map(el => [el.name, el.value])),
    }
    form.reset()
    const submit_btn = form.elements.submit
    const submit_msg = submit_btn.textContent
    submit_btn.disabled = true
    fetch(form.action, {method: 'post', mode: 'no-cors', body: JSON.stringify(data)})
        .then(() => submit_btn.textContent = 'أرسلت رسالتك')
        .catch(() => submit_btn.textContent = 'حصل خطأ')
        .then(() => {
            setTimeout(() => {
                closer.click()
                submit_btn.disabled = false
                submit_btn.textContent = submit_msg
            }, 1500)
        })
}
export const title = 'راسلنا'
</script>
