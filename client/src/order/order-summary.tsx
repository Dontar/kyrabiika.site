import React, { useState } from 'react';
import { Link, RouteComponentProps } from '@reach/router';
import { Badge, Button, Card, Col, Container, ListGroup, Modal, Nav, OverlayTrigger, Row } from 'react-bootstrap';

import Layout from '../layout';

import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faGreaterThan, faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';

const formatter = new Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'BGN' });

export default function OrderSummary(_props: React.PropsWithChildren<RouteComponentProps<{}>>) {
  const [menuShoed, setShowMenu] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const handleClose = () => setModalShow(false);
  return (
    <Layout navLinks={
      <Nav>
        <Nav.Link to="/" as={Link}>Home</Nav.Link>
      </Nav>
    }>
      <Container className="mt-5" onClickCapture={() => setShowMenu(false)}>
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
              <OverlayTrigger
                show={menuShoed}
                onToggle={(nextShow) => { setShowMenu(nextShow) }}
                placement="bottom-start"
                trigger="click"
                overlay={
                  <ListGroup className="shadow">
                    <ListGroup.Item action>София, жк Лагера, ул. Хайдушка поляна , бл. 96</ListGroup.Item>
                    <ListGroup.Item action>София, жк Лагера, ул. Хайдушка поляна , бл. 96</ListGroup.Item>
                    <ListGroup.Item action>Add address...</ListGroup.Item>
                  </ListGroup>
                }
              >
                <ListGroup.Item>
                  <span>София, жк Лагера, ул. Хайдушка поляна , бл. 96</span>
                  <Icon className="float-right" icon={faGreaterThan}></Icon>
                </ListGroup.Item>
              </OverlayTrigger>
              <ListGroup.Item action onClick={() => setModalShow(true)}>
                Tue 28 Sep (12:00 - 12:30)
              </ListGroup.Item>
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
      <Modal show={modalShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Schedule order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col style={{maxHeight: "20em"}} className="overflow-auto">
              <Icon className="text-muted" icon={faCalendar} />
              <span>Start date</span>
              <ListGroup variant="flush">
                <ListGroup.Item action>Today</ListGroup.Item>
                <ListGroup.Item action>Tomorrow</ListGroup.Item>
                <ListGroup.Item action>Tue 28 Sep</ListGroup.Item>
                <ListGroup.Item action>Tue 28 Sep</ListGroup.Item>
                <ListGroup.Item action>Tue 28 Sep</ListGroup.Item>
                <ListGroup.Item action>Tue 28 Sep</ListGroup.Item>
                <ListGroup.Item action>Tue 28 Sep</ListGroup.Item>
                <ListGroup.Item action>Tue 28 Sep</ListGroup.Item>
                <ListGroup.Item action>Tue 28 Sep</ListGroup.Item>
                <ListGroup.Item action>Tue 28 Sep</ListGroup.Item>
                <ListGroup.Item action>Tue 28 Sep</ListGroup.Item>
                <ListGroup.Item action>Tue 28 Sep</ListGroup.Item>
                <ListGroup.Item action>Tue 28 Sep</ListGroup.Item>
                <ListGroup.Item action>Tue 28 Sep</ListGroup.Item>
                <ListGroup.Item action>Tue 28 Sep</ListGroup.Item>
                <ListGroup.Item action>Tue 28 Sep</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col style={{maxHeight: "20em"}} className="overflow-auto">
              <Icon className="text-muted" icon={faClock} />
              <span>Start time</span>
              <ListGroup variant="flush">
                <ListGroup.Item action>ASAP</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
                <ListGroup.Item action>12:00 - 12:30</ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

    </Layout>
  );
}
