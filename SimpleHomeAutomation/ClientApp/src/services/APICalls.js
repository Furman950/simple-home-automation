
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

function putRequest(endpoint, body) {
    return fetch(`http://${apiHost}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: body
    })
}

function deleteRequest(endpoint, body) {
    return fetch(`http://${apiHost}${endpoint}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: body
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
    return getRequest("/ui/get");
}

function deleteControl(id) {
    console.log(JSON.stringify(id));
    return deleteRequest("/ui/delete", JSON.stringify(id));
}

function saveScheduledTask(scheduledTask) {
    return postRequest("/ScheduledTasks/create", JSON.stringify(scheduledTask));
}


function getScheduledTasks() {
    return getRequest("/ScheduledTasks/getAll");
}

function resumeScheduledTask(name, group) {
    return putRequest("/ScheduledTasks/resume", JSON.stringify({ name, group }));
}

function pauseScheduledTask(name, group) {
    return putRequest("/ScheduledTasks/pause", JSON.stringify({ name, group }));
}

function deleteScheduledTask(name, group) {
    return deleteRequest("/ScheduledTasks/delete", JSON.stringify({name, group}));
}

export {
    publishMessage,
    saveUI,
    getUI,
    deleteControl,
    saveScheduledTask,
    getScheduledTasks,
    resumeScheduledTask,
    pauseScheduledTask,
    deleteScheduledTask
}