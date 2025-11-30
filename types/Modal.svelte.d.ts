export function show(component: any, props: any): void;
export default Modal;
type Modal = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<Record<string, never>>): void;
};
declare const Modal: import("svelte").Component<Record<string, never>, {}, "">;
//# sourceMappingURL=Modal.svelte.d.ts.map