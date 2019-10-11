
let apiHost = window.location.host + "/api"

function publishMessage(topic, message) {
    return postRequest(`http://${apiHost}/mqtt/publish`, {topic, message})
}

function postRequest(endpoint, obj) {
    console.log(endpoint);
    return fetch(endpoint, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    })
}

export {
    publishMessage
}