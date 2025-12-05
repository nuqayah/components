/*
see:
- https://svelte.dev/repl/a645fd33ff3e4c168c589f54b98127a0?version=4.2.19
- https://codepen.io/royketelaar/pen/avWxve
- https://codepen.io/webmarcello8080/pen/oNGmGWL

- write a svelte action called use:truncate that is used with <p> elements.
- if the contents are more than 500 characters, truncate, and add a more button to the end of the text.
- slow expand
- params:
- max height of p. it should scroll more than this (max-height; overflow-auto)
- classes to pass to button
- text to pass to button (defaults to "more ...")

hmm, or define the button in markup. and in the action, add the event listener to the button. or if text is short, remove (or hide) the button.
option to showing button
*/
