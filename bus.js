const channels = Object.create(null)

export default {
    subscribe(channel, handler) {
        if (!(channel in channels))
            channels[channel] = []

        const index = channels[channel].push(handler)
        return function unsubscribe() {
            const i = channels[channel].indexOf(handler)
            if (i < 0)
                return
            channels[channel].splice(i, 1)
            if (!channels[channel].length)
                delete channels[channel]
        }
    },
    publish(channel) {
        if (!(channel in channels))
            return

        const args = [...arguments].slice(1)
        channels[channel].forEach(handler => { handler(...args) })
    },
}
