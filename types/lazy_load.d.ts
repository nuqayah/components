/**
 * @template T
 * @typedef {Object} LazyLoadProps
 * @property {T[]} items
 * @property {(items: T[]) => void} set_items
 */
/**
 * Usage notes:
 * - Svelte 5: avoid passing deeply reactive `$state` proxies as `props.items` (especially large arrays/objects).
 *   Prefer plain arrays, or store the list in `$state.raw(...)` and update it by reassigning.
 * - Let Svelte drive the action update: pass a `$derived({ set_items, items })` object to `use:lazy_load={...}`.
 *   Update the list by reassigning the `items` source (don’t mutate `lazy_load_props.items`).
 * - `update()` preserves visible items when the previous list is a prefix of the new list. Other updates reset the list.
 *
 * Example (recommended pattern):
 * ```svelte
 * <script>
 * import lazy_load from 'components/lazy_load'
 *
 * let visible = $state([])
 * let items = $state.raw(all_items)
 *
 * const lazy_load_props = $derived({
 *     set_items: v => (visible = v),
 *     items,
 * })
 *
 * function set_list(next) {
 *     items = next
 * }
 * </script>
 *
 * <ul use:lazy_load={lazy_load_props}>
 * {#each visible as item (item.id)}
 * <li>{item.name}</li>
 * {/each}
 * </ul>
 * ```
 */
/**
 * @template T
 * @param {HTMLElement} el
 * @param {LazyLoadProps<T>} props
 */
export default function lazy_load<T>(el: HTMLElement, props: LazyLoadProps<T>): {
    update: (props_updated: any) => void;
    destroy(): void;
};
export type LazyLoadProps<T> = {
    items: T[];
    set_items: (items: T[]) => void;
};
//# sourceMappingURL=lazy_load.d.ts.map