import React, { ReactElement, useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import Layout from "../../lib/comps/Layout";
import Link from "next/link";

import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons/faCalendar";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons/faCrosshairs";
import { OrderItemRow } from "../../lib/comps/OrderItemRow";
import { useOrderContext } from "../../lib/comps/OrderContext";
import { formatter } from "../../lib/utils/Utils";

import streetDb from "../../lib/db/street-db.json";
import GoogleMap from "../../lib/comps/GoogleMap";
import { Status, Wrapper } from "@googlemaps/react-wrapper";

export default function OrderSummary() {
  const [modalShow, setModalShow] = useState(false);
  const [address, setAddress] = useState<string>();

  const handleClose = () => setModalShow(false);

  const order = useOrderContext();

  useEffect(() => {
    setAddress(order.user.address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNewPosition = (pos: google.maps.LatLngLiteral, address: string) => {
    order.setUserAddress(address);
    order.setUserAddressPos(pos);
  };

  const onChangeAddress: React.ChangeEventHandler<HTMLInputElement> = e => {
    setAddress(e.target.value);
  };

  const render = (status: Status): ReactElement => {
    if (status === Status.LOADING) return <h3>{status} ..</h3>;
    if (status === Status.FAILURE) return <h3>{status} ...</h3>;
    return <></>;
  };

  return (
    <Layout navLinks={
      <Nav>
        <Link href="/" passHref>
          <Nav.Link>Home</Nav.Link>
        </Link>
      </Nav>
    }>
      <Container className="mt-5">
        <Row>
          <Col md={8}>
            <h4>Products</h4>
            <hr />
            <ListGroup className="mb-3">
              {order.items.map((item, idx) => (
                <OrderItemRow key={idx} item={item} onRemove={() => order.delItem(item)} />
              ))}
            </ListGroup>
            <h4>Address &amp; Delivery</h4>
            <hr />
            <Wrapper apiKey="AIzaSyDCTQ1_GSpfRU2tyKg78QLkN8BeaGQr4Ho" render={render}>
              <ListGroup className="mb-3">
                <ListGroup.Item>
                  <Row>
                    <Col>
                      {/* <InputGroup>
                        <Form.Control type="text" placeholder="Enter address..." list="street-db" value={address} onChange={onChangeAddress} />
                        <datalist id="street-db">
                          {streetDb.map((street, idx) => (<option key={idx} value={street.name}>{`${street.name}, ${street.type}`}</option>))}
                        </datalist>
                        <Button variant="outline-secondary">
                          <Icon icon={faCrosshairs} />
                        </Button>
                      </InputGroup> */}
                      <Form.Text>{order.user.firstName + " " + order.user.lastName}</Form.Text>
                    </Col>
                    <Col>
                      <Form.Control type="text" placeholder="Enter phone..." value={order.user.phone} onChange={(e) => order.setUserPhone(e.target.value)} />
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <GoogleMap pin={order.user.address_pos} address={address} onNewPosition={onNewPosition} />
                  <Form.Control as="textarea" value={order.user.address} className="mt-1"/>
                </ListGroup.Item>

                <ListGroup.Item action onClick={() => setModalShow(true)}>
                  Tue 28 Sep (12:00 - 12:30)
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

