
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

function saveUI(uiJSON) {
    return postRequest("/ui/save", JSON.stringify(uiJSON));
}

function getUI() {
    return getRequest("/ui/get")
}

function saveScheduledTask(scheduledTask) {
    return postRequest("ScheduledTasks/create", JSON.stringify())
}


function getScheduledTasks() {
    return getRequest("/ScheduledTasks/getAll")
}

export {
    publishMessage,
    saveUI,
    getUI,
    saveScheduledTask,
    getScheduledTasks
}