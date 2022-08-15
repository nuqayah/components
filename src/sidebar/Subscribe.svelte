<form method=post action=https://tafsir.app/subscribe.php on:submit|preventDefault={subscribe}>
  <input type=email name=email placeholder=email@example.com requried autofocus>
  <button type=submit>اشترك</button>
</form>

<script>
export const title = 'اشترك لتصلك أخبارنا'

function subscribe(e) {
    const [input, btn] = e.target.elements
    const send_msg = btn.innerHTML
    btn.disabled = true
    const body = JSON.stringify({email: input.value})
    fetch(e.target.action, {method: 'post', mode: 'no-cors', body})
        .then(() => {
            btn.innerHTML = 'شكرًا على اشتراكك!'
            localStorage.setItem('subscribed', true)
            dispatch('close')
        })
        .catch(() => btn.innerHTML = 'حصل خطأ')
        .then(() => reset_btn(btn, send_msg))
}
function reset_btn(btn, msg) {
    setTimeout(() => {
        btn.disabled = false
        btn.innerHTML = msg
    }, 2000)
}
</script>
