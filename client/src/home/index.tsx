import React, { useEffect } from 'react';
import { Button, Card, Carousel, Col, Container, Nav, Row } from 'react-bootstrap';

import Layout from '../layout';

import { RouteComponentProps, Link } from '@reach/router';
import { useDataContext } from '../share/DataContext';

interface HomeProps extends RouteComponentProps { }

const formatter = new Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'BGN' });

export default function Home(_props: React.PropsWithChildren<HomeProps>) {
  const [data, actions] = useDataContext();

  useEffect(() => {
    actions.loadMenuItems();
  });

  return (
    <Layout
      navLinks={
        <Nav>
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#products">Products</Nav.Link>
          <Nav.Link href="#history">History</Nav.Link>
          <Nav.Link href="#contacts">Contacts</Nav.Link>
          <Nav.Link to="order" as={Link}>Order</Nav.Link>
        </Nav>
      }
    >
      <Carousel id="home">
        <Carousel.Item>
          <img
            // style={{ height: "300px" }}
            className="d-block w-100"
            src="http://localhost:3001/images/main-top.jpg"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <Container id="products" className="mt-5">
        <h1>Products</h1>
        <hr />
        <Row>
          {data.menuItems.slice(0, 6).map(item => (
            <Col className="mb-3" lg={4} md={6} key={item._id}>
              <Card>
                <Card.Img variant="top" src={actions.createMenuItemImage(item)} />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of
                    the card's content.
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="d-flex align-items-center">
                  <span className="flex-fill">{formatter.format(item.price)}</span>
                  <Button variant="outline-primary">Buy</Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-5">
          <Button variant="success" to="order" as={Link} style={{width: '20em'}}>Order</Button>
        </div>
      </Container>
      <Container id="history" className="mt-5">
        <h1 className="text-center">Born by acident.</h1>
        <hr />
        <h5 className="text-center">Who are we?</h5>
        <Row>
          <Col sm>
            <p>
              Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
            </p>
          </Col>
          <Col sm>
            <p>
              Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
            </p>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
