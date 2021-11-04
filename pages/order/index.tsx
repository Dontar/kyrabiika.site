import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Col, Container, ListGroup, Nav, Row } from 'react-bootstrap';

import Layout from '../../lib/Layout';

import { OrderItemRow } from '../../lib/OrderItemRow';
import { GetStaticProps } from 'next';
import { connect, MenuItemModel } from '../../lib/Connection';
import { MenuItem } from '../../lib/DbTypes';
import { classes, formatter } from '../../lib/Utils';
import { OrderState, useOrderContext } from '../../lib/OrderContext';
import { MenuItemCard } from '../../lib/MenuItemCard';

type OrderProps = {
  categories: string[];
  data: MenuItem[];
}

export const getStaticProps: GetStaticProps<OrderProps> = async (_context) => {
  await connect();
  const items = await MenuItemModel.find();
  return {
    props: {
      categories: Array.from(items.reduce<Set<string>>((result, item) => {
        result.add(item.category);
        return result;
      }, new Set())),
      data: items.map(i => {
        const result = i.toObject();
        result._id = result._id.toString();
        return result;
      })
    }
  }
}

export default function Order({ categories, data }: OrderProps) {
  const [selectedCat, setSelected] = useState('Всички');
  const order = useOrderContext();

  // const [orderList, setOrderList] = useState<OrderItem[]>([]);
  return (
    <Layout navLinks={
      <Nav>
        <Link href="/" passHref={true}>
          <Nav.Link>Home</Nav.Link>
        </Link>
      </Nav>
    }>
      <Container fluid className="mt-2">
        <Row>
          <Col lg={2}>
            <CategoriesList categories={categories} onSelected={sel => setSelected(sel)} />
          </Col>
          <Col>
            <Row>
              {data.filter(i => i.category == selectedCat || selectedCat == 'Всички').map((item, idx) => (
                <Col className="mb-3" lg={4} md={6} key={idx} >
                  <MenuItemCard item={item} onBuy={() => order.addItem(item)} />
                </Col>
              ))}
            </Row>
          </Col>
          <Col lg={3}>
            <ListGroup className="position-sticky" style={{ top: "4em" }}>
              <OrderRow order={order} />
              {order.items.map((item, idx) => (
                <OrderItemRow key={idx} item={item} onRemove={() => order.delItem(item)} />
              ))}
              {order.items.length > 0 && (<OrderRow order={order} />)}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

type CategoriesListProps = {
  categories: string[];
  onSelected?: (category: string) => void;
}

function OrderRow({ order }: { order: OrderState }) {
  return (
    <ListGroup.Item className="d-flex bg-light align-items-center">
      <div className="flex-fill">
        <span>
          {formatter.format(order.orderPrice)}
        </span>
      </div>
      <div>
        <Link href="/order/summary" passHref>
          <Button className={classes({ disabled: !order.hasItems })} variant="outline-primary">
            Order
          </Button>
        </Link>
      </div>
    </ListGroup.Item>
  );
}

function CategoriesList({ categories, onSelected }: CategoriesListProps): JSX.Element {
  const [selected, setSelected] = useState('Всички');
  return (
    <ListGroup className="position-sticky" style={{ top: "4em" }} variant="flush">
      {["Всички", ...categories].map(((cat, idx) => (
        <ListGroup.Item
          action
          key={idx}
          active={selected == cat}
          onClick={() => {
            setSelected(cat);
            onSelected && onSelected(cat);
          }}
        >{cat}</ListGroup.Item>
      )))}
    </ListGroup>
  );
}
