import React from 'react';
import { Button, Card, Carousel, Col, Container, Nav, Row } from 'react-bootstrap';

import Layout from '../lib/Layout';

import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { connect } from 'mongoose';
import { connectionString, MenuItemModel } from '../lib/Connection';
import { MenuItem } from '../lib/DbTypes';
import { formatter } from '../lib/Utils';

type HomeProps = {
  menuItems: MenuItem[];
}

export const getStaticProps: GetStaticProps<HomeProps> = async (_context) => {
  await connect(connectionString);
  const items = await MenuItemModel.find();
  return {
    props: {
      menuItems: items
    }
  }
}

export default function Home({ menuItems }: HomeProps) {

  return (
    <Layout
      navLinks={
        <Nav>
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#products">Products</Nav.Link>
          <Nav.Link href="#history">History</Nav.Link>
          <Nav.Link href="#contacts">Contacts</Nav.Link>
          <Nav.Link href="/order" as={Link}>Order</Nav.Link>
        </Nav>
      }
    >
      <Carousel id="home">
        <Carousel.Item>
          <Image
            // style={{ height: "300px" }}
            className="d-block w-100"
            src="/api/images/main-top"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <Container id="products" className="mt-5">
        <h1>Products</h1>
        <hr />
        <Row>
          {menuItems.slice(0, 6).map((item, idx) => (
            <Col className="mb-3" lg={4} md={6} key={idx}>
              <Card>
                <Card.Img as={Image} variant="top" src={`/api/images/${item.name}`} />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of
                    the card&apos;s content.
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="d-flex align-items-center">
                  <span className="flex-fill">{formatter.format(item.price)}</span>
                  <Button variant="outline-primary">Buy</Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-5">
          <Button variant="success" href="/order" as={Link} style={{ width: '20em' }}>Order</Button>
        </div>
      </Container>
      <Container id="history" className="mt-5">
        <h1 className="text-center">Born by acident.</h1>
        <hr />
        <h5 className="text-center">Who are we?</h5>
        <Row>
          <Col sm>
            <p>
              Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
            </p>
          </Col>
          <Col sm>
            <p>
              Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
            </p>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
