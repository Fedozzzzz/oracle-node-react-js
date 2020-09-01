import {BACKEND_PATH} from "../config";

export function login(data) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    };
    return fetch(`${BACKEND_PATH}/api/users/login`, requestOptions)
        .then(res => res.json());
}