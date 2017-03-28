export const BASE_URL = 'http://cnodejs.org/api/v1';

const ajax = function (options) {
    let { noToken = false, url, data = {}, type = 'GET' } = options;

    let params = {};
    let body = '',
        key;

    for (key in data) {
        body = body + key + '=' + data[key] + '&';
    }

    if (!noToken) {
        let token = localStorage.getItem('token');

        body = body + 'token=' + token;
    } else {
        //去除最后一个&
        body = body.substring(0, body.length - 1);
    }

    if (type === 'GET' || type === 'get') {
        url = url + '?' + body;
    } else {
        params = {
            method: type,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body
        }
    }

    return fetch(url, params);
}

function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

export default function request(options) {
    return ajax(options)
        .then(checkStatus)
        .then(parseJSON)
        .then(data => ({ data }))
        .catch(err => ({ err }));
}
