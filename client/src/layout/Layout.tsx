import React, { Fragment } from 'react';
import {
  Button,
  Card,
  Carousel, Col, Container, Nav, Navbar, Row
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
      <Container id="products" className="mt-5">
        <h1 className="text-center">Products</h1>
        <Row>
          {(new Array(6)).fill(
            <Col className="mb-3">
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
            </Col>)}
        </Row>

      </Container>
      <Container id="history" className="mt-5">
        <h1 className="text-center">History</h1>
        <Row>
          <Col className="text-center">
            <h5>Who are we?</h5>
            <h2>Born by acident.</h2>
            <p>
              Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah 
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah 
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah 
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah 
            </p>
          </Col>
          <Col></Col>
        </Row>
      </Container>
      <Container id="contacts" className="mt-5">
        <h1>Contacts</h1>
      </Container>
    </Fragment>
  );
}
