import React, { ReactElement, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

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
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import CloseButton from "react-bootstrap/CloseButton";


import Layout from "../../lib/comps/Layout";
import Link from "next/link";

import { OrderItemRow } from "../../lib/comps/OrderItemRow";
import { useOrderContext } from "../../lib/comps/OrderContext";
import { formatter } from "../../lib/utils/Utils";
import { AddNewAddress } from "../../lib/comps/profile/UserAddresses";
import { APIMessageContext } from "../../lib/comps/GlobalMessageHook";

import GoogleMap from "../../lib/comps/GoogleMap";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { LoggedInUser, Order } from "../../lib/db/DbTypes";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import rest, { FetchError } from "../../lib/utils/rest-client";

type returnOrderSave = {
  id: string;
  message: string;
}


export default function OrderSummary() {
  const [modalShow, setModalShow] = useState(false);
  const [input, setInput] = useState<Order | {}>({});
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const router = useRouter();
  const order = useOrderContext();
  const { writeMessage } = useContext(APIMessageContext);

  const handleClose = () => setModalShow(false);

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
      name: `${order.user?.firstName} ${order.user?.lastName}`,
      mail: order.user?.mail,
      phone: order.user?.phone,
      items: orderTransform,
    }));
    console.log("I am in useEffect");
  }, [order]);

  const handleInputChange = (event: any) => {
    setInput(input => ({ ...input, [event.target.name]: event.target.value }));
  };

  const handleDropdown = (eventKey: string | null) => {
    console.log(eventKey);
    if (eventKey === null) {
      return;
    }
    if (eventKey === "99") {
      router.push("/profile?location=addresses");
      return;
    }
    const address = order.user?.address?.filter(x => x.id === eventKey);
    if (address?.length === 1) {
      const [{ completeAddress }] = address;
      setInput(input => ({ ...input, selectedAddress: completeAddress }));
    }
    console.log(input)
  };

  const confirmation = async () => {
    if (!(input.phone?.length > 0)) {
      setShow2(true);
      return;
    }
    if (!(input.selectedAddress?.length > 0)) {
      setShow(true);
      return;
    }
    setShow(false);
    const date = new Date().toString().slice(0, 33);
    console.log(input)
    try {
      const response: returnOrderSave = await rest.post("/api/order", { ...input, date, progress: "Confirmed" });
      writeMessage("success", response.message);
      order.clearOrder();
      order.setProgress("Confirmed");
      order.setUser();
      router.push("/order/progress");
    } catch (e) {
      if (e instanceof FetchError) {
        return writeMessage("danger", e.data?.message || e.message);
      }
      console.error("An unexpected error:", e);
    }
  };

  const setPopover = (text: string, close: any) => {
    return (
      <Popover id="popover-basic" className="border border-danger">
        <Popover.Body className="p-2 d-flex justify-content-between">
          <div>
            {text}

          </div>
          <CloseButton onClick={() => close(false)} />
        </Popover.Body>
      </Popover>
    );
  };

  return (
    <Layout>
      <Container className="mt-5">
        <Row >
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

            <Stack className="col-md-6" gap={2}>
              <Form.Group >
                <Form.Label>Full name</Form.Label>
                <Form.Control required name="name" value={input.name ?? ""} onChange={handleInputChange} autoComplete="on" />
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
                <OverlayTrigger show={show2} placement="right" overlay={setPopover("You must add a phone number", setShow2)}>
                  <Form.Control required name="phone" value={input.phone ?? ""} onChange={handleInputChange} autoComplete="tel" />
                </OverlayTrigger>
              </Form.Group>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <OverlayTrigger show={show} placement="right" overlay={setPopover("Please select an address", setShow)}>
                  <Form.Control
                    as="textarea"
                    value={input?.selectedAddress ?? ""}
                    required
                    readOnly
                    style={{
                      height: "5.5em",
                    }}
                  />
                </OverlayTrigger>
              </Form.Group>
              <DropdownButton variant="outline-success" title="Choose delivery address" className="mt-2" onSelect={handleDropdown} >
                {
                  order.user !== undefined
                    ? order.user.address!.map(addr => {
                      return (
                        <Dropdown.Item key={addr.id} eventKey={addr.id} >{addr.completeAddress.substring(0, 40)}</Dropdown.Item>
                      );
                    })
                    : null
                }
                <Dropdown.Divider />
                <Dropdown.Item eventKey="99" >Add new address</Dropdown.Item>
              </DropdownButton  >


            </Stack >


            <hr />
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

                  <Button variant="success" onClick={confirmation}> Confirm order </Button>

                </Card.Footer>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
      <ScheduleOrder modalShow={modalShow} handleClose={handleClose} />

    </Layout >
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

