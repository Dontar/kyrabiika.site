import React from 'react';
import { Link, RouteComponentProps } from '@reach/router';
import { Badge, Button, Card, Col, Container, ListGroup, Nav, Row } from 'react-bootstrap';

import Layout from '../layout';

import data from '../data/data.json';
import mufin_carrot from '../data/mufin_carrot.jpg';
import mufin_nut from '../data/mufin_nut.jpg';

import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';

const formatter = new Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'BGN' });

export default function Order(_props: React.PropsWithChildren<RouteComponentProps<{}>>) {
  const categories = data.reduce<Set<string>>((result, item) => {
    result.add(item.category);
    return result;
  }, new Set());
  return (
    <Layout navLinks={
      <Nav>
        <Nav.Link to="/" as={Link}>Home</Nav.Link>
      </Nav>
    }>
      <Container fluid className="mt-2">
        <Row>
          <Col lg={2}>
            <ListGroup className="position-sticky" style={{ top: "4em" }} variant="flush">
              {Array.from(categories).map((cat => (
                <ListGroup.Item action>{cat}</ListGroup.Item>
              )))}
            </ListGroup>
          </Col>
          <Col>
            <Row>
              {data.map(item => (
                <Col className="mb-3" lg={4} md={6} key={item._id}>
                  <Card>
                    <Card.Img variant="top" src={(Math.random() < .4) ? mufin_carrot : mufin_nut} />
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

          </Col>
          <Col lg={3}>
            <ListGroup className="position-sticky" style={{ top: "4em" }}>
              {[1, 2, 3, 4, 5, 6].map(idx => (
                <ListGroup.Item className="d-flex" key={idx}>
                  <div className="mr-1">
                    <img src={mufin_nut} alt="" className="rounded" style={{ width: "5em" }} />
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
              <ListGroup.Item className="d-flex bg-light align-items-center">
                <div className="flex-fill">
                  <span>{formatter.format(20)}</span>
                </div>
                <div>
                  <Button variant="outline-primary" to="/order/summary" as={Link}>
                    Order
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}