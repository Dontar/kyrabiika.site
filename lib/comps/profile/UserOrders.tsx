import React, { useState } from "react";
import useSWR from "swr";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";

import { useOrderContext } from "../OrderContext";
import rest from "../../utils/rest-client";
import { Order } from "../../db/DbTypes";
import { TabHeader } from "../TabHeader";


const totalSum = (order: Order | undefined) => {
  return order?.items.reduce((a, x) => (
    a += x.count * x.item.price
  ), order.delivery).toFixed(2).split(".").join(",");
};

export default function UserOrders() {

  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const [showDetails, setShowDetails] = useState(false);
  const { data, error } = useSWR<Order[] | []>("/api/order", rest.get);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const handleDetailedView = (order: Order | undefined) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  return (
    <>
      <Container  >
        <TabHeader title="User Orders" />
        <Row xl={2} className="justify-content-center">
          <Col xl={8}>
            <Stack direction="vertical" gap={2}>
              {
                data?.map((x, i) => (
                  <button key={i} className="m-2 border-0" style={{ background: "none" }} onClick={() => handleDetailedView(x)}>
                    <Card as={Stack} direction="horizontal" >
                      {/* <button className="m-2 border-0" style={{ background: "none", maxWidth: "8rem" }} onClick={() => handleUpdateWithGoogle(x.id)}> */}
                      <Card.Img style={{ maxWidth: "9rem", minWidth: "4rem" }} src={`/api/images/${x.items[0].item.name}/thumb.jpg`} />
                      {/* </button> */}
                      <Card.Body className="d-flex flex-column align-items-start justify-content-around py-1" >
                        <Card.Title style={{ fontSize: "1.5rem" }}>Kyrabiika</Card.Title>
                        <Card.Text as="div" style={{ textAlign: "left" }}>
                          <div>{new Date(`${x.date}`).toUTCString().slice(0, 22)}</div>
                          <div>{x.selectedAddress}</div>
                          <div>Status: <b>{x.progress}</b></div>
                          <div><b>{`${totalSum(x)} лв.`}</b></div>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </button>
                )).reverse()
              }
            </Stack>
            <OrderDetails show={showDetails} hide={() => setShowDetails(false)} selectedOrder={selectedOrder} />
          </Col>
        </Row>
      </Container>
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
      <Modal.Footer>
        <Button variant="primary" onClick={() => { hide(); console.log(selectedOrder); order.setItems(selectedOrder ? selectedOrder.items : []); }}>
          Do it again!
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
