import React from 'react';
import { Link, RouteComponentProps } from '@reach/router';
import { Col, Container, Nav, ProgressBar, Row } from 'react-bootstrap';

import Layout from '../layout';

import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faListAlt } from '@fortawesome/free-regular-svg-icons';
import { faCheese, faTruck } from '@fortawesome/free-solid-svg-icons';

// const formatter = new Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'BGN' });

export default function OrderProgress(_props: React.PropsWithChildren<RouteComponentProps<{}>>) {
  return (
    <Layout navLinks={
      <Nav>
        <Nav.Link to="/" as={Link}>Home</Nav.Link>
      </Nav>
    }>
      <Container className="mt-5 p-5">
        <h2 className="text-center">Delivery</h2>
        <div style={{ height: "8em" }} />
        <Row className="mb-2">
          <Col className="text-center">
            <div>
              <Icon size="5x" icon={faListAlt} />
            </div>
            Processing
          </Col>
          <Col className="text-center">
            <div>
              <Icon size="5x" icon={faCheese} />
            </div>
            Preparing
          </Col>
          <Col className="text-center">
            <div>
              <Icon size="5x" icon={faTruck} />
            </div>
            Delivering
          </Col>
        </Row>
        <ProgressBar style={{ height: "3em" }}>
          <ProgressBar striped variant="danger" now={34} />
          <ProgressBar striped variant="warning" now={34} />
          <ProgressBar striped variant="success" now={34} />
        </ProgressBar>
        <div style={{ height: "12em" }} />
      </Container>
    </Layout>
  );
}
