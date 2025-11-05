declare global {
    interface Window {
        _useragent?: {
            ios: boolean
            safari: boolean
            pwa: boolean
            is_touch: boolean
        }
        BASE_TITLE?: string
        _VH_OFFSET?: number
    }

    interface Navigator {
        readonly msMaxTouchPoints?: number
        readonly standalone?: boolean
    }
}

export {}
