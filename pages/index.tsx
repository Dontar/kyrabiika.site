import React, { useEffect, useRef } from "react";

import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";

import Link from "next/link";
import Image from "next/image";
import type { GetStaticProps } from "next";

import Layout from "../lib/comps/Layout";
import { connect, SiteConfigModel } from "../lib/db/Connection";
import { MenuItem, SiteConfig } from "../lib/db/DbTypes";
import { MenuItemCard } from "../lib/comps/MenuItemCard";
import { convert } from "../lib/utils/Utils";

type HomeProps = {
  menuItems: MenuItem[];
  config: SiteConfig | null;
}

export const getStaticProps: GetStaticProps<HomeProps> = async (_context) => {
  await connect();

  const config: SiteConfig = convert(await SiteConfigModel.findOne().lean({ autopopulate: true }));

  return {
    props: {
      menuItems: config.promo_items,
      config
    },
    revalidate: 30
  };
};

export default function Home({ menuItems, config }: HomeProps) {
  return (
    <Layout
      navLinks={
        <Nav>
          <Link href="/order" passHref={true}>
            <Nav.Link>Order</Nav.Link>
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
            <Button variant="success" style={{ width: "20em" }}>Order</Button>
          </Link>
        </div>
      </Container>
      <Container id="history" className="mt-5">
        <h1 className="text-center">Born by acident.</h1>
        <hr />
        <h5 className="text-center">Who are we?</h5>
        <p className="mission-statement">
          {config?.mission_statement}
        </p>
      </Container>
    </Layout>
  );
}
