<ul class="social-buttons">
    {#each social as [cls, get_url]}
        <li>
            <a href={get_url(url, title)} class="social-{cls}" rel="external" target="_blank">
                <svg class="icon icon-{cls}"><use href="/icons.svg#{cls}" /></svg>
            </a>
        </li>
    {/each}
    <li>
        <button onclick={() => copy(url)}
            ><svg class="icon icon-copy"><use href="/icons.svg#copy" /></svg></button
        >
    </li>
</ul>

<script>
const social = [
    [
        'whatsapp',
        (url, title) =>
            `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n${url}`)}`,
    ],
    [
        'telegram',
        (url, title) =>
            `https://telegram.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    ],
    [
        'facebook',
        (url, title) =>
            `https://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`,
    ],
    [
        'twitter',
        (url, title) =>
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n${url}`)}`,
    ],
    [
        'mail',
        (url, title) =>
            `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n${url}`)}`,
    ],
]

let {url, title = 'شارك', copy} = $props()
</script>

<style>
.social-buttons {
    display: flex;
    justify-content: center;
}
.social-buttons li {
    list-style: none;
    margin: 0 0.75rem;
}
.icon {
    width: 1.2rem;
    height: 1.2rem;
}
:global(html.ios) .icon {
    pointer-events: initial;
}

.social-whatsapp .icon {
    color: #25d366;
}
.social-telegram .icon {
    color: #2ca5e0;
}
.social-facebook .icon {
    color: #3b5998;
}
.social-twitter .icon {
    color: #1da1f2;
}
.social-mail .icon {
    color: #607d8b;
}
</style>
