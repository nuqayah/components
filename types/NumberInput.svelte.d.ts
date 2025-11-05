export default NumberInput
type NumberInput = {
    $on?(type: string, callback: (e: any) => void): () => void
    $set?(props: Partial<$$ComponentProps>): void
}
declare const NumberInput: import('svelte').Component<
    {
        value?: number
        min?: number
        max?: number
        id?: string
        class?: string
        inputmode?: string
        pattern?: string
        oninput?: Function
        onpreinput?: Function
        is_valid?: boolean
        disabled?: boolean
        display_value?: string
        placeholder?: any
        default_value?: number
        get_max_value?: Function
        handle_arrow_navigation?: any
    } & Record<string, any>,
    {},
    'value' | 'is_valid' | 'display_value'
>
type $$ComponentProps = {
    value?: number
    min?: number
    max?: number
    id?: string
    class?: string
    inputmode?: string
    pattern?: string
    oninput?: Function
    onpreinput?: Function
    is_valid?: boolean
    disabled?: boolean
    display_value?: string
    placeholder?: any
    default_value?: number
    get_max_value?: Function
    handle_arrow_navigation?: any
} & Record<string, any>
