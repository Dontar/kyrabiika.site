import React, { Fragment, useCallback, useState } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";

import Link from "next/link";
import Avatar from "react-avatar";

import useSWR from "swr";
import { LoggedInUser, SiteConfig } from "../db/DbTypes";
import { useOrderContext } from "./OrderContext";
import rest from "../utils/rest-client";

export default function Layout(p: JSX.IntrinsicElements["div"]) {
  const { children, ...props } = p;
  const { data: config } = useSWR<SiteConfig>("/api/config", rest.get);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const order = useOrderContext();

  const { data: session } = useSession();

  const logOut = useCallback(async (e: React.MouseEvent<Element>) => {
    e.preventDefault();
    order.clear();
    console.log("signOut" + `${window.location.origin}`);
    signOut();
    // await order.setUser(rest.get<LoggedInUser>("/api/logout"), false);
    // order.setUser({} as LoggedInUser);
    // router.push("/map");
  }, [order]);


  return (
    <div {...props} onClickCapture={() => setShowAvatarMenu(false)}>
      <Navbar bg="light" expand="md" sticky="top" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand href="/">
            <span>КуРабиЙкА</span>
            <span className="ms-2 navbar-brand-office">office</span>
          </Navbar.Brand>

          <Nav className="gap-2 flex-row">
            {order.user?.isLoggedIn === true ? (
              <>
                <Link href="/order" passHref>
                  <Nav.Link className="d-flex p-0 border rounded-circle bg-secondary text-white justify-content-center position-relative" style={{ width: "36px", height: "36px" }}>
                    <i className="fas fa-shopping-cart align-self-center" />
                    {!!order.items.length && (<Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">{order.items.length}</Badge>)}
                  </Nav.Link>
                </Link>
                <OverlayTrigger show={showAvatarMenu} onToggle={show => setShowAvatarMenu(show)} trigger="click" placement="bottom-start" overlay={(
                  <Popover id="popover-basic">
                    <ListGroup variant="flush" className="rounded" style={{ width: "15em" }}>
                      <Link href="/profile" passHref>
                        <ListGroup.Item action>Profile</ListGroup.Item>
                      </Link>
                      <Link href="/admin" passHref>
                        <ListGroup.Item action>Admin</ListGroup.Item>
                      </Link>
                      <ListGroup.Item action onClick={e => logOut(e)}>Logout</ListGroup.Item>
                    </ListGroup>
                  </Popover>
                )}>
                  <Nav.Item className="my-auto">
                    {!!session?.provider && session.provider !== "credentials"
                      ? <Avatar src={session.user.image ?? ""} round size="36px" style={{ cursor: "pointer" }} />
                      : <Avatar name={order.userName} email={order.user?.mail} round size="36px" style={{ cursor: "pointer" }} />
                    }
                  </Nav.Item>
                </OverlayTrigger>
              </>
            ) : (
              <Link href="/login" passHref={true}>
                <Nav.Link>Sing in / Sing up</Nav.Link>
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
              <StringsToHTML>
                {config?.small_promo}
              </StringsToHTML>
            </Col>
            <Col sm>
              <StringsToHTML>
                {config?.address}
              </StringsToHTML>
            </Col>
            <Col sm>
              <StringsToHTML>
                {config?.addr_worktime}
              </StringsToHTML>
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  );
}

function StringsToHTML({ children }: React.PropsWithChildren<unknown>) {
  let ch = children;
  if (typeof children == "string") {
    ch = children.split("\n").map((line, idx) => (<Fragment key={idx}>{line}<br /></Fragment>));
  }
  return (<p>{ch}</p>);
}
