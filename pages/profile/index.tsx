import React from "react";
import { useSession } from "next-auth/react";
import Router from "next/router";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";

import Layout from "../../lib/comps/Layout";
import UserProfile from "../../lib/comps/profile/UserProfile";

export default function Profile() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      Router.push("/login");
    }
  });

  if (status === "loading") {
    console.log('inside Profile index')
    return null;
  }

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
                  <UserProfile />
                </Tab.Pane>
                <Tab.Pane eventKey="#orders" title="Orders">
                  <h3>Orders</h3>
                  <hr />

                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Layout>
  );
}
