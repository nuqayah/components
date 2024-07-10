<button class=close-btn on:click class:active><span></span><span></span><span></span></button>

<script>
export let active = false
</script>

<style>
.close-btn {
  --x: 27px;
  --bar-height: 4px;
  --translate: 8px;
  --top-2nd: 8px;
  --top-3rd: 16px;
  position: fixed;
  top: 0.5rem;
  right: 1rem;
  width: var(--x);
  z-index: 5;
  transition: opacity .25s ease;
  /* Reduce height so it doesn't cover link in sidebar */
  margin-bottom: 1rem;
  /* Make it all clickable */
  padding-top: 1rem;
}
.close-btn:hover {
  opacity: .7;
}
.close-btn span {
  position: absolute;
  top: 0;
  left: 0;
  height: var(--bar-height);
  width: 100%;
  background: #000;
  transition: opacity .35s ease, transform .35s ease;
}
.close-btn span:nth-child(2) {
  top: var(--top-2nd);
}
.close-btn span:nth-child(3) {
  top: var(--top-3rd);
}
.close-btn.active span:nth-child(1) {
  transform: translateY(var(--translate)) rotate(45deg);
}
.close-btn.active span:nth-child(2) {
  opacity: 0;
}
.close-btn.active span:nth-child(3) {
  transform: translateY(calc(var(--translate) * -1)) rotate(-45deg);
}
</style>
