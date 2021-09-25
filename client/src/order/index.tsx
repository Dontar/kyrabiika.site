import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from '@reach/router';
import { Button, Card, Col, Container, ListGroup, Nav, Row } from 'react-bootstrap';

import Layout from '../layout';

// import data from '../data/data.json';
// import mufin_carrot from '../data/mufin_carrot.jpg';
// import mufin_nut from '../data/mufin_nut.jpg';

import { formatter, MenuItem, useDataContext } from '../share/DataContext';
import { OrderItemsList } from './OrderItemsList';

export default function Order(_props: React.PropsWithChildren<RouteComponentProps<{}>>) {
  const [data, actions] = useDataContext();
  const categories = data.menuItems.reduce<Set<string>>((result, item) => {
    result.add(item.category);
    return result;
  }, new Set());

  useEffect(() => {
    actions.loadMenuItems();
  });

  return (
    <Layout navLinks={
      <Nav>
        <Nav.Link to="/" as={Link}>Home</Nav.Link>
      </Nav>
    }>
      <Container fluid className="mt-2">
        <Row>
          <Col lg={2}>
            <CategoriesList categories={Array.from(categories)} />
          </Col>
          <Col>
            <Row>
              {data.menuItems.map(item => (
                <MenuItemsList
                  item={item}
                  imageUrl={actions.createMenuItemImage(item)}
                  onBuy={() => actions.addMenuItemToOrder(item)} />
              ))}
            </Row>
          </Col>
          <Col lg={3}>
            <ListGroup className="position-sticky" style={{ top: "4em" }}>
              {Array.from(data.order.items).map(([idx, item]) => (
                <OrderItemsList
                  key={idx}
                  item={item}
                  imageUrl={actions.createMenuItemImage(item.item)}
                  onRemove={() => actions.delMenuItemFromOrder(item.item)}
                />
              ))}
              <ListGroup.Item className="d-flex bg-light align-items-center">
                <div className="flex-fill">
                  <span>
                    {formatter.format(actions.orderPrice)}
                  </span>
                </div>
                <div>
                  <Button className={(data.order.items.size === 0) ? 'disabled' : ''} variant="outline-primary" to="/order/summary" as={Link}>
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
    <Col className="mb-3" lg={4} md={6} key={item._id}>
      <Card>
        <Card.Img variant="top" src={imageUrl} />
        <Card.Body>
          <Card.Title>{item.name}</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the bulk of
            the card's content.
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
