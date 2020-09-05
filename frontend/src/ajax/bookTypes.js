import { BACKEND_PATH } from '../config';

export function fetchBookTypes() {
    return fetch(`${BACKEND_PATH}/api/book_types`).then((res) => res.json());
}
