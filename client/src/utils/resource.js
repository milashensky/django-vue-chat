import { EventBus } from '@/utils/event-bus.js'
import { getCookie } from '@/utils/cookie'


const apiUrl = window.apiUrl || '/api/'
const defaultOptions = {
    method: 'GET',
    mode: 'cors',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'credentials': 'same-origin'
    }
}
const encodeGetParams = p => Object.entries(p).map(kv => kv.map(encodeURIComponent).join('=')).join('&')


function resource (url, data, method = 'GET', options = {}) {
    return new Promise((resolve, reject) => {
        let opts = {
            method,
            'X-CSRFToken': getCookie('csrftoken')
        }
        if (data) {
            if (method.toLowerCase() !== 'get')
                opts.body = JSON.stringify(data)
            else
                url += '?' + encodeGetParams(data)
        }
        fetch(url, Object.assign({}, defaultOptions, opts, options))
            .then(resp => {
                switch (resp.status) {
                case 200:
                    resolve(resp.json())
                    break
                case 500:
                    EventBus.$emit('error:500')
                    break
                default:
                    reject(resp)
                }
            }).catch(err => {
                console.error('fetch error: ', err)
                reject(err)
            })
    })
}

export default {
    Context: {
        get (data, options = {}) {
            return resource(apiUrl + 'common/context', data, 'GET', options)
        }
    },
    Login: {
        post (data) {
            return resource(apiUrl + 'common/login', data, 'POST')
        }
    },
    Logout: {
        post (data) {
            return resource(apiUrl + 'common/logout', data, 'POST')
        }
    },
    Registration: {
        post (data) {
            return resource(apiUrl + 'common/registration', data, 'POST')
        }
    },
    Users: {
        get (data, options = {}) {
            return resource(apiUrl + 'common/users', data, 'GET', options)
        }
    }
}
