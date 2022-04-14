import React, { useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import Router, { useRouter } from "next/router";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";

import Layout from "../../lib/comps/Layout";
import UserProfile from "../../lib/comps/profile/UserProfile";
import UserAddresses from "../../lib/comps/profile/UserAddresses";
import UserOrders from "../../lib/comps/profile/UserOrders";
import { connect, UserModel } from "../../lib/db/Connection";
import { convert } from "../../lib/utils/Utils";

// export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
//   await connect();
//   const { req } = context;
//   const session = await getSession({ req });

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }
//   const orders = JSON.stringify(await UserModel
//     .findOne({ mail: session?.user.email ?? "" })
//     .select("orders")
//     .lean({ autopopulate: true }));


//   return {
//     props: {
//       userOrders: orders
//     }
//   };
// };

export default function Profile() {

  const router = useRouter();
  const { location } = router.query;

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push("/login");
    }
  });

  if (status === "loading") {
    console.log('inside Profile index');
    return null;
  }


  return (
    <Layout>
      <Container fluid className="mt-2">
        <Tab.Container defaultActiveKey={location && !Array.isArray(location) ? `#${location}` : "#profile"}>
          <Row>
            <Col md={2} className="mb-3">
              <ListGroup className="position-sticky" style={{ top: "4em" }} variant="flush">
                <ListGroup.Item action href="#profile">Profile</ListGroup.Item>
                <ListGroup.Item action href="#orders">Orders</ListGroup.Item>
                <ListGroup.Item action href="#addresses">Addresses</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col>
              <Tab.Content>
                <Tab.Pane eventKey="#profile" title="Profile">
                  <UserProfile />
                </Tab.Pane>
                <Tab.Pane eventKey="#addresses" title="Addresses">
                  <UserAddresses />
                </Tab.Pane>
                <Tab.Pane eventKey="#orders" title="Orders">
                  <UserOrders />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Layout>
  );
}
