import React, { useState } from 'react';
import { Button, Carousel, Col, Container, Nav, Row, ListGroup } from 'react-bootstrap';


import Layout from '../lib/Layout';

import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { connect, MenuItemModel } from '../lib/Connection';
import { MenuItem } from '../lib/DbTypes';
import { MenuItemCard } from '../lib/MenuItemCard';
import { CatListSort, CategoriesList } from '../lib/CategoriesList';
import Trolley from '../lib/Trolley'
import { OrderState, useOrderContext } from '../lib/OrderContext';

type HomeProps = {
  menuItems: MenuItem[],
  categories: [string, number][];
}

export const getStaticProps: GetStaticProps<HomeProps> = async (_context) => {
  await connect();

  const items = await MenuItemModel.find();
  let cat: any = { 'Всички': 0 };
  items.forEach(item => {
    cat['Всички']++
    (!cat.hasOwnProperty(item.category))
      ? cat[`${item.category}`] = 1
      : cat[`${item.category}`]++
  });
  console.log(cat)
  return {
    props: {
      menuItems: items/*.slice(0, 5)*/.map(i => {
        const result = i.toObject();
        result._id = result._id.toString();
        return result;
      }),
      categories: Object.entries(cat),
      // categories: Array.from(items.reduce((result, item) => {
      //   result.add(item.category);
      //   return result;
      // }, new Set())),
    }
  }
}

export default function Home({ menuItems, categories }: HomeProps) {
  const [filtered, setFiltered] = useState(menuItems)
  const order = useOrderContext();

  const filterCategories = (select: String): void => {
    if (select == "Всички") setFiltered(menuItems)
    else {
      const result = menuItems.filter(x => x.category == select)
      setFiltered(result)
    }
  }

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
      <Container fluid id="products" className="mt-3">
        {/* <Row className="d-flex justify-content-end mr-0 mb-2">
          <Trolley/>
        </Row> */}
        <Row>
          <Col lg={2} className="d-none d-lg-block position-sticky">
            <CategoriesList categories={categories} onSelected={filterCategories} />
          </Col>
          <Col>
            <Row className="d-flex justify-content-between align-items-center" >
              <Col className="d-lg-none ml-3">
                <CatListSort  categories={categories} onSelected={filterCategories} />
              </Col>
              <Trolley count={order.counted}/>
            </Row>
            <Row>
              {filtered.map((item, idx) => (
                <Col className="mb-3" lg={4} md={6} key={idx}>
                  <MenuItemCard item={item} onBuy={() => order.addItem(item)}/>
                </Col>
              ))}
            </Row>
          </Col>
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


