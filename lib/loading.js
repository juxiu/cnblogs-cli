const ora = require('ora')
const Loading = {
    start(message) {
        this.ora = new ora(message)
        this.ora.start()
    },
    stop() {
        this.ora.stop()
    },
    succeed(message) {
        this.ora.succeed(message)
    }
}

module.exports = Loading