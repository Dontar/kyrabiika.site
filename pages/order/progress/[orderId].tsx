import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import { Button, Stack } from "react-bootstrap";

import Layout from "../../../lib/comps/Layout";

import { classes } from "../../../lib/utils/Utils";
import useCurrentUserOrders from "../../../lib/utils/callUserOrders";
import { Order } from "../../../lib/db/DbTypes";

export default function OrderProgress() {
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const { data } = useCurrentUserOrders();

  const router = useRouter();
  const { orderId } = router.query;

  useEffect(() => {
    const order = data?.find(x => x._id.toString() == orderId);
    console.log((new Date().getTime() - new Date(selectedOrder?.date ?? new Date()).getTime()) / 60000);
    setSelectedOrder(order);
    console.log(order)
  }, [data, orderId]);

  return (
    <Layout>
      <Container className="mt-5 p-5">

        <h2 className="text-center mb-3">Delivery status:
          <span className="status text-center">{` ${selectedOrder?.progress}`}</span>
          <style jsx>{`
              .status {
              font: italic small-caps bold 2rem cursive;
              }`
          }</style>
        </h2>
        <h4 className="text-center mb-3">Address:
          <span className="span text-center">{` ${selectedOrder?.selectedAddress}`}</span>
          <style jsx>{`
              .span {
              font: italic 1.5rem cursive;
              }`
          }</style>
        </h4>
        <h4 className="text-center mb-3">Order time:
          <span className="span text-center">{` ${new Date(selectedOrder?.date ?? "").toString().slice(0, 21)}`}</span>
          <style jsx>{`
              .span {
               font: italic 1.5rem cursive;
              }`
          }</style>
        </h4>
        <Row md={2} lg={3} className="justify-content-md-center">
          <Col >
            <ListGroup as="ol" numbered>
              {
                selectedOrder?.items.map(x => (
                  <ListGroup.Item
                    key={x.item._id}
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="fw-bold ms-2 me-auto">
                      {x.item.name}
                    </div>
                    <Badge bg="primary" className="align-self-center" pill>
                      {x.count}
                    </Badge>
                  </ListGroup.Item>
                ))
              }
            </ListGroup>
          </Col>
        </Row>
        <div style={{ height: "8em" }} />
        <Row className="mb-2">
          <Col className={classes({ "text-center": true, "text-muted": selectedOrder?.progress !== "Processing" })}>
            <div>
              <i className="far fa-list-alt fs-1" />
            </div>
            Processing
          </Col>
          <Col className={classes({ "text-center": true, "text-muted": selectedOrder?.progress !== "Preparing" })}>
            <div>
              <i className="fas fa-cheese fs-1" />
            </div>
            Preparing
          </Col>
          <Col className={classes({ "text-center": true, "text-muted": selectedOrder?.progress !== "Delivering" })}>
            <div>
              <i className="fas fa-truck fs-1" />
            </div>
            Delivering
          </Col>
        </Row>
        <ProgressBars now={(new Date().getTime() - new Date(selectedOrder?.date ?? new Date()).getTime()) / 60000} />
        <div style={{ height: "12em" }} />
      </Container>
    </Layout>
  );
}

function ProgressBars({ now }: { now: number }) {
  const sec = 120 / 3;
  return (
    <ProgressBar style={{ height: "3em" }}>
      <ProgressBar striped variant="danger" now={(now > sec) ? sec : now} />
      <ProgressBar striped variant="warning" now={(now > (sec * 2)) ? (sec * 2) : (now - sec)} />
      <ProgressBar striped variant="success" now={(now > (sec * 3)) ? (sec * 3) : (now - sec * 2)} />
    </ProgressBar>
  );
}
