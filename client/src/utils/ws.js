import { getCookie } from '@/utils/cookie'


export function WsConnect (url, receiver) {
    const socket = new WebSocket(url)
    socket.onopen = function () {
        console.info('WS Connect to ', url)
    }
    socket.onclose = function (event) {
        if (event.wasClean) {
            console.info('WS Closed Correctly')
        } else {
            console.error('WS Connect Terminated')
        }
        console.info('WS Code ' + event.code + '')
    }
    socket.onmessage = function (event) {
        return receiver(event.data)
    }
    socket.onerror = function (error) {
        console.error('WS ' + error.message)
    }
    return socket
}

export function WS (url) {
    let self = this
    self.receiver = function (data) {
        console.info('WS Default Receiver: ', data)
    }
    self.receive = function (receiver) {
        self.receiver = receiver
        return self
    }
    self.ready = function (func) {
        self.socket.onopen = function () {
            return func.call(self)
        }
        return self
    }
    self.send = function (data) {
        data.sessionid = getCookie('sessionid')
        // data.utcoffset = new Date().getTimezoneOffset()
        let msg = JSON.stringify(data)
        if (self.socket.readyState == 1) { // ready yet
            self.socket.send(msg)
        } else {
            self.ready(function () {
                self.socket.send(msg)
            })
        }
        return self
    }
    self.close = function () {
        try {
            self.socket && self.socket.close()
        } catch (e) {

        } finally {
            delete self.socket
        }
    }
    function receiver (data) {
        return self.receiver(JSON.parse(data))
    }
    setInterval(function () {
        if (!self.socket || self.socket.readyState == 3) {
            self.close()
            self.socket = new WsConnect(url, receiver)
            self.send({command: 'reconnect'})
        }
    }, 5000)
    self.socket = new WsConnect(url, receiver)
    return self
}

export function getWsHost (subDomain, location) {
    const wsProto = location.protocol.indexOf('https') != -1 ? 'wss' : 'ws'
    const wsHost = location.hostname.split('.').filter(x => x).reverse().slice(0, 2).reverse().join('.')
    const wsPort = location.port ? `:${location.port}` : ''
    return `${wsProto}://${subDomain}.${wsHost}${wsPort}`
}
