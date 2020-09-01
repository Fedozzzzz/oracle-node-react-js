import React from "react";
import {Button, Modal} from "react-bootstrap";

export default function InfoModal(props) {

    const {isOpen = false, component, onClose, message, size="sm", customButton, btnContainerClassName} = props;

    return (
        <Modal show={isOpen} size={size} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>INFO</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {component && (<div>{component}</div>)}
                {message && (<div className='justify-content-center d-flex'>{message}</div>)}
                <br/>
                <div className='justify-content-between d-flex'>
                    <Button variant="outline-info" onClick={onClose}>Close</Button>
                    {customButton&&customButton}
                </div>
            </Modal.Body>
        </Modal>
    )
}