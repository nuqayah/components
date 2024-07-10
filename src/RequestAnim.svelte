<div class="request-indicator" style="--bg: {color}" class:active></div>

<script>
export let active
export let color = '#e3f2fd'
</script>

<style>
@keyframes elastic-indicator {
    0% {
        left: 0;
        right: 100%;
    }
    55% {
        left: 0;
        right: 0;
    }
    100% {
        left: 100%;
        right: 0;
    }
}
.request-indicator {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    z-index: 9999;
}
.request-indicator.active:before {
    content: '';
    position: absolute;
    height: 100%;
    background-color: var(--bg);
    animation: elastic-indicator 2s infinite;
}
</style>
