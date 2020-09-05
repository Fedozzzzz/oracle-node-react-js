/** BOOKS */

import { BACKEND_PATH } from '../config';

export function fetchBooks() {
    return fetch(`${BACKEND_PATH}/api/books`).then(res => res.json());
}

export function fetchThreePopularBooks() {
    return fetch(`${BACKEND_PATH}/api/books/three_popular_book`).then(res =>
        res.json(),
    );
}

export function getDayCount(data) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    };
    return fetch(`${BACKEND_PATH}/api/books/max_days`, requestOptions).then(res =>
        res.json(),
    );
}

export function fetchBooksAndTypes() {
    return fetch(`${BACKEND_PATH}/api/books/get_books_types`).then(res =>
        res.json(),
    );
}

export function addBook(data) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    };
    return fetch(`${BACKEND_PATH}/api/books/add`, requestOptions).then(res =>
        res.json(),
    );
}

export function deleteBook(data) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    };
    return fetch(`${BACKEND_PATH}/api/books/delete`, requestOptions).then(res =>
        res.json(),
    );
}

export function editBook(data) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    };
    console.log(requestOptions);
    return fetch(`${BACKEND_PATH}/api/books/edit`, requestOptions).then(res =>
        res.json(),
    );
}
