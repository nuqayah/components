<label class="inline-flex items-center">{text}{text ? ' ' : ''}<slot/><input type=checkbox hidden bind:checked={value} on:change><div/></label>

<script>
export let value = false
export let text = ''
</script>

<style>
label {
  cursor: pointer;
}
div {
  outline: 0;
  width: 2.8rem;
  height: 1.5rem;
  position: relative;
  cursor: pointer;
  user-select: none;

  background: var(--border-color, #ddd);
  border-radius: 1.5rem;
  padding: 2px;
  transition: background 0.4s ease;
  transform: scale(0.7);
}
div:after, div:before {
  position: relative;
  display: block;
  content: "";
  width: 50%;
  height: 100%;
}
div:after {
  inset-inline-start: 0%;
  border-radius: 50%;
  background: #fff;
  transition: inset-inline-start 0.2s ease;
}
div:before {
  display: none;
}
input[type=checkbox]:checked + div {
  background: #009642;
}
input[type=checkbox]:checked + div:after {
  inset-inline-start: 50%;
}
</style>
