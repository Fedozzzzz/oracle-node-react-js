import {BACKEND_PATH} from '../config'

//CLIENTS

export function fetchClients() {
    return fetch(`${BACKEND_PATH}/api/clients`)
        .then(res => res.json());
}

export function addClient(data) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    };
    return fetch(`${BACKEND_PATH}/api/clients/add`, requestOptions)
        .then(res => res.json());
}

export function deleteClient(data) {
    const requestOptions = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    };
    return fetch(`${BACKEND_PATH}/api/clients/delete`, requestOptions)
        .then(res => res.json());
}

export function editClient(data) {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    };
    return fetch(`${BACKEND_PATH}/api/clients/edit`, requestOptions)
        .then(res => res.json());
}

export function fetchClientBooksCount(data) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    };
    return fetch(`${BACKEND_PATH}/api/clients/get_client_books`, requestOptions)
        .then(res => res.json());
}

export function getClientFine(data) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    };
    return fetch(`${BACKEND_PATH}/api/clients/get_client_fine`, requestOptions)
        .then(res => res.json());
}