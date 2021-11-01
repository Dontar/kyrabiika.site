import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Card, Col, Container, ListGroup, Modal, Nav, OverlayTrigger, Row } from 'react-bootstrap';

import Layout from '../../lib/Layout';

import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faGreaterThan, faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';
import { OrderItemsList } from '../../lib/OrderItemsList';
import { useOrderContext } from '../../lib/OrderContext';
import { formatter } from '../../lib/Utils';

export default function OrderSummary() {
  const [menuShowed, setShowMenu] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const handleClose = () => setModalShow(false);

  const order = useOrderContext();

  return (
    <Layout navLinks={
      <Nav>
        <Nav.Link href="/" as={Link}>Home</Nav.Link>
      </Nav>
    }>
      <Container className="mt-5" onClickCapture={() => setShowMenu(false)}>
        <Row>
          <Col md={8}>
            <h4>Products</h4>
            <hr />
            <ListGroup className="mb-3">
              {Array.from(order.items).map((item, idx) => (
                <OrderItemsList
                  key={idx}
                  item={item}
                  imageUrl={`/api/images/${item.item.name}`}
                  onRemove={() => order.delItem(item)}
                />
              ))}
            </ListGroup>
            <h4>Details</h4>
            <hr />
            <ListGroup className="mb-3">
              <ListGroup.Item> <div style={{ height: "300px" }} className="bg-light border">Google Map</div> </ListGroup.Item>
              <OverlayTrigger
                show={menuShowed}
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
                      <span>{formatter.format(order.orderPrice)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span className="font-weight-bold">Delivery</span>
                      <span>{formatter.format(order.deliveryTax)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span className="font-weight-bold">TOTAL</span>
                      <span>{formatter.format(order.finalOrderPrice)}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-end">
                  <Button
                    variant="success"
                    href="/order/progress" as={Link}
                    onClick={() => order.setProgress("Confirmed")}
                  >
                    Confirm order
                  </Button>
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
            <Col style={{ maxHeight: "20em" }} className="overflow-auto">
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
            <Col style={{ maxHeight: "20em" }} className="overflow-auto">
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