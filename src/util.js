import escape_regex from 'escape-string-regexp'
export {default as escape_regex} from 'escape-string-regexp'
import {createFocusTrap} from 'focus-trap'

export const round = n => Math.round(n * 10) / 10
export const ar_nums = s => ('' + s).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'.substr(+d, 1))
export const ar_nums_fmt = num => Intl.NumberFormat('ar-SA').format(num)
export const fmt_num = n => document.documentElement.lang === 'ar' ? ar_nums(n) : n
export const fmt_date = d => (new Date(d)).toLocaleString('en-UK')
export const fmt_time = s => (new Date(s * 1000).toISOString().slice(10, 19)).replace(/T(00:)?/, '')
export const en_nums = s => s.replace(/[٠-٩]/g, d => d.charCodeAt(0) - 0x660)
export const strip_harakat = s => ('' + s).replace(/[ً-ْۖ-ٰۜ]/g, '')
export const now_hours = () => ms_to_hours(Date.now())
export const clone_object = o => JSON.parse(JSON.stringify(o))
export const int_clamp = (int, min, max) => Math.max(Math.min(int, max), min)
export const int_clamp_loop = (int, min, max) => int < min ? max : int > max ? min : int
export function debounce(fn, timeout) {
    let timeout_id
    return (...args) => {
        clearTimeout(timeout_id)
        timeout_id = setTimeout(() => fn(...args), timeout)
    }
}
export function throttle(fn, limit) {
    let last_fn
    let last_ran = Date.now() - (limit + 1)
    return function(...args) {
        clearTimeout(last_fn)
        last_fn = setTimeout(() => {
            fn(...args)
            last_ran = Date.now()
        }, limit - (Date.now() - last_ran))
    }
}
export function split(string, delimiter, n) {
    const parts = string.split(delimiter)
    return [...parts.slice(0, n - 1), parts.slice(n - 1).join(delimiter)]
}
export const add_tatweel = s => s.replace(/([بت-خس-غف-نهي][ً-ْ]*)(?=[ء-ي])/g, '$1ـ').replaceAll('لـا', 'لا')
export const honorifics_list = 'ﷻ﵎﷾﷿|ﷺ﵊﵌|﵇﵍﵈﵉|﵁﵂﵃﵄﵅|﵀﵏|﷽'.split('|')

export function html_entities(s) {
    const repls = {'&': '&amp;', '<': '&lt;', '>': '&gt;'}
    return s.replace(RegExp(`[${Object.keys(repls).join('')}]`, 'g'), m => repls[m])
}

export function shuffle(ar) {
    ar = [...ar]
    for (let j, x, i = ar.length; i; j = parseInt(Math.random() * i), x = ar[--i], ar[i] = ar[j], ar[j] = x);
    return ar
}

export function get_image_xy(src) {
    const img = new Image
    img.src = src
    return new Promise(resolve => img.onload = () => resolve({x: img.width, y: img.height}))
}
// For virtualListDynamic
export function max_supported_height() {
    const div = Object.assign(document.createElement('div'), {
        innerHTML: '<div style="height: 1e9px"></div>',
        style: 'position: absolute; height: 1px; opacity: 0',
    })
    document.body.appendChild(div)
    const height = div.firstChild.offsetHeight || 17895697 // Workaround for Firefox
    div.remove()
    return height
}
export function median(values) {
    const array = [...values].sort((a, b) => a - b)
    const middle = Math.floor(array.length / 2)
    return array.length % 2 ? array[middle] : (array[middle - 1] + array[middle]) / 2.0
}
export function repeat_click(el, callback) {
    let repeat_interval
    function click_wrapper(e) {
        cleanup()
        if (window._useragent.ios) // Prevent text selection
            e.preventDefault()
        callback()
        repeat_interval = setInterval(() => callback(), 150)
    }
    // Use instead of pointer* events since e.preventDefault doesn't work on them
    const [start_ev, end_ev] = window._useragent.is_touch ? ['touchstart', 'touchend'] : ['mousedown', 'mouseup']
    const cleanup = () => clearInterval(repeat_interval)
    el.addEventListener(start_ev, click_wrapper)
    document.documentElement.addEventListener(end_ev, cleanup)
    return {
        destroy() {
            document.documentElement.removeEventListener(end_ev, cleanup)
        }
    }
}

export function get_vh_offset() {
    const div = create_el('div', {style: 'position: absolute; height: 100vh'})
    document.body.appendChild(div)
    const {clientHeight} = div
    div.remove()
    return clientHeight - window.innerHeight
}
export function set_top_offset(el, visible=true) {
    function update(visible=true) {
        if (el && visible)
            setTimeout(() => {
                el.style.setProperty('--top-offset', `${el.getBoundingClientRect().top + 5 + window._VH_OFFSET}px`)
            }, 15)
    }
    if (visible)
        update(visible)
    return {update}
}
export function append_to(el, cont) {
    function update(cont) {
        if (el.parentElement !== cont)
            cont.appendChild(el)
    }
    update(cont)
    return {update}
}
export function init_useragent_info() {
    const UA = navigator.userAgent
    const doc_classes = document.documentElement.classList
    window._useragent = {
        ios: /iPad|iPhone|iPod/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
        safari: 'GestureEvent' in window,
        pwa: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone,
        is_touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0,
    }
    if (window._useragent.safari)
        doc_classes.add('safari')

    if (window._useragent.ios)
        doc_classes.add('ios')

    if (UA.includes('Firefox'))
        doc_classes.add('firefox')

    if (/Windows NT|Intel Mac OS X/.test(UA))
        doc_classes.add('non-mobile')
    else if (/Android.*Chrome\//.test(UA))
        doc_classes.add('chrome-android')
}
export function add_tab_check() {
    window.addEventListener('keydown', function check_tab(e) {
        if (e.key === 'Tab') {
            document.documentElement.classList.add('user-is-tabbing')
            window.removeEventListener('keydown', check_tab)
        }
    })
}

export const unescape_str = s => s.replace(/(^|[^\\])\\(n|t|u[0-9a-f]{4})/g, (m, m1, m2) => JSON.parse(`"\\${m2}"`))
export function add_zwj(str) {
    return window._useragent?.safari ? str.replace(/([ئبت-خس-غف-نهيی])([^ء-يی\n ]*<[^>]+>[ً-ْٰۖۗۚۛۜ]*)(?=[آ-يی])/g, '$1&zwj;$2&zwj;') : str
}
export const multi_match_map = {ا: 'اأآإى', أ: 'أإءؤئ', ء: 'ءأإؤئ', ت: 'تة', ة: 'ةته', ه: 'هة', ى: 'ىاي', ي: 'يى'}
export const multi_match_re = RegExp(`[${Object.keys(multi_match_map).join('')}]`, 'g')
export function prep_ar_query(q) {
    q = escape_regex(strip_harakat(q)).replace(/[ء-يّ]/g, '$&[ً-ْ]*')
    // 'g' isn't usually needed since we only .test, but if highlighting we need 'g'
    return RegExp(q.replace(multi_match_re, m => `[${multi_match_map[m]}]`), 'g')
}

export function prep_ar_query_gapped(q, strip_regex = /[^\p{sc=Arabic}\p{N} ]/gu) {
    q = q.replace(strip_regex, '').trim()
    return RegExp(q.replace(/\s+/g, '.*?').replace(multi_match_re, m => `[${multi_match_map[m]}]`))
}
export function highlight_gapped(qry, str) {
    if (qry instanceof RegExp ? qry.source === '(?:)' : !qry)
        return str // An empty regex will match every char
    const parts = qry instanceof RegExp ? qry.source.split('.*?') : qry.split(' ')
    // Avoid highlighting short strings globally, as it adds noise
    return add_zwj(parts.reduce((acc, s) => acc.replace(RegExp(s, 'i' + (s.length > 2 ? 'g' : '')), '<mark>$&</mark>'), str))
}
export function highlight(qry, str, prep_query, should_prep_query = true) {
    // Note: if qry matches many chars it'll create many <mark> tags which can affect perf
    if (!qry)
        return str
    qry = qry instanceof RegExp || !should_prep_query ? qry : prep_ar_query(qry)
    return add_zwj(str.replace(qry, '<mark>$&</mark>'))
}

export function basic_searcher(q, str) {
    if (q instanceof RegExp) {
        q.lastIndex = 0 // In case it has the g flag set
        return q.test(str)
    }
    else
        return str.toLowerCase().includes(q.toLowerCase())
}
export function filterer(query, items, filter, should_prep_query = true) {
    // filter can be a fn, an array of keys to search, or unset
    const filter_fn = Array.isArray(filter)
        ? (q, item) => filter.some(key => basic_searcher(q, item[key] || ''))
        : filter || basic_searcher

    if (!items.length) {
        console.warn('No items')
        return items
    }
    if (!query)
        return items

    if (should_prep_query && /[ء-ي]/.test(query))
        query = prep_ar_query(query)
    let matches = []
    for (let i = 0, l = items.length; i < l; i++) {
        if (filter_fn(query, items[i]))
            matches.push(items[i])
    }
    return matches
}

export const harakat_prep = s => RegExp(s.replace(/[ء-يّ]/g, '$&[ً-ْ]*'), 'g')
export const rand_id = () => Math.random().toString(16).slice(2, 8)
export function for_next(el) {
    const next_el = el.nextElementSibling
    if (!['input', 'textarea', 'select'].includes(next_el.tagName.toLowerCase())) {
        console.warn(next_el + ' is not a valid for element')
        return
    }

    const id = next_el.id || 'uid-' + rand_id()
    next_el.id = id
    el.htmlFor = id
}

export function copy_text(text, avoid_clipboard) { // avoid_clipboard is for android webview
    if ('clipboard' in navigator && !avoid_clipboard) {
        if (typeof text?.then === 'function') {
            if (window._useragent.safari)
                return navigator.clipboard.write([
                    new ClipboardItem({'text/plain': text}),
                ])
            return text.then(t => navigator.clipboard.writeText(t))
        }
        else
            return navigator.clipboard.writeText(text)
    }
    else {
        const ta = document.createElement('textarea')
        Object.assign(ta, {value: text, style: 'position: fixed; top: -9999em'})
        document.body.appendChild(ta)
        if (window._useragent.ios) {
            const range = document.createRange()
            getSelection().removeAllRanges()
            range.selectNode(ta)
            getSelection().addRange(range)
        }
        else
            ta.select()
        document.execCommand('copy')
        ta.remove()
        if (window._useragent.ios)
            getSelection().removeAllRanges()
    }
}
export const create_el = (tag, attrs) => Object.assign(document.createElement(tag), attrs)
export const on = (object, ev, cb) => object.addEventListener(ev, cb, false)
export const off = (object, ev, cb) => object.removeEventListener(ev, cb, false)
export const get_x_offset_percent = e => (e.currentTarget.offsetWidth - e.offsetX) / e.currentTarget.offsetWidth
export const el_index = el => [...el.parentElement.children].indexOf(el)

export const insert_str_at = (str, i, sub, ln) => str.slice(0, i) + sub + str.slice(i + ln)
export const apply_repls = (s, repls) => repls.reduce((str, repl) => str[repl[0] instanceof RegExp ? 'replace' : 'replaceAll'](repl[0], repl[1]), s)

export function separate_diff(diff, OMITTED_TEXT_MARKER = '\n...\n') {
    const text = {old: '', new: ''}
    for (let line of diff.split('\n')) {
        if (/^(diff|index|--- a\/|\+\+\+ b\/)/.test(line))
            continue
        if (line.startsWith('@@')) {
            if (text.old || text.new) {
                text.old += OMITTED_TEXT_MARKER
                text.new += OMITTED_TEXT_MARKER
            }
            continue
        }
        if (/^[-+ ]/.test(line)) {
            const first = line[0]
            line = line.slice(1) + '\n'
            if (first === ' ') {
                text.old += line
                text.new += line
            }
            else if (first === '-')
                text.old += line
            else if (first === '+')
                text.new += line
        }
    }
    return text
}

export async function eval_script(script_text) { // eval pollutes scope
    const blob = new Blob([script_text], {type: 'application/javascript'})
    const url = URL.createObjectURL(blob)
    const module = await import(/* @vite-ignore */ url)
    URL.revokeObjectURL(url)
    return module
}
export function resize_textarea(el) {
    if (CSS.supports('field-sizing: content')) {
        el.style.setProperty('field-sizing', 'content')
        return
    }
    function resize(el) {
        el.style.height = ''
        el.style.height = 5 + el.scrollHeight + 'px'
    }
    const resize_debounced = debounce(e => resize(e.target), 100)
    el.addEventListener('input', resize_debounced)
    resize(el)
    return () => {
        el.removeEventListener('input', resize_debounced)
    }
}
export function on_key(el, props) {
    el.addEventListener('keydown', e => {
        if (e.key in props)
            props[e.key](e)
    })
}
// Filter out buttons
export const form_to_json = form => Object.fromEntries([...form.elements].filter(el => el.matches('input,textarea,select')).map(el => [el.name, el.value]))

export async function sha1(msg) {
    const msgUint8 = new TextEncoder().encode(msg)
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8)
    const hashArray = [...new Uint8Array(hashBuffer)]
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function remove_props(obj, props) {
    obj = {...obj}
    props.forEach(prop => {
        delete obj[prop]
    })
    return obj
}
export function longest_consecutive_sequence(nums) {
    if (!nums.length)
        return 0

    nums = [...nums].sort((a, b) => a - b)
    let curr_length = 1
    let seq_length = 1
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] - nums[i - 1] === 1)
            curr_length++
        else if (nums[i] - nums[i - 1] > 1) {
            seq_length = Math.max(curr_length, seq_length)
            curr_length = 1
        }
    }

    return seq_length
}
export const get_items_by_keys = (keys, o) => Object.fromEntries(keys.filter(k => k in o).map(k => [k, o[k]]))
export const to_id_map = data => Object.fromEntries(data.map(f => [f.id, f]))
export const url_params = s => Object.fromEntries(new URLSearchParams(s).entries())

export function set_title(t) {
    document.title = (t ? (t + ' | ') : '') + window.BASE_TITLE
}

export function focus_trap(node, options) {
    const trap = createFocusTrap(node, options)
    trap.activate()
    return {
        destroy() {
            trap.deactivate()
        },
    }
}
export function in_view(node, params = {}) {
    let observer

    const handleIntersect = (e) => {
        node.dispatchEvent(new CustomEvent(e[0].isIntersecting ? 'enter' : 'exit'))
    }

    function setObserver({ root, top, bottom }) {
        const marginTop = top ? top * -1 : 0
        const marginBottom = bottom ? bottom * -1 : 0
        const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`
        const options = { root, rootMargin }
        observer?.disconnect()
        observer = new IntersectionObserver(handleIntersect, options)
        observer.observe(node)
    }

    setObserver(params)

    return {
        update: setObserver,
        destroy() {
            observer?.disconnect()
        },
    }
}

export function download_blob(data, file_name, mime_type) {
    if (!mime_type)
        mime_type = ({txt: 'text/plain', json: 'application/json'})[file_name.split('.').pop().toLowerCase()]
    const blob = new Blob([data], {type: mime_type})
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement('a'), {href: url, download: file_name, hidden: true})
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
}
/**
 * Reads a file and returns its content as a Promise.
 *
 * @param {File} file - The file to be read.
 * @param {('Text'|'BinaryString'|'DataURL'|'ArrayBuffer')} [read_as='Text'] - The format to read the file as. (default: 'Text')
 * @returns {Promise<string|ArrayBuffer>} A Promise that resolves with the file's content in the specified format.
 * @throws Will throw an error if the reading process fails.
 */
export function read_file(file, read_as = 'Text') {
    return new Promise((resolve, reject) => {
        const reader = new FileReader
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.onerror = reject
        reader['readAs' + read_as](file)
    })
}

export async function cache_first(url, cache_name = 'app-cache') {
    const cache = await caches.open(cache_name)
    return await cache.match(url) || await fetch(url).then(res => {
        cache.put(url, res.clone())
        return res
    })
}

export function split_text(text, num_of_parts=4, split_by='\n\n\n') {
    // used by collab before codemirror as each file was multiple tabs
    const l = text.length
    const part_l = Math.floor(l / num_of_parts)
    const parts = []
    const split_by_len = split_by.length
    for (let i = 1; i < num_of_parts; i++) {
        let offset = part_l
        while (text.substr(offset, split_by_len) !== split_by && offset < l)
            offset++
        if (offset === l)
            break
        parts.push(text.slice(0, offset))
        text = text.slice(offset + split_by_len)
    }
    parts.push(text)
    return parts
}

export function open_window(component, props, options={}) {
    const popup = open('about:blank', '_blank', 'width=800,height=1200,resizable', false)
    popup.addEventListener('beforeunload', () => {
        popup._component?.$destroy()
    })
    if (options.append_css ?? true) {
        ;[...document.querySelectorAll('link[rel="stylesheet"], style')].forEach(el => {
            const attrs_names = {LINK: ['rel', 'href'], STYLE: ['id', 'innerHTML']}
            const attrs = get_items_by_keys(attrs_names[el.tagName], el)
            popup.document.head.appendChild(create_el(el.tagName, attrs))
        })
    }
    const cont = popup.document.createElement('main')
    popup._component = new component({props, target: cont})
    popup.document.body.appendChild(cont)
    return popup
}

export async function archive_book_images(id, file) {
    const {server, dir} = await fetch('https://archive.org/metadata/' + id).then(r => r.json())
    const url_base = `https://${server}/BookReader/BookReader`
    const params = {id, subPrefix: file, server, itemPath: dir, format: 'json'}
    const img_metadata_url = url_base + `JSIA.php?` + new URLSearchParams(params)
    const img_metadata = (await fetch(img_metadata_url).then(r => r.json())).data.brOptions.data.flat()

    return {
        get_img: (i, scale=1) => url_base + `Images.php?` + new URLSearchParams({
            id,
            zip: `${dir}/${file}_jp2.zip`,
            file: `${file}_jp2/${file}_${i.toString().padStart(4, '0')}.jp2`,
            scale,
        }),
        sizes: img_metadata.map(x => [x.width, x.height]),
        count: img_metadata.length,
    }
}

export async function clear_sw_and_caches() {
    for (const reg of await navigator.serviceWorker.getRegistrations())
        await reg.unregister()
    await Promise.all((await caches.keys()).map(k => caches.delete(k)))
}

/**
 * Prepares a proxy configuration object for vite from an array of [path, target] pairs.
 *
 * @param {Array<[string, string]>} proxies An array of [path, target] pairs.
 * Each sub-array should contain two strings: the path to proxy and the target URL to proxy to.
 *
 * @returns {object} A proxy configuration object.
 */
export function prep_vite_proxy(proxies) {
    return Object.fromEntries(proxies.map(([path, target]) => [
        path,
        {
            target,
            rewrite: p => p.replace(RegExp(`^${path}`), ''),
            changeOrigin: true,
            secure: false,
        },
    ]))
}

/**
 * Uses Intl.RelativeTimeFormat to format the relative time between two dates.
 *
 * @param {Intl.RelativeTimeFormat} rtf
 * @param {Date} d1
 * @param {Date} d2
 */
export function relative_time(rtf, d1, d2=new Date) {
    const units = [
        ['year',   31536000],
        ['month',  2628000],
        ['day',    86400],
        ['hour',   3600],
        ['minute', 60],
        ['second', 1],
    ]
    const elapsed = (d1 - d2) / 1e3
    const elapsed_abs = Math.max(Math.abs(elapsed), 1000) // In case < 1 second
    const [unit, value] = units.find(([, value]) => elapsed_abs >= value)
    return rtf.format(Math.round(elapsed / value), unit)
}
