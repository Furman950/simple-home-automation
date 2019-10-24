
let apiHost = window.location.host + "/api"

function postRequest(endpoint, body) {
    return fetch(`http://${apiHost}${endpoint}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: body
    })
}

function getRequest(endpoint) {
    return fetch(`http://${apiHost}${endpoint}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
}

function publishMessage(topic, message) {
    return postRequest("/mqtt/publish",
        JSON.stringify({ topic, message }));
}

function saveUI(ui) {
    let json = JSON.stringify(ui, (key, value) => {
        if (typeof value === 'function') {
            return value.prototype.constructor.name
        }
        else {
            return value;
        }
    })

    return postRequest("/ui/save", json);
}

function getUI() {
    return getRequest("/ui/get")
}

export {
    publishMessage,
    saveUI,
    getUI
}