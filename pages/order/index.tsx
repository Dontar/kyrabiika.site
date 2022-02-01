import React, { useState } from "react";

import Link from "next/link";
import { GetStaticProps } from "next";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";

import Layout from "../../lib/comps/Layout";
import { OrderItemRow } from "../../lib/comps/OrderItemRow";
import { connect, MenuItemModel } from "../../lib/db/Connection";
import { MenuItem } from "../../lib/db/DbTypes";
import { classes, convert, formatter } from "../../lib/utils/Utils";
import { OrderState, useOrderContext } from "../../lib/comps/OrderContext";
import { MenuItemCard } from "../../lib/comps/MenuItemCard";

type OrderProps = {
  categories: string[];
  data: MenuItem[];
}

export const getStaticProps: GetStaticProps<OrderProps> = async (_context) => {
  await connect();
  const data: MenuItem[] = (await MenuItemModel.find().lean({ autopopulate: true })).map(convert);
  return {
    props: {
      categories: Array.from(data.reduce((result, item) => {
        result.add(item.category);
        return result;
      }, new Set<string>())),
      data
    },
    revalidate: 30
  };
};

export default function Order({ categories, data }: OrderProps) {
  const [selectedCat, setSelected] = useState("Всички");
  const order = useOrderContext({
    redirectTo: "/login"
  });

  // const [orderList, setOrderList] = useState<OrderItem[]>([]);
  return (
    <Layout>
      <Container fluid className="mt-2">
        <Row>
          <Col lg={2}>
            <CategoriesList categories={categories} onSelected={sel => setSelected(sel)} />
          </Col>
          <Col>
            <Row>
              {data.filter(i => i.category == selectedCat || selectedCat == "Всички").map((item, idx) => (
                <Col className="mb-3" lg={4} md={6} key={idx}>
                  <MenuItemCard item={item} onBuy={count => order.addItem(item, count)} />
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

type CategoriesListProps = {
  categories: string[];
  onSelected?: (category: string) => void;
}

function CategoriesList({ categories, onSelected }: CategoriesListProps): JSX.Element {
  const [selected, setSelected] = useState("Всички");
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
