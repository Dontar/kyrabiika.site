import React, { Fragment } from "react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";

import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/faShoppingCart";


import Link from "next/link";
import { useRouter } from "next/router";
import Avatar from "react-avatar";

import useSWR from "swr";
import { LoggedInUser, SiteConfig } from "../db/DbTypes";
import { useOrderContext } from "./OrderContext";
import rest from "../utils/rest-client";

export default function Layout({ children }: React.PropsWithChildren<unknown>) {
  const { data } = useSWR<SiteConfig>("/api/config", url => fetch(url).then(r => r.json()));

  const router = useRouter();
  const order = useOrderContext();

  const logOut = async (e: React.MouseEvent<Element>) => {
    e.preventDefault();
    order.clear();
    await order.setUser(rest.get<LoggedInUser>("/api/logout"), false);
    router.push("/");
  };

  return (
    <Fragment>
      <Navbar bg="light" expand="md" sticky="top" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand href="/">
            <span>КуРабиЙкА</span>
            <span className="ms-2 navbar-brand-office">office</span>
          </Navbar.Brand>

          <Nav className="gap-2 flex-nowrap">
            {order.user?.isLoggedIn === true ? (
              <>
                <Link href="/order" passHref>
                  <Nav.Link className="d-flex p-0 border rounded-circle bg-secondary text-white justify-content-center position-relative" style={{ width: "36px", height: "36px" }}>
                    <Icon icon={faShoppingCart} className="align-self-center"/>
                    {!!order.items.length && (<Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">{order.items.length}</Badge>)}
                  </Nav.Link>
                </Link>
                <OverlayTrigger trigger="click" placement="bottom-start" overlay={(
                  <Popover id="popover-basic">
                    <Popover.Body>

                      <ListGroup variant="flush">
                        <Link href="/profile" passHref>
                          <ListGroup.Item action>Profile</ListGroup.Item>
                        </Link>
                        <Link href="/admin" passHref>
                          <ListGroup.Item action>Admin</ListGroup.Item>
                        </Link>
                        <ListGroup.Item action onClick={e => logOut(e)}>Logout</ListGroup.Item>
                      </ListGroup>
                    </Popover.Body>
                  </Popover>
                )}>
                  <Avatar name={order.userName} email={order.user.mail} round size="36px" className="my-auto" />
                </OverlayTrigger>

              </>
            ) : (
              <Link href="/login" passHref={true}>
                <Nav.Link>Login / Register</Nav.Link>
              </Link>

            )}
          </Nav>
        </Container>
      </Navbar>
      {children}
      <Container id="contacts" fluid className="bg-secondary bg-gradient mt-5 text-light">
        <Container className="py-5">
          <Row>
            <Col sm>
              <p>
                {data?.small_promo.split("\n").map((line, idx) => (<Fragment key={idx}>{line}<br /></Fragment>))}
              </p>
            </Col>
            <Col sm>
              <p>
                {data?.address.split("\n").map((line, idx) => (<Fragment key={idx}>{line}<br /></Fragment>))}
              </p>
            </Col>
            <Col sm>
              <p>
                {data?.addr_worktime.split("\n").map((line, idx) => (<Fragment key={idx}>{line}<br /></Fragment>))}
              </p>
            </Col>
          </Row>
        </Container>
      </Container>
    </Fragment>
  );
}
