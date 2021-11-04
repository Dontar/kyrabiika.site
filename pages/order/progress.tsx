import React from 'react';
import Link from 'next/link';
import { Col, Container, Nav, ProgressBar, Row } from 'react-bootstrap';

import Layout from '../../lib/Layout';

import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faListAlt } from '@fortawesome/free-regular-svg-icons';
import { faCheese, faTruck } from '@fortawesome/free-solid-svg-icons';
import { classes } from '../../lib/Utils';
import { useOrderContext } from '../../lib/OrderContext';

// const formatter = new Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'BGN' });


export default function OrderProgress() {
  const order = useOrderContext();
  // const [now, setNow] = useState(0);

  return (
    <Layout navLinks={
      <Nav>
        <Link href="/" passHref>
          <Nav.Link>Home</Nav.Link>
        </Link>
      </Nav>
    }>
      <Container className="mt-5 p-5">
        <h2 className="text-center">Delivery</h2>
        <div style={{ height: "8em" }} />
        <Row className="mb-2">
          <Col className={classes({ 'text-center': true, 'text-muted': order.progress !== 'Processing' })}>
            <div>
              <Icon size="5x" icon={faListAlt} />
            </div>
            Processing
          </Col>
          <Col className={classes({ 'text-center': true, 'text-muted': order.progress !== 'Preparing' })}>
            <div>
              <Icon size="5x" icon={faCheese} />
            </div>
            Preparing
          </Col>
          <Col className={classes({ 'text-center': true, 'text-muted': order.progress !== 'Delivering' })}>
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
