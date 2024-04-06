const translate = (map, val) => map.reduce((v, p) => v.replaceAll(p[0], p[1]), val)
const preprocess_repls = [
    // Replace shaddah with letter preceding it
    [/([ء-ي])ّ/g, '$1$1'],

    // Remove dagger-alif preceded by alif maksoorah
    [/ىٰ/g, 'ى'],
    // Remove fatha followed by alif
    [/َا/g, 'ا'],

    // Add kasrah to alif with hamzah below
    [/إ[^ِ]/g, 'إِ$1'],

    // Remove alif after waaw al-jama'ah
    [/وْ?ا( |$)/g, 'و$1'],

    // Remove alif after tanween fath
    [/ًا/g, 'ً'],
]
const map = [
    ["ً", ""], ["ٌ", ""], ["ٍ", ""], ["ّ", ""], ["ْ", ""], ["ُ", "u"], ["َ", "a"], ["ِ", "i"],

    ["ٰ", "ا"],

    ["ء", "a"], ["آ", "aa"], ["أ", "a"], ["ؤ", "a"], ["إ", "i"], ["ئ", "a"], ["ا", "a"], ["ب", "b"], ["ة", "ah"], ["ت", "t"],
    ["ث", "th"], ["ج", "j"], ["ح", "h"], ["خ", "kh"], ["د", "d"], ["ذ", "th"], ["ر", "r"], ["ز", "z"], ["س", "s"], ["ش", "sh"],
    ["ص", "s"], ["ض", "d"], ["ط", "t"], ["ظ", "dh"], ["ع", "a"], ["غ", "gh"], ["ـ", "_"], ["ف", "f"], ["ق", "q"], ["ك", "k"],
    ["ل", "l"], ["م", "m"], ["ن", "n"], ["ه", "h"], ["و", "w"], ["ى", "a"], ["ي", "y"]
]

export default function slugify(val) {
    val = translate(map, val)
    preprocess_repls.forEach(r => val = val.replace(r[0], r[1]))
    return val
}
