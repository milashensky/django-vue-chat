import { WS, getWsHost } from '@/utils/ws'


export const chatWS = (function () {
    let ws = new WS(getWsHost('wsc', location))
    ws.subscribers = {}
    ws.$emit = function (command, data) {
        // send data to backend
        data = Object.assign({command}, data)
        ws.send(data)
        return ws
    }
    ws.$on = function (command, func) {
        // register subscriber
        if (!(command in ws.subscribers)) {
            ws.subscribers[command] = []
        }
        ws.subscribers[command].push(func)
        return ws
    }
    ws.$off = function (command, func) {
        if (command && !func) {
            ws.subscribers[command] = []
        }
        if (command && func && ws.subscribers[command] && ws.subscribers[command].length) {
            while (ws.subscribers[command].indexOf(func) >= 0) {
                ws.subscribers[command].splice(ws.subscribers[command].indexOf(func), 1)
            }
        }
        return ws
    }
    ws.receive(function (data) {
        // sending data from backend to subscriber func
        if (data.command in ws.subscribers) {
            for (let func of ws.subscribers[data.command]) {
                func(data)
            }
        }
    })
    return ws
})()
