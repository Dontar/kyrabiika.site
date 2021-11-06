import React from 'react';
import { Button, Carousel, Col, Container, Nav, Row } from 'react-bootstrap';

import Layout from '../lib/Layout';

import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { connect, MenuItemModel } from '../lib/Connection';
import { MenuItem } from '../lib/DbTypes';
import { MenuItemCard } from '../lib/MenuItemCard';

type HomeProps = {
  menuItems: MenuItem[];
}

export const getStaticProps: GetStaticProps<HomeProps> = async (_context) => {
  await connect();

  const items = await MenuItemModel.find();
  return {
    props: {
      menuItems: items.map(i => {
        const result = i.toObject();
        result._id = result._id.toString();
        return result;
      })
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
          <Link href="/order" passHref={true}>
            <Nav.Link>Order</Nav.Link>
          </Link>
          <Link href="/admin" passHref={true}>
            <Nav.Link>Admin</Nav.Link>
          </Link>
        </Nav>
      }
    >
      <Carousel id="home">
        <Carousel.Item>
          <Image
            // style={{ height: "300px" }}
            className="d-block w-100"
            src="/api/images/main-top/thumb.jpg"
            alt="First slide"
            layout="responsive"
            height={450}
            width={1600}
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
              <MenuItemCard item={item} />
            </Col>
          ))}
        </Row>
        <div className="text-center mt-5">
          <Link href="/order" passHref>
            <Button variant="success" style={{ width: '20em' }}>Order</Button>
          </Link>
        </div>
      </Container>
      <Container id="history" className="mt-5">
        <h1 className="text-center">Born by acident.</h1>
        <hr />
        <h5 className="text-center">Who are we?</h5>
        <Row xs={1} md={2}>
          <Col >
            <p>
              Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
              blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
            </p>
          </Col>
          <Col >
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
