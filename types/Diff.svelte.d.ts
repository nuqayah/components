export default Diff;
type Diff = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<DiffProps>): void;
} & {
    show_diff: (a: any, b: any) => Promise<void>;
    highlight_change: (dir: any) => void;
};
declare const Diff: import("svelte").Component<{
    a?: string;
    b?: string;
    changes_count?: number;
    /**
     * - if updating a or b independently, we will want to pause diffing
     */
    pause_diffing: any;
}, {
    show_diff: (a: any, b: any) => Promise<void>;
    highlight_change: (dir: any) => void;
}, "changes_count">;
type DiffProps = {
    a?: string;
    b?: string;
    changes_count?: number;
    /**
     * - if updating a or b independently, we will want to pause diffing
     */
    pause_diffing: any;
};
//# sourceMappingURL=Diff.svelte.d.ts.map