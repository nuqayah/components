export default Popover;
type Popover = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<PopoverProps>): void;
};
declare const Popover: import("svelte").Component<{
    hide_on_click?: boolean;
    append_to_body?: boolean;
    /**
     * - rarely needed but useful for debugging
     */
    shown?: boolean;
    button?: import("svelte").Snippet<[any]>;
    children?: import("svelte").Snippet;
}, {}, "shown">;
type PopoverProps = {
    hide_on_click?: boolean;
    append_to_body?: boolean;
    /**
     * - rarely needed but useful for debugging
     */
    shown?: boolean;
    button?: import("svelte").Snippet<[any]>;
    children?: import("svelte").Snippet;
};
//# sourceMappingURL=Popover.svelte.d.ts.map