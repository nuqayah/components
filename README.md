
```svelte
// Playing can stop if the audio ends or the media button is clicked
<PlayButton on:click={play} {playing}/>
```

```svelte
<div use:set_top_offset use:lazy_load={{set_items, items: deck.notes}} class=fill-height/>
const set_items = v => {visible = v} // Had to extract out
```

# Lazy load
Props must *not* be passed directly, otherwise it'll infnite loop
