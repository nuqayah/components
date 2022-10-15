import escape_regex from 'escape-string-regexp'

export const round = n => Math.round(n * 10) / 10
export const ar_nums = s => ('' + s).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'.substr(+d, 1))
export const ar_nums_fmt = num => Intl.NumberFormat('ar-SA').format(num)
export const en_nums = s => s.replace(/[٠-٩]/g, d => d.charCodeAt(0) - 0x660)
export const strip_harakat = s => ('' + s).replace(/[ً-ْۖ-ٰۜ]/g, '')
export const now_hours = () => ms_to_hours(Date.now())
export const clone_object = o => JSON.parse(JSON.stringify(o))
export const int_clamp = (int, min, max) => Math.max(Math.min(int, max), min)
export function debounce(fn, timeout) {
    let timeout_id
    return (...args) => {
        clearTimeout(timeout_id)
        timeout_id = setTimeout(() => fn(...args), timeout)
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
export function median(vals) {
    // TODO: shouldn't have side-effects
    vals.sort((a, b) => a - b)
    const mid = Math.floor(vals.length / 2)
    return vals.length % 2 ? vals[mid] : (vals[mid - 1] + vals[mid]) / 2.0
}
export function repeat_click(el, callback) {
    let repeat_interval
    function click_wrapper(e) {
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

export function set_top_offset(el, visible=true) {
    function update(visible=true, offset=5) {
        if (el && visible)
            setTimeout(() => {
                el.style.setProperty('--top-offset', `${el.getBoundingClientRect().top + offset + window._VH_OFFSET}px`)
            }, 0)
    }
    if (visible)
        update(visible)
    return {update}
}
export const unescape_str = s => s.replace(/(?<!\\)\\(n|t|u[0-9a-f]{4})/g, m => JSON.parse(`"${m}"`))
export function add_zwj(str) {
    return window._useragent?.safari ? str.replace(/([ئبت-خس-غف-نهي])([^ء-ي ]*<[^>]+>[ً-ْٰۖۗۚۛۜ]*)(?=[آ-ي])/g, '$1&zwj;$2&zwj;') : str
}
export const multi_match_map = {ا: 'اأآإى', أ: 'أإءؤئ', ء: 'ءأإؤئ', ت: 'تة', ة: 'ةته', ه: 'هة', ى: 'ىاي', ي: 'يى'}
export const multi_match_re = RegExp(`[${Object.keys(multi_match_map).join('')}]`, 'g')
export function prep_ar_query(q) {
    q = escape_regex(strip_harakat(q)).replace(/[ء-يّ]/g, '$&[ً-ْ]*')
    // 'g' isn't usually needed since we only .test, but if highlighting we need 'g'
    return RegExp(q.replace(multi_match_re, m => `[${multi_match_map[m]}]`), 'g')
}
export const highlight = (qry, str) => add_zwj(str.replace(prep_ar_query(qry), '<mark>$&</mark>'))

export function basic_searcher(q, str) {
    if (q instanceof RegExp) {
        q.lastIndex = 0 // In case it has the g flag set
        return q.test(str)
    }
    else
        return str.includes(q)
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

export function copy_text(text) {
    if ('clipboard' in navigator)
        return navigator.clipboard.writeText(text)
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
export const apply_repls = (s, repls) => repls.reduce((a, b) => a[b[2] ? 'replaceAll' : 'replace'](b[0], b[1]), s)

export function separate_diff(diff) {
    const text = {old: '', new: ''}
    for (let line of diff.split('\n')) {
        if (/^(diff|index|--- a\/|\+\+\+ b\/)/.test(line))
            continue
        if (line.startsWith('@@')) {
            if (text.old || text.new) {
                text.old += '\n...\n'
                text.new += '\n...\n'
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

export async function eval_script(script_text) {
    const blob = new Blob([script_text], {type: 'application/javascript'})
    const url = URL.createObjectURL(blob)
    const script_el = create_el('script', {type: 'module', src: url})
    document.body.appendChild(script_el)
    const module = await import(/* @vite-ignore */ url)
    script_el.remove()
    URL.revokeObjectURL(url)
    return module
}
export function resize_textarea(el) {
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

export async function sha1(msg) {
    const msgUint8 = new TextEncoder().encode(msg)
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8)
    const hashArray = [...new Uint8Array(hashBuffer)]
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function remove_props(obj, props) {
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

export function set_title(t) {
    document.title = (t ? (t + ' | ') : '') + window.BASE_TITLE
}
