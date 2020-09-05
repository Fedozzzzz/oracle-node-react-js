import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

function Navigation() {
    return (
        <Navbar bg="dark" expand="lg" variant="dark">
            <Navbar.Brand href="/journal">Library Journal</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Link to="/journal" className="nav-link">
                        Journal
                    </Link>
                    <Link to="/clients" className="nav-link">
                        Clients
                    </Link>
                    <Link to="/books" className="nav-link">
                        Books
                    </Link>
                    <Link to="/book-types" className="nav-link">
                        Book Types
                    </Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Navigation;
