export default AudioPlayer;
type AudioPlayer = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<Record<string, never>>): void;
};
declare const AudioPlayer: import("svelte").Component<Record<string, never>, {}, "">;
//# sourceMappingURL=AudioPlayer.svelte.d.ts.map