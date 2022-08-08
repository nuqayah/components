import {debounce} from 'components/src/util.js'

const strip_harakat = s => ('' + s).replace(/[ً-ْۖ-ٰۜ]/g, '')
const multi_match_map = {ا: 'اأآإى', أ: 'أإءؤئ', ء: 'ءأإؤئ', ت: 'تة', ة: 'ةته', ه: 'هة', ى: 'ىاي', ي: 'يى'}
const multi_match_re = RegExp(`[${Object.keys(multi_match_map).join('')}]`, 'g')
const escape_regex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function prep_ar_query(q) {
    q = escape_regex(strip_harakat(q)).replace(/[ء-يّ]/g, '$&[ً-ْ]*')
    // 'g' isn't usually needed since we only .test, but if highlighting we need 'g'
    return RegExp(q.replace(multi_match_re, m => `[${multi_match_map[m]}]`), 'g')
}
const basic_searcher = (item, q) => q instanceof RegExp ? q.test(item) : item.includes(q)

export function filterer(el, props) {
    let items
    let matches
    let prepare_query
    let filter
    let callback
    function update(props) {
        items = props.items || ([])
        matches = props.matches || ([])
        prepare_query = props.prepare_query || (q => /[ء-ي]/.test(q) ? prep_ar_query(q) : q)
        filter = props.search_keys
            ? (item, q) => props.search_keys.some(key => basic_searcher(item[key] || '', q))
            : props.filter || basic_searcher
        callback = props.callback || (() => {})
    }
    update(props)

    function search(e) {
        let query = e.target.value
        if (!items.length) {
            console.warn('No items')
            return
        }
        if (!query) {
            callback(items)
            return
        }

        matches = []
        const prepped_query = prepare_query(query)
        for (let i = 0, l = items.length; i < l; i++) {
            if (filter(items[i], prepped_query))
                matches.push(items[i])
        }
        callback(matches, prepped_query)
    }
    const cb = debounce(search, 100)
    el.addEventListener('input', cb)

    return {
        destroy() {
            el.removeEventListener('input', cb)
        },
        update,
    }
}
