import React from "react";

import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";

import Image from "next/image";

import { OrderItem } from "../db/DbTypes";

const formatter = new Intl.NumberFormat("bg-BG", { style: "currency", currency: "BGN" });

type OrderItemsListProps = {
  item: OrderItem;
  onRemove?: React.MouseEventHandler<HTMLElement>;
};

export function OrderItemRow({ item, onRemove }: OrderItemsListProps): JSX.Element {
  return (
    <ListGroup.Item as={Stack} direction="horizontal">
      <Image src={`/api/images/${item.item.name}/thumb.jpg`} alt="" className="rounded align-self-center" width={100} height={80} />
      <div className="flex-fill px-1">{item.item.name}</div>
      <div className="px-1">
        <Badge bg="secondary">{`${item.count}x`}</Badge>
      </div>
      <div className="px-1">{formatter.format(item.item.price * item.count)}</div>
      <div className="ps-1">
        <Button variant="outline-danger" size="sm" onClick={onRemove}>
          <i className="far fa-times-circle" />
        </Button>
      </div>
    </ListGroup.Item>
  );
}
