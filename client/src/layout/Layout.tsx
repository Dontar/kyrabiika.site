import React from 'react';
import { Breadcrumb, BreadcrumbItemProps, Button, Col, Container, Form, FormControl, Navbar, Row } from 'react-bootstrap';
import { Link, LinkProps } from 'react-router-dom';

export interface LayoutProps {
  syncButton?: React.ReactElement;
}

function BreadcrumbItem(props: React.PropsWithChildren<BreadcrumbItemProps & Partial<LinkProps>>) {
  return (
    <Breadcrumb.Item {...props} linkAs={Link} linkProps={props} />
  );
}

function Layout(props: React.PropsWithChildren<LayoutProps>) {
  return (
    <>
      <Navbar bg="mainnav" expand="lg" sticky="top" variant="dark">
        <Navbar.Brand href="#home" className="text-light">Buldozer</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-light">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <Container className="pt-3">
        <Row className="flex-nowrap">
          <Col className="flex-fill">
            <Breadcrumb>
              <BreadcrumbItem to="/">Home</BreadcrumbItem>
              <BreadcrumbItem to="/">Library</BreadcrumbItem>
              <BreadcrumbItem active>Data</BreadcrumbItem>
            </Breadcrumb>
          </Col>
          {props.syncButton}
        </Row>
      </Container>
      <Container>
        {props.children}
      </Container>
    </>
  );
}

export default Layout;
