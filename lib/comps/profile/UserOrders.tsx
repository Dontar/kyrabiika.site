import React, { useState, useEffect } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";

import { useOrderContext } from "../OrderContext";
import { Order } from "../../db/DbTypes";
import { TabHeader } from "../TabHeader";
import { Image } from "react-bootstrap";
import Link from "next/link";
import useCurrentUserOrders from "../../utils/callUserOrders";


const totalSum = (order: Order | undefined) => {
  return order?.items.reduce((a, x) => (
    a += x.count * x.item.price
  ), order.delivery).toFixed(2).split(".").join(",");
};

export default function UserOrders({ type }: { type: string }) {

  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const [showDetails, setShowDetails] = useState(false);
  const { data, isError } = useCurrentUserOrders();

  if (isError) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const handleDetailedView = (order: Order | undefined) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  return (
    <>
      {
        type !== "active"
          ? <Container fluid className="px-0" >
            <TabHeader title="User Orders" />
            <Row xl={2} className="justify-content-center">
              <Col xl={8}>
                <Stack direction="vertical" gap={2}>
                  {
                    data
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((x, i) => (
                        <button key={i} className="m-2 border-0" style={{ background: "none" }} onClick={() => handleDetailedView(x)}>
                          <Card as={Stack} direction="horizontal" >
                            {/* <button className="m-2 border-0" style={{ background: "none", maxWidth: "8rem" }} onClick={() => handleUpdateWithGoogle(x.id)}> */}
                            <Card.Img style={{ maxWidth: "9rem", minWidth: "4rem" }} src={`/api/images/${x.items[0].item.name}/thumb.jpg`} />
                            {/* </button> */}
                            <Card.Body className="d-flex flex-column align-items-start justify-content-around py-1" >
                              <Card.Title style={{ fontSize: "1.5rem" }}>Kyrabiika</Card.Title>
                              <Card.Text as="div" style={{ textAlign: "left" }}>
                                <div>{new Date(x.date).toString().slice(0, 22)}</div>
                                <div>{x.selectedAddress}</div>
                                <div>Status: <b>{x.progress}</b></div>
                                <div><b>{`${totalSum(x)} лв.`}</b></div>
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </button>
                      ))
                  }
                </Stack>
                <OrderDetails show={showDetails} hide={() => setShowDetails(false)} selectedOrder={selectedOrder} />
              </Col>
            </Row>
          </Container>
          : <Container fluid className="px-0" >
            <TabHeader title="Active Orders" />
            <Row className="justify-content-center">
              <Col className="px-0" >
                <Stack direction="vertical" gap={2}>
                  {
                    data
                      .filter(x => x.progress !== "Delivered")
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((x, i) => (
                        <button key={i} className="m-2 border-0" style={{ background: "none" }} onClick={() => handleDetailedView(x)}>
                          <Card as={Stack} direction="horizontal" >
                            {/* <button className="m-2 border-0" style={{ background: "none", maxWidth: "8rem" }} onClick={() => handleUpdateWithGoogle(x.id)}> */}
                            <Image src={`/api/images/${x.items[0].item.name}/thumb.jpg`} alt="" className="rounded align-self-center" width={100} height={80} />
                            {/* </button> */}
                            <Card.Body className="d-flex flex-column align-items-start justify-content-around py-1" >
                              {/* <Card.Title style={{ fontSize: "1.5rem" }}>Kyrabiika</Card.Title> */}
                              <Card.Text as="div" style={{ textAlign: "left" }}>
                                <div>{new Date(x.date).toString().slice(0, 22)}</div>
                                {/* <div>{x.selectedAddress}</div> */}
                                <div>Status: <b>{x.progress}</b></div>
                                <div><b>{`${totalSum(x)} лв.`}</b></div>
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </button>
                      ))
                  }
                </Stack>
                <OrderDetails show={showDetails} hide={() => setShowDetails(false)} selectedOrder={selectedOrder} />
              </Col>
            </Row>
          </Container>
      }
    </>
  );
}

type OrderDetails = {
  show: boolean;
  hide: () => void;
  selectedOrder: Order | undefined;
}

export function OrderDetails({ show, hide, selectedOrder }: OrderDetails) {
  const order = useOrderContext();

  return (
    <Modal show={show} onHide={hide}>
      <Modal.Header closeButton>
        <Modal.Title>Order details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          selectedOrder?.items?.map((x, i) => (
            <Row key={i} className="mb-2">
              <Col xs={9}>{x.item.name}</Col>
              <Col xs={3} style={{ textAlign: "right" }}>
                {`${x.count} x ${x.item.price} лв.`}
              </Col>
            </Row>
          ))
        }
        <hr />
        <Row>
          <Col xs={9}>Delivery cost</Col>
          <Col xs={3} style={{ textAlign: "right" }}>{selectedOrder?.delivery === 0 ? "Free" : `${selectedOrder?.delivery},00 лв.`}</Col>
        </Row>
        <Row>
          <Col xs={9}>Total amount</Col>
          <Col xs={3} style={{ textAlign: "right" }}>{`${totalSum(selectedOrder)} лв.`}</Col>
        </Row>
        {/* <hr />
        <Row>
          <Col xs={9}>Total cost</Col>
          <Col xs={3} style={{ textAlign: "right" }}>{`${totalSum(selectedOrder)} лв.`}</Col>
        </Row> */}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Link href={`/order/progress/${selectedOrder?._id}`} passHref>
          <Button variant="success" onClick={() => hide()}>
            Current status!
          </Button>
        </Link>
        <Button variant="primary" onClick={() => { hide(); order.setItems(selectedOrder ? selectedOrder.items : []); }}>
          Do it again!
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
