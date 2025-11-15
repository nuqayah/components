/**
 * @template {unknown[]} T
 * @param {(...args: T) => unknown} fn
 * @param {number} timeout
 */
export function debounce<T extends unknown[]>(
    fn: (...args: T) => unknown,
    timeout: number,
): (...args: T) => void
/**
 * @param {string} string
 * @param {string} delimiter
 * @param {number} n
 */
export function split(string: string, delimiter: string, n: number): string[]
/** @param {string} s */
export function html_entities(s: string): string
/**
 * @template T
 * @param {Iterable<T>} elements
 */
export function shuffle<T>(elements: Iterable<T>): T[]
/**
 * @param {string} src
 * @returns {Promise<{x: number, y: number}>}
 */
export function get_image_xy(src: string): Promise<{
    x: number
    y: number
}>
export function max_supported_height(): number
/** @param {Iterable<number>} values */
export function median(values: Iterable<number>): number
/**
 * @param {EventTarget} el
 * @param {(click_count: number) => void} callback
 */
export function repeat_click(
    el: EventTarget,
    callback: (click_count: number) => void,
): {
    destroy(): void
}
export function get_vh_offset(): number
/** @param {HTMLElement} el */
export function set_top_offset(
    el: HTMLElement,
    visible?: boolean,
): {
    update: (visible?: boolean) => void
}
/**
 * @param {Node} el
 * @param {Node} cont
 */
export function append_to(
    el: Node,
    cont: Node,
): {
    update: (cont: Node) => void
}
export function init_useragent_info(): void
export function add_tab_check(): void
/** @param {string} str */
export function add_zwj(str: string): string
/** @param {string} q */
export function prep_ar_query(q: string): RegExp
/**
 * @param {string} q
 * @param {string | RegExp} [strip_regex]
 */
export function prep_ar_query_gapped(q: string, strip_regex?: string | RegExp): RegExp
/**
 * @param {string | RegExp} qry
 * @param {string} str
 */
export function highlight_gapped(qry: string | RegExp, str: string): string
/**
 * @param {string | RegExp} qry
 * @param {string} str
 * @param {(q: string) => string} prep_query
 * @param {boolean} [should_prep_query]
 */
export function highlight(
    qry: string | RegExp,
    str: string,
    prep_query: (q: string) => string,
    should_prep_query?: boolean,
): string
/**
 * @param {string | RegExp} q
 * @param {string} str
 */
export function basic_searcher(q: string | RegExp, str: string): boolean
/**
 * @param {string} query
 * @param {string[]} items
 * @param {(query: string | RegExp, item: string) => boolean} filter
 * @param {boolean} [should_prep_query]
 */
export function filterer(
    query: string,
    items: string[],
    filter: (query: string | RegExp, item: string) => boolean,
    should_prep_query?: boolean,
): string[]
/** @param {HTMLLabelElement} el */
export function for_next(el: HTMLLabelElement): void
/**
 * @param {string | PromiseLike<string>} text
 * @param {boolean} [avoid_clipboard]
 */
export function copy_text(
    text: string | PromiseLike<string>,
    avoid_clipboard?: boolean,
): PromiseLike<void>
/**
 * @param {string} diff
 * @param {string} [OMITTED_TEXT_MARKER]
 */
export function separate_diff(
    diff: string,
    OMITTED_TEXT_MARKER?: string,
): {
    old: string
    new: string
}
/** @param {string} script_text */
export function eval_script(script_text: string): Promise<any>
/** @param {HTMLTextAreaElement} el */
export function resize_textarea(el: HTMLTextAreaElement): () => void
/**
 * @param {HTMLElement} el
 * @param {Record<string, (e: KeyboardEvent) => void>} props
 */
export function on_key(el: HTMLElement, props: Record<string, (e: KeyboardEvent) => void>): void
/** @param {string} msg */
export function sha1(msg: string): Promise<string>
/**
 * @param {object} obj
 * @param {PropertyKey[]} props
 */
export function remove_props(obj: object, props: PropertyKey[]): any
/** @param {number[]} nums */
export function longest_consecutive_sequence(nums: number[]): number
/** @param {string} [t] */
export function set_title(t?: string): void
/**
 * @param {HTMLElement | SVGElement | string | Array<HTMLElement | SVGElement | string>} node
 * @param {import('focus-trap').Options} [options]
 */
export function focus_trap(
    node: HTMLElement | SVGElement | string | Array<HTMLElement | SVGElement | string>,
    options?: import('focus-trap').Options,
): {
    destroy(): void
}
/**
 * @typedef {Object} InViewParams
 * @property {Element | Document | null} [root]
 * @property {number} [top]
 * @property {number} [bottom]
 */
/**
 * @param {Element} node
 * @param {InViewParams} [params]
 */
export function in_view(
    node: Element,
    params?: InViewParams,
): {
    update: ({root, top, bottom}: InViewParams) => void
    destroy(): void
}
/**
 * @param {string} url
 * @param {Record<string, unknown>} [attrs]
 */
export function click_link(url: string, attrs?: Record<string, unknown>): void
/**
 * @param {BlobPart} data
 * @param {string} file_name
 * @param {string} [mime_type]
 */
export function download_blob(data: BlobPart, file_name: string, mime_type?: string): void
/**
 * Reads a file and returns its content as a Promise.
 *
 * @param {File} file - The file to be read.
 * @param {'Text' | 'BinaryString' | 'DataURL' | 'ArrayBuffer'} [read_as] - The format to read the file as. (default: 'Text')
 * @returns {Promise<string | ArrayBuffer>} A Promise that resolves with the file's content in the specified format.
 * @throws an error if the reading process fails.
 */
export function read_file(
    file: File,
    read_as?: 'Text' | 'BinaryString' | 'DataURL' | 'ArrayBuffer',
): Promise<string | ArrayBuffer>
/**
 * @param {RequestInfo | URL} url
 * @param {string} [cache_name]
 */
export function cache_first(url: RequestInfo | URL, cache_name?: string): Promise<Response>
/**
 * @param {string} text
 * @param {number} [num_of_parts]
 * @param {string} [split_by]
 */
export function split_text(text: string, num_of_parts?: number, split_by?: string): string[]
/**
 * @template TProps
 * @param {import('svelte').Component<TProps>} component
 * @param {TProps} props
 * @param {object} [options]
 * @param {boolean} [options.append_css]
 */
export function open_window<TProps>(
    component: import('svelte').Component<TProps>,
    props: TProps,
    options?: {
        append_css?: boolean
    },
): Window
/**
 * @param {string} id
 * @param {string} file
 */
export function archive_book_images(
    id: string,
    file: string,
): Promise<{
    /**
     * @param {number} i
     * @param {number} [scale]
     */
    get_img: (i: number, scale?: number) => string
    sizes: any
    count: any
}>
export function clear_sw_and_caches(): Promise<void>
/**
 * Prepares a proxy configuration object for vite from an array of [path, target] pairs.
 *
 * @param {Array<[string, string]>} proxies An array of [path, target] pairs.
 * Each sub-array should contain two strings: the path to proxy and the target URL to proxy to.
 *
 * @returns A proxy configuration object.
 */
export function prep_vite_proxy(proxies: Array<[string, string]>): {
    [k: string]: {
        target: string
        /** @param {string} p */
        rewrite: (p: string) => string
        changeOrigin: boolean
        secure: boolean
    }
}
/**
 * Uses Intl.RelativeTimeFormat to format the relative time between two dates.
 *
 * @param {Intl.RelativeTimeFormat} rtf
 * @param {Date} d1
 * @param {Date} [d2]
 */
export function relative_time(rtf: Intl.RelativeTimeFormat, d1: Date, d2?: Date): string
/**
 * Merge class names
 * @param {...string} inputs - The class names to merge
 * @returns The merged class names
 */
export function cn(...inputs: string[]): string
export {default as ar_slugify} from './ar_slugify.js'
export {default as combobox} from './combobox.js'
export {default as lazy_load} from './lazy_load.js'
export {escape_regex}
export function round(n: number): number
export function ar_nums(s: unknown): string
export function ar_nums_fmt(num: number | bigint): string
export function fmt_num(n: unknown): unknown
export function fmt_date(d: number | string | Date): string
export function fmt_time(s: number): string
export function en_nums(s: string): string
export function strip_harakat(s: unknown): string
export function ms_to_hours(ms: number): number
export function now_hours(): number
export function clone_object(o: unknown): any
export function int_clamp(int: number, min: number, max: number): number
export function int_clamp_loop(int: number, min: number, max: number): number
export function add_tatweel(s: string): string
export const honorifics_list: string[]
export function unescape_str(s: string): string
export namespace multi_match_map {
    let ا: string
    let أ: string
    let ء: string
    let ت: string
    let ة: string
    let ه: string
    let ى: string
    let ي: string
}
export const multi_match_re: RegExp
export function harakat_prep(s: string): RegExp
export function rand_id(): string
export function create_el(tag: string, attrs: Record<string, unknown>): HTMLElement
export function on(object: EventTarget, ev: string, cb: (e: Event) => void): void
export function off(object: EventTarget, ev: string, cb: (e: Event) => void): void
export function get_x_offset_percent(
    e: MouseEvent & {
        currentTarget: HTMLElement
    },
): number
export function el_index(el: Element): number
export function insert_str_at(str: string, i: number, sub: string, ln: number): string
export function apply_repls(s: string, repls: Array<[string | RegExp, string]>): string
export function form_to_json(form: HTMLFormElement): {
    [k: string]: string
}
export function get_items_by_keys(
    keys: PropertyKey[],
    o: object,
): {
    [k: string]: any
}
export function to_id_map<
    T extends {
        id: string | number
    },
>(
    data: T[],
): {
    [k: string]: T
}
export function url_params(s: string[][] | Record<string, string> | string | URLSearchParams): {
    [k: string]: string
}
export type InViewParams = {
    root?: Element | Document | null
    top?: number
    bottom?: number
}
export type ComboboxProps = import('./combobox.js').ComboboxProps
export type LazyLoadProps<T> = import('./lazy_load.js').LazyLoadProps<T>
import escape_regex from 'escape-string-regexp'
