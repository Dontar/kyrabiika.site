import Link from "next/link";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";

import Layout from "../../lib/comps/Layout";

import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faListAlt } from "@fortawesome/free-regular-svg-icons/faListAlt";
import { faTruck } from "@fortawesome/free-solid-svg-icons/faTruck";
import { faCheese } from "@fortawesome/free-solid-svg-icons/faCheese";
import { classes } from "../../lib/utils/Utils";
import { useOrderContext } from "../../lib/comps/OrderContext";

export default function OrderProgress() {
  const order = useOrderContext({
    redirectTo: "/login"
  });

  return (
    <Layout>
      <Container className="mt-5 p-5">
        <h2 className="text-center">Delivery</h2>
        <div style={{ height: "8em" }} />
        <Row className="mb-2">
          <Col className={classes({ "text-center": true, "text-muted": order.progress !== "Processing" })}>
            <div>
              <Icon size="5x" icon={faListAlt} />
            </div>
            Processing
          </Col>
          <Col className={classes({ "text-center": true, "text-muted": order.progress !== "Preparing" })}>
            <div>
              <Icon size="5x" icon={faCheese} />
            </div>
            Preparing
          </Col>
          <Col className={classes({ "text-center": true, "text-muted": order.progress !== "Delivering" })}>
            <div>
              <Icon size="5x" icon={faTruck} />
            </div>
            Delivering
          </Col>
        </Row>
        <ProgressBars now={40} />
        <div style={{ height: "12em" }} />
      </Container>
    </Layout>
  );
}

function ProgressBars({ now }: { now: number }) {
  const sec = 100 / 3;
  return (
    <ProgressBar style={{ height: "3em" }}>
      <ProgressBar striped variant="danger" now={(now > sec) ? sec : now} />
      <ProgressBar striped variant="warning" now={(now > (sec * 2)) ? (sec * 2) : (now - sec)} />
      <ProgressBar striped variant="success" now={(now > (sec * 3)) ? (sec * 3) : (now - sec * 2)} />
    </ProgressBar>
  );
}
