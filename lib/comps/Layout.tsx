import React, { Fragment } from "react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";

import Link from "next/link";
import { useRouter } from "next/router";
import { fetchJson } from "../utils/Utils";
import useUser from "../utils/useUser";

import useSWR from "swr";
import { SiteConfig } from "../db/DbTypes";

export interface LayoutProps {
  navLinks: React.ReactNode;
}

export default function Layout({ navLinks, children }: React.PropsWithChildren<LayoutProps>) {
  const { data, error } = useSWR<SiteConfig>("/api/config", url => fetch(url).then(r => r.json()));

  const { user, mutateUser } = useUser();
  const router = useRouter();

  const logOut = async (e: any) => {
    e.preventDefault();
    mutateUser(
      await fetchJson("/api/logout"),
      false
    );
    router.push("/login");
  };

  return (
    <Fragment>
      <Navbar bg="light" expand="md" sticky="top">
        <Container fluid>
          <Navbar.Brand href="/">
            <span>Kyrabiika</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            {navLinks}
            <Nav>
              {user?.isLoggedIn === false && (
                <Link href="/login" passHref={true}>
                  <Nav.Link>Login / Register</Nav.Link>
                </Link>
              )}
              <Link href="/admin" passHref={true}>
                <Nav.Link>Admin</Nav.Link>
              </Link>
              {user?.isLoggedIn === true && (
                <Link href="/api/logout" passHref={true}>
                  <Nav.Link onClick={(e: any) => logOut(e)} >Logout</Nav.Link>
                </Link>
              )}
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>
      {children}
      <Container id="contacts" fluid className="bg-secondary bg-gradient mt-5 text-light">
        <Container className="py-5">
          <Row>
            <Col sm>
              <p>
                {data?.small_promo.split("\n").map(line => (<>{line}<br/></>))}
              </p>
            </Col>
            <Col sm>
              <p>
                {data?.address.split("\n").map(line => (<>{line}<br/></>))}
              </p>
            </Col>
            <Col sm>
              <p>
                {data?.addr_worktime.split("\n").map(line => (<>{line}<br/></>))}
              </p>
            </Col>
          </Row>
        </Container>
      </Container>
    </Fragment>
  );
}
