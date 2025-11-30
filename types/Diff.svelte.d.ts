export default Diff;
type Diff = SvelteComponent<{
    pause_diffing: any;
    a?: string;
    b?: string;
    changes_count?: number;
    show_diff?: (a: any, b: any) => Promise<void>;
    highlight_change?: (dir: any) => void;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> & {
    $$bindings?: string;
} & {
    show_diff: (a: any, b: any) => Promise<void>;
    highlight_change: (dir: any) => void;
};
declare const Diff: $$__sveltets_2_IsomorphicComponent<{
    pause_diffing: any;
    a?: string;
    b?: string;
    changes_count?: number;
    show_diff?: (a: any, b: any) => Promise<void>;
    highlight_change?: (dir: any) => void;
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {
    show_diff: (a: any, b: any) => Promise<void>;
    highlight_change: (dir: any) => void;
}, string>;
interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import("svelte").ComponentConstructorOptions<Props>): import("svelte").SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
//# sourceMappingURL=Diff.svelte.d.ts.map