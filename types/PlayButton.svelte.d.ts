export default PlayButton
type PlayButton = {
    $on?(type: string, callback: (e: any) => void): () => void
    $set?(props: Partial<$$ComponentProps>): void
}
declare const PlayButton: import('svelte').Component<
    {
        playing?: boolean
        title?: string
        button?: any
    },
    {},
    'button'
>
type $$ComponentProps = {
    playing?: boolean
    title?: string
    button?: any
}
