import React from 'react';
import {Button, Form, Modal} from "react-bootstrap";

export default function CreateClientModal(props) {

    const {
        isOpen = false,
        onClose,
        firstName,
        lastName,
        patherName,
        passportSeria,
        passportNum,
        isEdit = false,
        onSubmit,
        onFieldsChange
    } = props;

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>{isEdit ? 'Edit client' : 'Add new client'}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>First name</Form.Label>
                        <Form.Control type="text" name="firstName" placeholder="Enter first name" value={firstName}
                                      onChange={(e) => onFieldsChange(e)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Last name</Form.Label>
                        <Form.Control type="text" name="lastName" placeholder="Enter first name" value={lastName}
                                      onChange={onFieldsChange}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Pather name</Form.Label>
                        <Form.Control type="text" name="patherName" placeholder="Enter patronymic" value={patherName}
                                      onChange={onFieldsChange}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Passport seria</Form.Label>
                        <Form.Control type="number" name="passportSeria" placeholder="Enter passport series"
                                      value={passportSeria}
                                      onChange={onFieldsChange}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Passport number</Form.Label>
                        <Form.Control type="number" name="passportNum" placeholder="Enter passport number"
                                      value={passportNum}
                                      onChange={onFieldsChange}/>
                    </Form.Group>
                </Form>
                <div className='justify-content-between d-flex'>
                    <Button variant="outline-info" onClick={onClose}>Cancel</Button>
                    <Button variant={isEdit ? "warning" : "info"} onClick={onSubmit}>Submit</Button>
                </div>
            </Modal.Body>
        </Modal>)
}
