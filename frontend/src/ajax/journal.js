import {BACKEND_PATH} from "../config";

export function fetchJournal() {
    return fetch(`${BACKEND_PATH}/api/journal`)
        .then(res => res.json());
}

export function addJournalNote(data) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    };
    console.log(requestOptions);
    return fetch(`${BACKEND_PATH}/api/journal/add`, requestOptions)
        .then(res => res.json());
}

export function deleteJournalNote(data) {
    const requestOptions = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    };
    return fetch(`${BACKEND_PATH}/api/journal/delete`, requestOptions)
        .then(res => res.json());
}

export function editJournalNote(data) {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    };
    return fetch(`${BACKEND_PATH}/api/journal/edit`, requestOptions)
        .then(res => res.json());
}