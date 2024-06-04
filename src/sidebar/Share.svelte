<ul class=social-buttons>
  {#each social as [cls, get_url]}
    <li><a href={get_url(url, document.title)} class=social-{cls} rel=external target=_blank>
      <icon id={cls}>
    </a></li>
  {/each}
  <li><button on:click={() => copy(url)}><icon id=copy></button></li>
</ul>

<script>
const social = [
    ['whatsapp', (url, title) => `https://api.whatsapp.com/send?text=${url}%0A${title}`],
    ['telegram', (url, title) => `https://telegram.me/share/url?url=${url}&text=${title}`],
    ['facebook', (url, title) => `https://www.facebook.com/sharer.php?u=${url}&t=${title}`],
    ['twitter', (url, title) => `https://twitter.com/intent/tweet?text=${title}%0A${url}`],
    ['mail', (url, title) => `mailto:?subject=${title}&body=${title}: ${url}`],
]
export let url = location.origin
export let copy
export const title = 'شارك'
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

.social-whatsapp .icon {color: #25D366}
.social-telegram .icon {color: #2CA5E0}
.social-facebook .icon {color: #3B5998}
.social-twitter .icon {color: #1DA1F2}
.social-mail .icon {color: #607D8B;}
</style>
