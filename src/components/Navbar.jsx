import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../components/Navbar.css";
import { Button } from "react-bootstrap";
import { GoArrowDownRight } from "react-icons/go";

import { useState } from "react";
import Form from "./Form";
import { Link, NavLink } from "react-router-dom";

function MyNavbar() {
  const [showModal, setShowModal] = useState(false);
  return (
    <Navbar
      expand="lg"
      className="fixed-top border-top border-bottom mb-5 bg-light-custom p-4"
    >
      <Container fluid className="justify-content-between px-4">
        <Navbar.Brand className="fs-4" href="#home">
          <Link className="text-decoration-none text-primary-custom" to="/">
            ScattiFestosi
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              to
              className="fs-4 btn-animated text-primary-custom"
              href="#how"
            >
              Come funziona
            </Nav.Link>
            <Nav.Link
              className="fs-4 btn-animated text-primary-custom"
              href="#recensioni"
            >
              Recensioni
            </Nav.Link>
            <Nav.Link
              className="fs-4 btn-animated text-primary-custom"
              href="#utilità"
            >
              Utilità
            </Nav.Link>
          </Nav>
          <Button
            onClick={() => setShowModal(true)}
            className="btn-animated fs-5 text-primary-custom"
            variant=""
          >
            Login
          </Button>
          <Button
            onClick={() => setShowModal(true)}
            className="btn-sign rounded-pill border-custom bg-secondary-custom text-primary-custom"
            variant=""
            size="lg"
          >
            Registrati
            <GoArrowDownRight className="react-icon" />
          </Button>
          <Form show={showModal} onClose={() => setShowModal(false)} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
