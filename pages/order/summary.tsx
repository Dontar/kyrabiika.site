import React, { ReactElement, useState, useContext, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";

import Layout from "../../lib/comps/Layout";
import Link from "next/link";

import { OrderItemRow } from "../../lib/comps/OrderItemRow";
import { useOrderContext } from "../../lib/comps/OrderContext";
import { formatter } from "../../lib/utils/Utils";
import { AddNewAddress } from "../../lib/comps/profile/UserAddresses";
import { APIMessageContext } from "../../lib/comps/GlobalMessageHook";

import GoogleMap from "../../lib/comps/GoogleMap";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { Address } from "../../lib/db/DbTypes";

export default function OrderSummary() {
  const [modalShow, setModalShow] = useState(false);
  const [showAddNew, setShowAddNew] = useState<boolean>(false);
  const [editAddress, setEditAddress] = useState<Address | {}>({});
  const [validated, setValidated] = useState(false);
  const [input, setInput] = useState({});

  const handleClose = () => setModalShow(false);

  const order = useOrderContext();
  const { writeMessage } = useContext(APIMessageContext);

  useEffect(() => {
    const orderTransform = order.items.map(x => {
      const {
        item: { _id: item },
        count
      } = x;
      return { item, count };
    });

    setInput(input => ({
      ...input,
      fullName: `${order.user?.firstName} ${order.user?.lastName}`,
      mail: order.user?.mail,
      phone: order.user?.phone,
      items: orderTransform,
      date: new Date()
    }));
    console.log("I am in useEffect");
  }, [order]);

  const handleInputChange = (event: any) => {
    setInput(input => ({ ...input, [event.target.name]: event.target.value }));
  };

  const handleDropdown = (eventKey: string) => {
    console.log(eventKey);
    if (eventKey === "99") {
      setShowAddNew(true);
      return;
    }
    const selectedAddress = order.user?.address?.filter(x => x.id === eventKey);
    setInput(input => ({ ...input, completeAddress: selectedAddress && selectedAddress[0].completeAddress }));
    console.log(input)
  };

  const confirmation = () => {
    order.setProgress("Confirmed");
    const date = new Date().toString().slice(0, 33);
    setInput(input => ({ ...input, date }));
    console.log(input)
  };

  // const onNewPosition = (pos: google.maps.LatLngLiteral, address?: string) => {
  //   order.setUserAddress(address!, pos);
  // };

  // const render = (status: Status): ReactElement => {
  //   if (status === Status.LOADING) return <h3>{status} ..</h3>;
  //   if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  //   return <></>;
  // };

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
            {/* <Button onClick={() => setShowAddNew(!showAddNew)}>Open</Button> */}
            <Stack as={Form} noValidate validated={validated} onSubmit={(e: React.SyntheticEvent) => { e.preventDefault(); handleSubmitLogin(); }} gap={4}>
              <Stack className="col-md-6" gap={2}>
                <Form.Group >
                  <Form.Label>Full name</Form.Label>
                  <Form.Control required name="fullName" value={input.fullName ?? ""} onChange={handleInputChange} autoComplete="on" />
                </Form.Group>
                <Form.Group >
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    value={input.mail ?? ""}
                    disabled
                    name="mail"
                  />
                </Form.Group>
                <Form.Group >
                  <Form.Label>Phone</Form.Label>
                  <Form.Control required name="phone" value={input.phone ?? ""} onChange={handleInputChange} autoComplete="tel" />
                </Form.Group>
              </Stack >

              <DropdownButton variant="outline-success" title="Choose delivery address" onSelect={handleDropdown}>
                {
                  order.user !== undefined
                    ? order.user.address!.map(addr => {
                      return (
                        <Dropdown.Item key={addr.id} eventKey={addr.id} active={addr.id === editAddress.id}>{addr.completeAddress.substring(0, 40)}</Dropdown.Item>
                      );
                    })
                    : null
                }
                {/* <Dropdown.Item eventKey="1" active>Action</Dropdown.Item>
              <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
              <Dropdown.Item eventKey="3">Active Item</Dropdown.Item> */}
                <Dropdown.Divider />
                <Dropdown.Item eventKey="99" >Add new address</Dropdown.Item>
              </DropdownButton  >

            </Stack>
            <AddNewAddress show={showAddNew} hide={setShowAddNew} writeMessage={writeMessage} editAddress={editAddress} />
            <hr />
            {/* <Wrapper apiKey="AIzaSyDCTQ1_GSpfRU2tyKg78QLkN8BeaGQr4Ho" render={render}>
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

            </Wrapper> */}
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
                    <Button variant="success" onClick={confirmation}> Confirm order </Button>
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
            <i className="far fa-calendar text-muted" />
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
            <i className="far fa-clock text-muted" />
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

