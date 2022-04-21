import React, { useEffect, useState } from "react";

import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";

import Image from "next/image";

import { OrderItem } from "../db/DbTypes";
import { Row, Col } from "react-bootstrap";

const formatter = new Intl.NumberFormat("bg-BG", { style: "currency", currency: "BGN" });

type OrderItemsListProps = {
  item: OrderItem;
  onRemove: React.MouseEventHandler<HTMLElement>;
  onChangeCount: (count: number) => void;
};

export function OrderItemRow({ item, onRemove, onChangeCount }: OrderItemsListProps): JSX.Element {

  const incCount = () => {
    onChangeCount(item.count + 1);
  };
  const decCount = () => {
    if (item.count > 1) {
      onChangeCount(item.count - 1);
    }
  };

  return (
    <ListGroup.Item className="p-2 d-flex align-items-center">
      <Image src={`/api/images/${item.item.name}/thumb.jpg`} alt="" className="rounded align-self-center" width={100} height={80} />
      <div className="flex-grow-1 px-2" style={{ width: "40%" }}>{item.item.name}</div>
      <Stack gap={1} className="px-1 mx-1 my-auto align-items-center" style={{ maxWidth: "2.5rem" }}>
        <Button variant="outline-secondary" size="sm" className="py-0" style={{ width: "1.8rem" }} onClick={decCount}> - </Button>
        <Badge bg="secondary" style={{ width: "max-content" }}>{`${item.count}x`}</Badge>
        <Button variant="outline-secondary" size="sm" className="py-0" style={{ width: "1.8rem" }} onClick={incCount}> + </Button>
      </Stack>
      <Row className="mx-auto" >
        <Col className="px-0 ">{formatter.format(item.item.price * item.count)}</Col>

        <Col className="px-1">
          <Button variant="outline-danger" size="sm" className="py-0 px-1" onClick={onRemove}>
            <i className="far fa-times-circle" />
          </Button>
        </Col>
      </Row>
    </ListGroup.Item>
  );
}
