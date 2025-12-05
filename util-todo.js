
// // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // 


// // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // 

export function get_clicked_word(range, e) {
    const txt = range.startContainer.wholeText
    if (!txt.includes(' '))
        return txt

    const start = txt.lastIndexOf(' ', range.startOffset)
    const end = txt.indexOf(' ', range.startOffset)
    return txt.slice(start > -1 ? start + 1 : 0, end > -1 ? end : txt.length)
}
function ghareeb_tip(e) {
    const el = e.target
    if ((!el.matches('.edit-title') && !el.parentElement.matches('.edit-title')) || el.matches('.more-link'))
        return
    const sel = getSelection()
    document.caretPositionFromPoint = document.caretPositionFromPoint || document.caretRangeFromPoint // only fx uses the standard name
    const range = is_safari ? document.caretPositionFromPoint(e.clientX, e.clientY) : sel.getRangeAt(0)
    let w = sel.isCollapsed ? get_clicked_word(range, e) : sel.toString().trim()
    w = w.replace(/[^ء-ي ]/g, '')
    if (!w || w.includes(' '))
        return
    show_tip(`<button class="ghareeb-search" data-word="${w}">ابحث عن «${w}» في كتب غريب الحديث</button>`, range.getClientRects()[0])
}
$('#results').on('dblclick', ghareeb_tip)
if (is_safari) {
    let second = false
    $('#results').on('click', e => {
        if (second)
            ghareeb_tip(e)
        second = true
        setTimeout(() => second = false, 300)
    })
}

// // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // 

export function scroll_to_selection() {
    if (!show_preview || !getSelection().toString().trim())
        return
    const sel = getSelection().toString().trim().replace(/\*/g, '')
    iframe.contentWindow.find(sel, true, false, true, false, false)
}


// // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // 



// // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // 

