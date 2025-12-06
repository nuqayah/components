export default ModalSingle;
type ModalSingle = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const ModalSingle: import("svelte").Component<{
    show?: any;
    children: any;
}, {}, "show">;
type $$ComponentProps = {
    show?: any;
    children: any;
};
//# sourceMappingURL=ModalSingle.svelte.d.ts.map