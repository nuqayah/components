<input type=checkbox hidden bind:checked={value} on:change><div/>

<script>
export let value = false
</script>

<style>
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
div::after {
  position: relative;
  display: block;
  content: "";
  width: 50%;
  height: 100%;

  inset-inline-start: 0%;
  transition: inset-inline-start 0.2s ease;
  border-radius: 50%;
  background: #fff;
}
input[type=checkbox]:checked + div {
  background: #009642;
}
input[type=checkbox]:checked + div::after {
  inset-inline-start: 50%;
}
@supports not (inset-inline-start: 0%) {
  div::after {
    transition: left 0.2s ease;
    left: 0%;
  }

  input[type=checkbox]:checked + div::after {
    left: 50%;
  }
  :global(html[dir=rtl]) input[type=checkbox]:checked + div::after {
    left: -50%;
  }
}
</style>
