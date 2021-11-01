import React, { useState } from 'react';
import Link from 'next/link';
import image from 'next/image';
import { connect } from 'mongoose';
import { Button, Card, Col, Container, ListGroup, Nav, Row } from 'react-bootstrap';

import Layout from '../../lib/Layout';

import { OrderItemsList } from '../../lib/OrderItemsList';
import { GetStaticProps } from 'next';
import { connectionString, MenuItemModel } from '../../lib/Connection';
import { MenuItem, OrderItem } from '../../lib/DbTypes';
import { classes, formatter } from '../../lib/Utils';
import { useOrderContext } from '../../lib/OrderContext';

type OrderProps = {
  categories: Set<string>;
  data: MenuItem[];
}

export const getStaticProps: GetStaticProps<OrderProps> = async (_context) => {
  await connect(connectionString);
  const items = await MenuItemModel.find();
  return {
    props: {
      categories: items.reduce<Set<string>>((result, item) => {
        result.add(item.category);
        return result;
      }, new Set()),
      data: items
    }
  }
}

export default function Order({ categories, data }: OrderProps) {
  const order = useOrderContext();

  // const [orderList, setOrderList] = useState<OrderItem[]>([]);
  return (
    <Layout navLinks={
      <Nav>
        <Nav.Link href="/" as={Link}>Home</Nav.Link>
      </Nav>
    }>
      <Container fluid className="mt-2">
        <Row>
          <Col lg={2}>
            <CategoriesList categories={Array.from(categories)} />
          </Col>
          <Col>
            <Row>
              {data.map((item, idx) => (
                <MenuItemsList key={idx}
                  item={item}
                  imageUrl={`/api/images/${item.name}`}
                  onBuy={() => order.addItem(item)} />
              ))}
            </Row>
          </Col>
          <Col lg={3}>
            <ListGroup className="position-sticky" style={{ top: "4em" }}>
              {order.items.map((item, idx) => (
                <OrderItemsList
                  key={idx}
                  item={item}
                  imageUrl={`/api/images/${item.item.name}`}
                  onRemove={() => order.delItem(item)}
                />
              ))}
              <ListGroup.Item className="d-flex bg-light align-items-center">
                <div className="flex-fill">
                  <span>
                    {formatter.format(order.orderPrice)}
                  </span>
                </div>
                <div>
                  <Button className={classes({ disabled: !order.hasItems })} variant="outline-primary" href="/order/summary" as={Link}>
                    Order
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

type MenuItemsListProps = {
  item: MenuItem;
  imageUrl: string;
  onBuy: React.MouseEventHandler<HTMLElement>;
}

function MenuItemsList({ item, imageUrl, onBuy }: MenuItemsListProps): JSX.Element {
  return (
    <Col className="mb-3" lg={4} md={6}>
      <Card>
        <Card.Img variant="top" as={image} src={imageUrl} />
        <Card.Body>
          <Card.Title>{item.name}</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the bulk of
            the card&apos;s content.
          </Card.Text>
        </Card.Body>
        <Card.Footer className="d-flex align-items-center">
          <span className="flex-fill">{formatter.format(item.price)}</span>
          <Button variant="outline-primary" onClick={onBuy}>Buy</Button>
        </Card.Footer>
      </Card>
    </Col>
  );
}

type CategoriesListProps = {
  categories: string[];
}

function CategoriesList({ categories }: CategoriesListProps): JSX.Element {
  return (
    <ListGroup className="position-sticky" style={{ top: "4em" }} variant="flush">
      {categories.map(((cat, idx) => (
        <ListGroup.Item action key={idx}>{cat}</ListGroup.Item>
      )))}
    </ListGroup>
  );
}
