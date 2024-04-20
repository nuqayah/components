{#if show}
  <nav bind:this={sidebar} transition:fly={{x: sidebar.offsetWidth, opacity: 1, duration: 300}} on:click={clicked}>
    <ul>
      <li><button class=btn-link on:click={() => open_modal(Projects)}><icon id=star> مشاريع نقاية</button></li>
      <li><button class=btn-link on:click={() => open_modal(InstallApp)}><icon id=download> تثبيت التطبيق</button></li>
      <li><button class=btn-link on:click={() => open_modal(Donate)}>ساهم معنا <icon id=heart></button></li>
    </ul>

    <ul>
      <li>
        <button class=btn-link on:click={share}><icon id=share> شارك</button> <span class=bullet-sep>·</span>
        <button class=btn-link on:click={() => open_modal(Contact)}><icon id=mail> راسلنا</button></li>
      <li class=social>
          تابعنا: <a target=_blank href=https://t.me/nuqayah><icon id=telegram> </a> <span class=bullet-sep>·</span>
          <a target=_blank href=https://twitter.com/nuqayah><icon id=twitter> </a> <span class=bullet-sep>·</span>
          <a target=_blank href=https://fb.me/nuqayah><icon id=facebook> </a>
      </li>
      {#if !('subscribed' in localStorage)}
        <li><button class=btn-link on:click={() => open_modal(Subscribe)}><icon id=subscribe> اشترك لتصلك أخبارنا</button></li>
      {/if}
    </ul>

    <ul>
      <li>تطوير: <br><a href=https://nuqayah.com><img src=https://nuqayah.com/assets/nuqayah.svg id=nuqayah-logo alt="نقاية"></a></li>
      <li>رعاية: <br><a href=https://ayatt.org.kw><img src=https://nuqayah.com/assets/img/ayatt-logo.svg id=ayatt-logo alt="جمعية آيات الخيرية"></a></li>
    </ul>
  </nav>
{/if}

<script>
import {createEventDispatcher} from 'svelte'
import {fly} from 'svelte/transition'
import Share from './Share.svelte'
import Contact from './Contact.svelte'
import Projects from './Projects.svelte'
import InstallApp from './InstallApp.svelte'
import Subscribe from './Subscribe.svelte'
import Donate from './Donate.svelte'
import {options as modal_options} from 'components/src/Modal.svelte'

export let show = false
export const show_projects = () => open_modal(Projects)

const dispatch = createEventDispatcher()
let sidebar

$: dispatch('show', show)

function open_modal(component) {
    modal_options.set({component, show: true})
    show = false
}
function share() {
    if (navigator.share)
        navigator.share({url: location.origin, text: document.title})
    else
        open_modal(Share)
}

function clicked(e) {
    if (e.target.tagName === 'A')
        show = false
}

document.addEventListener('keydown', e => {
    if (e.keyCode === 27)
        modal_options.set({show: false})
})
</script>

<style>
a, .btn-link {
  --dark-blue: #1e76b0;
  color: var(--dark-blue);
}
nav {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  font-size: 1.1rem;
  padding: 2.2rem 1rem 0.6rem;
  border-left: 1px solid #aaa;
  background: #fff;
  overflow-y: auto;
  line-height: 1.9;
  box-shadow: -4px 0 4px #f5f5f5;
  z-index: 1;
}
nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
nav ul:not(:first-of-type)::before {
  display: block;
  content: "";
  width: 90%;
  margin: 1rem auto;
  border-bottom: 1px solid #eee;
}

#nuqayah-logo {
  filter: drop-shadow(1px 1px 3px #aaa);
  width: 5rem;
  display: block;
  margin: 0 auto 0.5rem;
}
#ayatt-logo {
  display: block;
  margin: 0 auto;
}
.icon {
  width: 0.85rem;
  color: inherit;
}
.icon-star {
  color: coral;
}
.icon-heart {
  color: #ff4c00;
}
.bullet-sep {
  color: #aaa;
  user-select: none;
  padding: 0 .2rem;
  display: inline-block;
}
.social .icon {
  width: 1.1rem;
  height: 1.1rem;
}
</style>
