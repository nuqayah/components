<section id="page-projects">
    <ul>
        {#each projects as project}
            <li>
                <a target="_blank" href="https://{project.url}"
                    >{project.name}<span>{project.desc}</span><img
                        src="https://{project.url}/app.png"
                        alt
                    /></a
                >
            </li>
        {/each}
    </ul>
</section>

<script>
let projects = $state([
    {url: 'tafsir.app', name: 'الباحث القرآني', desc: 'الأول في تفسير القرآن وعلومه'},
    {url: 'sunnah.one', name: 'الباحث الحديثي', desc: 'بحث سريع في السنة'},
    {url: 'muqri.com', name: 'المقرئ', desc: 'لحفظ القرآن'},
    {url: 'read.tafsir.one', name: 'التفسير التفاعلي', desc: 'استمع إلى أربعة تفاسير'},
    {url: 'takw.in', name: 'تكوين الراسخين', desc: 'منهج شامل للعلوم الشرعية مع شروح ومواد أخرى'},
    {url: 'app.turath.io', name: 'تراث', desc: 'لقراءة تراث علمائنا (من المكتبة الشاملة)'},
    {url: 'qari.app', name: 'القارئ', desc: 'للاستماع إلى القرآن'},
    {url: 'muhaffidh.app', name: 'المصحف المحفظ', desc: 'مصحف يعين على حفظ القرآن ومراجعته'},
    {url: 'quizzer.one', name: 'منصة سؤال', desc: 'اختبارات تعليمية ماتعة'},
    {url: 'kalimah.app', name: 'كلمة', desc: 'اختبر نفسك في غريب القرآن'},
    {url: 'mutoon.one', name: 'مقرئ المتون', desc: 'لحفظ المتون'},
])
fetch('https://nuqayah.com/projects.json')
    .then(r => r.json())
    .then(json => {
        projects = json
    })
export const title = 'مشاريع «نقاية»'
</script>

<style>
ul {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    margin: 0 auto;
    padding: 0;
    max-width: 500px;
    justify-content: center;
}
ul li {
    flex: 0 0 33%;
    margin: 5px 5px;
    flex-basis: 135px;
}
li > a {
    height: 100%;
    display: flex;
    padding: 0.8rem 0.3rem 0.8rem;
    text-align: center;
    border-radius: 4px;
    box-shadow: 0 0 12px 0 #eee;
    text-decoration: none;
    flex-direction: column;
    justify-content: space-between;
    background: #ffffff96;
}
a span {
    font-size: 0.9rem;
    color: #999;
}
img {
    max-width: 2rem;
    display: block;
    margin: 0 auto;
}
</style>
