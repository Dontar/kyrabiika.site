import React, { useState } from 'react';
import { Button, Col, ListGroup } from 'react-bootstrap';
import Link from 'next/link';
import { OrderState, useOrderContext } from './OrderContext';
import { classes, formatter } from './Utils';
import { OrderItemRow } from './OrderItemRow';


export default function OrderBox() {
  const order = useOrderContext();

  return (
    <Col md="auto" className="position-absolute mr-3" style={{top: "100%", right: "0", zIndex: 100}}>
      <ListGroup className="position-sticky" style={{ top: "4em" }}>
        <OrderRow order={order} />
        {order.items.map((item, idx) => (
          <OrderItemRow key={idx} item={item} onRemove={() => order.delItem(item)} />
        ))}
        {order.items.length > 0 && (<OrderRow order={order} />)}
      </ListGroup>
    </Col>
  )
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
