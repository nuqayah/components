{#if sidebarOpen}
    <div
        transition:fade={{duration: 100}}
        class="fixed inset-0 z-40 bg-black bg-opacity-50"
        on:click={() => {
            sidebarOpen = false
        }}
    />
{/if}

<button
    class="my-1.5 rounded-lg px-4 py-1 text-sm hover:text-green-500 lg:hidden"
    type="button"
    on:click={() => (sidebarOpen = true)}
>
    قائمة الوثائق
    <List class="me-[-0.1rem] inline-block " size={20} weight="bold" />
</button>

{#if sidebarOpen}
    <div
        class="fixed right-0 top-14 z-50 h-full min-w-44 overflow-auto bg-white"
        tabindex="-1"
        bind:this={sidebar}
        transition:fly={{x: sidebar.offsetWidth, opacity: 1, duration: 300}}
    >
        <button
            type="button"
            data-drawer-hide="drawer-navigation-1"
            class="absolute right-0 top-2 inline-flex items-center rounded-lg p-1.5 text-sm text-gray-500 transition-colors duration-150 ease-in-out hover:text-gray-700"
            on:click={() => {
                sidebarOpen = false
            }}
        >
            <X class="me-[-0.1rem]" size={24} weight="bold" />
        </button>
        <div class="h-full pt-8">
            <div class="overflow-y-auto rounded-md">
                <button
                    class="mt-2 flex w-full cursor-pointer items-center justify-between p-2.5 text-base font-bold text-black"
                    on:click={() => {
                        hasInteracted.projects = true
                    }}
                    use:melt={$trigger('projects')}
                >
                    وثائق المشاريع
                    {#if $isSelected('projects')}
                        <span class:customRotateIn={hasInteracted.projects}>
                            <CaretUp class="mx-1" color="#868e96" size={18} weight="bold" />
                        </span>
                    {:else}
                        <span class:customRotateIn={hasInteracted.projects}>
                            <CaretDown class="mx-1" color="#868e96" size={18} weight="bold" />
                        </span>
                    {/if}
                </button>
                {#if $isSelected('projects')}
                    <div transition:slide>
                        <ul use:melt={$content('projects')}>
                            {#each projects as project}
                                <li
                                    class="my-2 mr-1 p-1 text-start text-gray-600 transition-colors duration-100 hover:text-green-600"
                                >
                                    <img
                                        class="logo-img mx-auto my-2 inline-block h-4 w-4 rounded-full"
                                        src="https://{project.url}/app.png"
                                        alt="project-logo"
                                    />
                                    <a
                                        aria-label={project.title}
                                        class="text-md font-custom mx-2 my-1 cursor-pointer list-none rounded-md border-none p-0.5 xs:w-auto xs:p-0.5 xs:text-xs xs:font-light"
                                        class:text-green-600={selectedProject.slug === project.slug}
                                        href="/docs/{project.parentSlug}/{project.slug}"
                                    >
                                        {project.title}
                                    </a>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/if}
            </div>
            {#if otherDocs}
                <button
                    class="flex w-full cursor-pointer items-center justify-between p-2.5 text-base font-bold text-black"
                    use:melt={$trigger('otherProjects')}
                    on:click={() => {
                        hasInteracted.otherProjects = true
                    }}
                >
                    الوثائق الأخري
                    {#if $isSelected('otherProjects')}
                        <span class:customRotateIn={hasInteracted.otherProjects}>
                            <CaretUp class="mx-1" color="#868e96" size={18} weight="bold" />
                        </span>
                    {:else}
                        <span class:customRotateIn={hasInteracted.otherProjects}>
                            <CaretDown class="mx-1" color="#868e96" size={18} weight="bold" />
                        </span>
                    {/if}
                </button>
                <div class="h-1/4">
                    {#if $isSelected('otherProjects')}
                        <div transition:slide>
                            <ul use:melt={$content('otherProjects')}>
                                {#each otherDocs as doc}
                                    <li
                                        class="my-2 mr-1 p-1 text-start text-gray-600 transition-colors duration-100 hover:text-green-600"
                                    >
                                        <button
                                            on:click={() => {
                                                sidebarOpen = false
                                            }}
                                        >
                                            <a
                                                aria-label={doc.title}
                                                class="text-md font-custom mx-2 cursor-pointer list-none rounded-md border-none p-0.5 xs:w-auto xs:p-0.5 xs:text-xs xs:font-light"
                                                class:text-green-600={selectedProject.slug ===
                                                    doc.slug}
                                                href="/docs/{doc.parentSlug}/{doc.slug}"
                                            >
                                                {doc.title}
                                            </a>
                                        </button>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
{/if}

<script>
import X from 'phosphor-svelte/lib/X'
import List from 'phosphor-svelte/lib/List'
import CaretUp from 'phosphor-svelte/lib/CaretUp'
import CaretDown from 'phosphor-svelte/lib/CaretDown'
import {createAccordion, melt} from '@melt-ui/svelte'
import {onNavigate} from '$app/navigation'
import {fade, slide, fly} from 'svelte/transition'

const {
    elements: {content, trigger},
    helpers: {isSelected},
} = createAccordion({
    defaultValue: ['projects', 'otherProjects'],
    multiple: true,
})

export let projects
export let otherDocs
export let selectedProject
let sidebarOpen = false

let hasInteracted = {
    projects: false,
    otherProjects: false,
}

onNavigate(() => {
    sidebarOpen = false
})
let sidebar
</script>
