<!-- ?? -->
<script>
  import Alerts, { alerts } from './Alerts.svelte';

  let position = 'start';
</script>

<Alerts {position} />

<main>
  <article>
    <h1>Svelte Alerts Example</h1>

    <fieldset>
      <legend>Position</legend>
      <div style="display: flex; align-items:center;">
        <div>
          <input type="radio" name="position" id="start" value="start" bind:group={position} />
          <label for="end">Top</label>
        </div>
        <div>
          <input type="radio" name="position" id="end" value="end" bind:group={position} />
          <label for="end">Bottom</label>
        </div>
      </div>
    </fieldset>

    <div>
      <label for="max">Maximum number of alerts to show</label>
      <input id="max" type="number" bind:value={alerts.max} min="2" max="10" step="1" />
    </div>

    <div>
      <label for="max">Automatically dismiss after milliseconds</label>
      <input
        id="max"
        type="number"
        bind:value={alerts.dismiss_after}
        min="1000"
        max="30000"
        step="1"
      />
    </div>

    <div style="display: flex; gap: 0.5rem; align-items: baseline;">
      <input id="dismiss_button" type="checkbox" bind:checked={alerts.dismiss_button} />
      <label for="dismiss_button">Show dismiss button</label>
    </div>

    <div style="display:flex; gap:0.5rem">
      <button
        on:click={() =>
          alerts.info(
            `Participate in the first <a href="https://hack.sveltesociety.dev/" target="_blank" rel="noreferer" style="color: white; font-weight: 700; text-decoration: underline;">Svelte hackathon</a>.`
          )}>Info
      </button>
      <button on:click={() => alerts.error('Invalid email or password.')}>Error</button>
      <button on:click={() => alerts.success('Your settings have been saved.')}>Success</button>
      <button on:click={() => alerts.dismiss_all()}>Dismiss All</button>
    </div>
  </article>
</main>

<style>
  main {
    height: 100%;
    display: grid;
    place-items: center;
  }

  article {
    max-width: 55ch;
  }

  fieldset {
    margin-block-end: 1rem;
  }

  fieldset div {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  label,
  input[type='number'] {
    display: block;
    width: 100%;
  }

  label {
    margin-block-end: 0.25rem;
  }
</style>
