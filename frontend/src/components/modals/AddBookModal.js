import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function AddBookModal(props) {
    const {
        isOpen = false,
        onClose,
        name,
        bookTypes,
        count,
        selectedBookType,
        isEdit = false,
        onSubmit,
        onFieldsChange,
    } = props;

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>
                    {isEdit ? 'Edit book data' : 'Add new book'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Book name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Enter book name"
                            value={name}
                            onChange={onFieldsChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Count</Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            name="count"
                            placeholder="Enter books count"
                            value={count}
                            onChange={onFieldsChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Book type</Form.Label>
                        <Form.Control
                            as="select"
                            name="bookType"
                            onChange={onFieldsChange}
                            value={selectedBookType}
                        >
                            <option>Choose...</option>
                            {bookTypes.map(bt => (
                                <option value={bt.ID} key={bt.ID}>
                                    {bt.NAME}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form>
                <div className="justify-content-between d-flex">
                    <Button variant="outline-info" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant={isEdit ? 'warning' : 'info'} onClick={onSubmit}>
                        Submit
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

AddBookModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    name: PropTypes.string,
    bookTypes: PropTypes.array,
    count: PropTypes.number,
    selectedBookType: PropTypes.string,
    isEdit: PropTypes.bool,
    onSubmit: PropTypes.func,
    onFieldsChange: PropTypes.func,
};
