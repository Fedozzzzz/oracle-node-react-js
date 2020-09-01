import React from 'react';
import {Button, Form, Modal} from "react-bootstrap";

export default function CreateClientModal(props) {

    const {
        isOpen = false,
        clients,
        books,
        bookId,
        clientId,
        dateBegin,
        dateEnd,
        isEdit = false,
        onSubmit,
        onFieldsChange,
        onClose
    } = props;

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>{isEdit ? 'Edit Journal note' : 'Add new Journal note'}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Client</Form.Label>
                        <Form.Control
                            as="select"
                            name="clientId"
                            onChange={onFieldsChange}
                            value={clientId}
                            disabled={isEdit}>
                            <option>Select Client</option>
                            {clients.map(cl => <option key={cl.ID} value={cl.ID}>
                                {`${cl.FIRST_NAME} ${cl.LAST_NAME} ${cl.PATHER_NAME}`}
                            </option>)}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Book</Form.Label>
                        <Form.Control
                            as="select"
                            name="bookId"
                            onChange={onFieldsChange}
                            value={bookId}
                            disabled={isEdit}>
                            <option>Select Book</option>
                            {books.map(bk => <option key={bk.ID} value={bk.ID}>{`${bk.NAME}`}</option>)}
                        </Form.Control>
                    </Form.Group>

                    {
                        isEdit && (<Form.Group>
                            <Form.Label>Begin Date</Form.Label>
                            <Form.Control type='text' name="dateBegin" value={new Date(dateBegin).toDateString()}
                                          disabled onChange={onFieldsChange}/>
                        </Form.Group>)
                    }
                    {
                        isEdit && (<Form.Group>
                            <Form.Label>End Date</Form.Label>
                            <Form.Control type='text' name="dateEnd" value={new Date(dateEnd).toDateString()} disabled
                                          onChange={onFieldsChange}/>
                        </Form.Group>)
                    }
                    {
                        isEdit && (<Form.Group>
                            <Form.Label>Return Date</Form.Label>
                            <Form.Control type='date' name="dateReturn" onChange={onFieldsChange}/>
                        </Form.Group>)
                    }
                </Form>
                <div className='justify-content-between d-flex'>
                    <Button variant="outline-info" onClick={onClose}>Cancel</Button>
                    <Button variant={isEdit ? "warning" : "info"} onClick={onSubmit}>Submit</Button>
                </div>
            </Modal.Body>
        </Modal>)
}
