/**
 * @typedef {Object} ComboboxProps
 * @property {HTMLElement | null} listbox
 * @property {(value: string) => void} filterer
 * @property {(i: number) => void} on_kbd_selected
 * @property {(i: number) => void} on_select
 */
/**
 * @param {HTMLInputElement} el
 * @param {ComboboxProps} props
 */
export default function combobox(el: HTMLInputElement, props: ComboboxProps): {
    destroy(): void;
    /** @param {ComboboxProps} props_ */
    update(props_: ComboboxProps): void;
};
export type ComboboxProps = {
    listbox: HTMLElement | null;
    filterer: (value: string) => void;
    on_kbd_selected: (i: number) => void;
    on_select: (i: number) => void;
};
//# sourceMappingURL=combobox.d.ts.map