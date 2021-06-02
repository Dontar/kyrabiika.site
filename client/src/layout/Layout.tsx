import React, { Fragment } from 'react';
import {
  Button,
  Card,
  Carousel, Container, Nav, Navbar
} from 'react-bootstrap';
import Logo from '../media/main-top.jpg';

export interface LayoutProps {
  syncButton?: React.ReactElement;
}

export default function Layout(props: React.PropsWithChildren<LayoutProps>) {
  return (
    <Fragment>
      <Navbar bg="light" expand="lg" sticky="top">
        <Navbar.Brand href="#/">
          <span>Kyrabiika</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#products">Products</Nav.Link>
            <Nav.Link href="#history">History</Nav.Link>
            <Nav.Link href="#contacts">Contacts</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100 h-100"
            src={Logo}
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <Container id="products">
        <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk of
              the card's content.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>

      </Container>
      <Container id="history">
      </Container>
      <Container id="contacts">
      </Container>
    </Fragment>
  );
}
