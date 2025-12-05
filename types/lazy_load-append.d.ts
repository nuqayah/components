/**
 * @template T
 * @typedef {Object} LazyLoadProps
 * @property {T[]} items
 * @property {(items: T[]) => void} set_items
 */
/**
 * @template T
 * @param {HTMLElement} el
 * @param {LazyLoadProps<T>} props
 */
export default function lazy_load<T>(el: HTMLElement, props: LazyLoadProps<T>): {
    update: (props_updated: LazyLoadProps<T>) => Promise<void>;
    destroy(): void;
};
export type LazyLoadProps<T> = {
    items: T[];
    set_items: (items: T[]) => void;
};
//# sourceMappingURL=lazy_load-append.d.ts.map