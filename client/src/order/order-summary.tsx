import React from 'react';
import { Link, RouteComponentProps } from '@reach/router';
import { Badge, Button, Card, Col, Container, ListGroup, Nav, Row } from 'react-bootstrap';

import Layout from '../layout';

import muffin_carrot from '../data/mufin_carrot.jpg';
import muffin_nut from '../data/mufin_nut.jpg';

import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';

const formatter = new Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'BGN' });

export default function OrderSummary(_props: React.PropsWithChildren<RouteComponentProps<{}>>) {
  return (
    <Layout navLinks={
      <Nav>
        <Nav.Link to="/" as={Link}>Home</Nav.Link>
      </Nav>
    }>
      <Container className="mt-5">
        <Row>
          <Col md={8}>
            <h4>Products</h4>
            <hr />
            <ListGroup className="mb-3">
              {[1, 2, 3, 4, 5, 6].map(idx => (
                <ListGroup.Item className="d-flex" key={idx}>
                  <div className="mr-1">
                    <img src={(Math.random() < .4) ? muffin_nut : muffin_carrot} alt="" className="rounded" style={{ width: "5em" }} />
                  </div>
                  <div className="flex-fill">
                    <span>баничка със сирене и подправки</span>
                  </div>
                  <div className="mr-1">
                    <Badge variant="secondary"> 1x </Badge>
                  </div>
                  <span className="mr-2">{formatter.format(1)}</span>
                  <div>
                    <Button variant="outline-danger" size="sm">
                      <Icon icon={faCircleXmark} />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <h4>Details</h4>
            <hr />
            <ListGroup className="mb-3">
              <ListGroup.Item> <div style={{ height: "300px" }} className="bg-light border">Google Map</div> </ListGroup.Item>
              <ListGroup.Item>Address</ListGroup.Item>
              <ListGroup.Item>Deliver when</ListGroup.Item>
            </ListGroup>
            <h4>Payment</h4>
            <hr />
            <ListGroup>
              <ListGroup.Item>Payment Method</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col>
            <div className="position-sticky" style={{ top: "4em" }}>
              <h4>Summary</h4>
              <hr />
              <Card>
                <Card.Body className="p-0">
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span className="font-weight-bold">Products</span>
                      <span>лв.34,26</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span className="font-weight-bold">Delivery</span>
                      <span>FREE</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span className="font-weight-bold">TOTAL</span>
                      <span>лв.34,26</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-end">
                  <Button variant="success" to="/order/progress" as={Link}>Confirm order</Button>
                </Card.Footer>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
