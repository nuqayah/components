<label><input type=checkbox hidden bind:checked={value} on:change><div/></label>

<script>
export let value = false;
</script>

<style>
/* Rarely needed */
label {
  display: inline-block;
  vertical-align: middle;
  transform: scale(0.7);
}
input[type=checkbox] + div {
  outline: 0;
  display: block;
  width: 2.8rem;
  height: 1.5rem;
  position: relative;
  cursor: pointer;
  user-select: none;

  background: #f0f0f0;
  border-radius: 1.5rem;
  padding: 2px;
  transition: background 0.4s ease;
}
input[type=checkbox] + div:after, input[type=checkbox] + div:before {
  position: relative;
  display: block;
  content: "";
  width: 50%;
  height: 100%;
}
input[type=checkbox] + div:after {
  left: 0%;
  border-radius: 50%;
  background: #fff;
  transition: left 0.2s ease;
}
input[type=checkbox] + div:before {
  display: none;
}
input[type=checkbox]:checked + div {
  background: #009642;
}
input[type=checkbox]:checked + div:after {
  left: 50%;
}
:global(html[dir=rtl]) input[type=checkbox]:checked + div:after {
  left: -50%;
}
</style>
