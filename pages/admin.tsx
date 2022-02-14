import { useSession } from "next-auth/react";
// import { Session } from "next-auth/core/types";
import { useRouter } from "next/router";
import { Session } from "next-auth";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import ListGroup from "react-bootstrap/ListGroup";

import Layout from "../lib/comps/Layout";
import { SiteConfigPanel } from "../lib/comps/admin/SiteConfigPanel";
import { ItemsPanel } from "../lib/comps/admin/ItemsPanel";
import { UsersPanel } from "../lib/comps/admin/UsersPanel";
import { SiteConfigContext } from "../lib/comps/admin/SiteConfigContext";
import { NextResponse } from "next/server";


export default function Admin() {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push("/login");
    }
  });
  // const user = session;

  if (!session || !session?.userRoles?.includes('Admin')) {
    console.log('inside Admin index');
    router.push("/");
    return null;
    // return NextResponse.redirect("/login");
  }


  return (
    <Layout>
      <Container fluid className="mt-2">
        <Tab.Container defaultActiveKey="#site_config">
          <Row>
            <Col lg={2}>
              <ListGroup className="position-sticky" style={{ top: "4em" }} variant="flush">
                <ListGroup.Item action href="#site_config">Site config</ListGroup.Item>
                <ListGroup.Item action href="#items">Items</ListGroup.Item>
                <ListGroup.Item action href="#users">Users</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col>
              <Tab.Content>
                <Tab.Pane eventKey="#site_config" title="Site config">
                  <SiteConfigContext>
                    <SiteConfigPanel />
                  </SiteConfigContext>
                </Tab.Pane>
                <Tab.Pane eventKey="#items" title="Items">
                  <ItemsPanel />
                </Tab.Pane>
                <Tab.Pane eventKey="#users" title="Users">
                  <UsersPanel />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Layout>
  );
}
