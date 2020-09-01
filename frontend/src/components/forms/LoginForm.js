import React from "react";
import {Button, Form} from "react-bootstrap";
import "./Login.css";

export default function Login(props) {

    const {
        email,
        password,
        handleSubmit,
        handleLoginChange,
        handlePasswordChange
    } = props;

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <Form.Group controlId="email" bsSize="large">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        placeholder="Enter email"
                        type="email"
                        value={email}
                        onChange={handleLoginChange}
                    />
                </Form.Group>
                <Form.Group controlId="password" bsSize="large">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        placeholder="Enter password"
                        value={password}
                        onChange={handlePasswordChange}
                        type="password"
                    />
                </Form.Group>
                <Button block bsSize="large" disabled={!validateForm()} type="submit">
                    Login
                </Button>
            </form>
        </div>
    );
}