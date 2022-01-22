import React from "react";

import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";

import Image from "next/image";

import { MenuItem } from "../../db/DbTypes";

type MenuItemRowProps = {
  item: MenuItem;
  onRemove?: React.MouseEventHandler<HTMLElement>;
};

export function MenuItemRow({ item, onRemove }: MenuItemRowProps): JSX.Element {
  return (
    <ListGroup.Item as={Stack} direction="horizontal" gap={3}>
      <Image src={`/api/images/${item.name}/thumb.jpg`} alt="" className="rounded align-self-center" width={100} height={80} />
      <Stack className="flex-fill">
        <strong>{item.name}</strong>
        <small className="text-muted">{item.description}</small>
      </Stack>
      <div>
        <Button variant="outline-danger" size="sm" onClick={onRemove}>
        <i className="far fa-times-circle"/>
        </Button>
      </div>
    </ListGroup.Item>
  );
}
