import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import ListGroup from "react-bootstrap/ListGroup";

import Layout from "../lib/comps/Layout";
import { useOrderContext } from "../lib/comps/OrderContext";

export default function Profile() {

  useOrderContext({
    redirectTo: "/login",
  });

  return (
    <Layout>
      <Container fluid className="mt-2">
        <Tab.Container defaultActiveKey="#profile">
          <Row>
            <Col lg={2}>
              <ListGroup className="position-sticky" style={{ top: "4em" }} variant="flush">
                <ListGroup.Item action href="#profile">Profile</ListGroup.Item>
                <ListGroup.Item action href="#orders">Orders</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col>
              <Tab.Content>
                <Tab.Pane eventKey="#profile" title="Profile">


                </Tab.Pane>
                <Tab.Pane eventKey="#orders" title="Orders">



                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Layout>
  );
}
