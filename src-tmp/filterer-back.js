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
// const basic_searcher = (item, q) => q instanceof RegExp ? q.test(item) : item.includes(q)
function basic_searcher(item, q) {
    if (q instanceof RegExp) {
        q.lastIndex = 0
        return q.test(item)
    }
    else
        return item.includes(q)
}

export function filterer(el, props) {
    function update(props_) {
        props = {
            items: [],
            prepare_query: q => /[ء-ي]/.test(q) ? prep_ar_query(q) : q,
            filter: props_.search_keys
                ? (item, q) => props_.search_keys.some(key => basic_searcher(item[key] || '', q))
                : props_.filter || basic_searcher,
            callback() {},
            ...props_,
        }
    }
    update(props)

    function search(e) {
        let query = e.target.value
        if (!props.items.length) {
            console.warn('No items')
            return
        }
        if (!query) {
            props.prepare_query('')
            props.callback(items)
            return
        }

        let matches = []
        const prepped_query = props.prepare_query(query)
        for (let i = 0, l = items.length; i < l; i++) {
            if (props.filter(items[i], prepped_query))
                matches.push(items[i])
        }
        props.callback(matches, prepped_query)
    }
    const cb = debounce(search, 100)
    el.addEventListener('input', cb)

    return {
        update,
        destroy() {
            el.removeEventListener('input', cb)
        },
    }
}
