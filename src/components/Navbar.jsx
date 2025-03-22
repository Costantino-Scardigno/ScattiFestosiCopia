import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../components/Navbar.css";
import { Button } from "react-bootstrap";
import { GoArrowDownRight } from "react-icons/go";
import { Link } from "react-router-dom";

function MyNavbar({ setShowForm }) {
  return (
    <Navbar
      expand="lg"
      className="fixed-top  border-bottom mb-5 bg-light-custom p-4"
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
              className="fs-4 btn-animated text-primary-custom nav-link-custom"
              href="#how"
            >
              Come funziona
            </Nav.Link>
            <Nav.Link
              className="fs-4 btn-animated text-primary-custom nav-link-custom"
              href="#recensioni"
            >
              Recensioni
            </Nav.Link>
            <Nav.Link
              className="fs-4 btn-animated text-primary-custom nav-link-custom"
              href="#utilità"
            >
              Utilità
            </Nav.Link>
          </Nav>
          <div className="d-flex justify-content-between mt-1 mt-sm-1 border-custom">
            <Button
              onClick={() => setShowForm(true)}
              className="btn-animated fs-4 p-0 pe-3 text-primary-custom"
              variant=""
            >
              Login
            </Button>
            <Button
              onClick={() => setShowForm(true)}
              className="btn-sign rounded-pill border-custom bg-secondary-custom text-primary-custom"
              variant=""
              size="lg"
            >
              Registrati
              <GoArrowDownRight className="react-icon" />
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
