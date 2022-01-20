import React, { ReactElement, useState } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

import Layout from "../../lib/comps/Layout";
import Link from "next/link";

import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons/faCalendar";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { OrderItemRow } from "../../lib/comps/OrderItemRow";
import { useOrderContext } from "../../lib/comps/OrderContext";
import { formatter } from "../../lib/utils/Utils";

import GoogleMap from "../../lib/comps/GoogleMap";
import { Status, Wrapper } from "@googlemaps/react-wrapper";

export default function OrderSummary() {
  const [modalShow, setModalShow] = useState(false);

  const handleClose = () => setModalShow(false);

  const order = useOrderContext({
    redirectTo: "/login"
  });

  const onNewPosition = (pos: google.maps.LatLngLiteral, address?: string) => {
    order.setUserAddress(address!, pos);
  };

  const render = (status: Status): ReactElement => {
    if (status === Status.LOADING) return <h3>{status} ..</h3>;
    if (status === Status.FAILURE) return <h3>{status} ...</h3>;
    return <></>;
  };

  return (
    <Layout>
      <Container className="mt-5">
        <Row>
          <Col md={8}>
            <h4>Products</h4>
            <hr />
            <ListGroup className="mb-3">
              {order.items.length ? (
                order.items.map((item, idx) => (
                  <OrderItemRow key={idx} item={item} onRemove={() => order.delItem(item)} />
                ))
              ) : (
                <ListGroup.Item style={{ height: "100px" }} className="text-center">
                  There are no products selected.
                  You can order <Link href="/order">here</Link>.

                </ListGroup.Item>
              )}
            </ListGroup>
            <h4>Address &amp; Delivery</h4>
            <hr />
            <Wrapper apiKey="AIzaSyDCTQ1_GSpfRU2tyKg78QLkN8BeaGQr4Ho" render={render}>
              <ListGroup className="mb-3">
                <ListGroup.Item>
                  <Row>
                    <Col className="py-2" md={2}>
                      <small className="text-muted">Contact</small>
                    </Col>
                    <Col>
                      <div>{order.userName}</div>
                      <small>{order.user?.mail}</small>
                    </Col>
                    <Col>
                      <div><small className="text-muted">Phone</small></div>
                      {order.user?.phone}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col className="py-2" md={2}>
                      <small className="text-muted">Address</small>
                    </Col>
                    <Col className="py-2">
                      <span>{order.user?.address}</span>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <GoogleMap pin={order.user?.address_pos} address={order.user?.address} onNewPosition={onNewPosition} />
                </ListGroup.Item>

                <ListGroup.Item action onClick={() => setModalShow(true)}>
                  <Row>
                    <Col className="py-2" md={2}>
                      <small className="text-muted">Delivery time</small>
                    </Col>
                    <Col className="py-2">Tue 28 Sep (12:00 - 12:30)</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>

            </Wrapper>
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
                  <Link href="/order/progress" passHref>
                    <Button variant="success" onClick={() => order.setProgress("Confirmed")}> Confirm order </Button>
                  </Link>
                </Card.Footer>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
      <ScheduleOrder modalShow={modalShow} handleClose={handleClose} />

    </Layout>
  );
}
function ScheduleOrder({ modalShow, handleClose }: { modalShow: boolean, handleClose: () => void }) {
  return (
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
  );
}

