export default VirtualList;
type VirtualList = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const VirtualList: import("svelte").Component<{
    children: any;
    count: any;
    item_height: any;
    on_first_changed?: any;
    hidden?: boolean;
    show_no_results?: boolean;
    results_message?: string;
}, {}, "">;
type $$ComponentProps = {
    children: any;
    count: any;
    item_height: any;
    on_first_changed?: any;
    hidden?: boolean;
    show_no_results?: boolean;
    results_message?: string;
};
//# sourceMappingURL=VirtualList.svelte.d.ts.map