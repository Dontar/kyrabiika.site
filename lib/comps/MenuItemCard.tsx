import React from "react";
import image from "next/image";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { MenuItem } from "../db/DbTypes";
import { formatter } from "../utils/Utils";

type MenuItemCardProps = {
  item: MenuItem;
  onBuy?: React.MouseEventHandler<HTMLElement>;
};
export function MenuItemCard({ item, onBuy }: MenuItemCardProps) {
  return (
    <Card>
      <Card.Img variant="top" as={image} src={`/api/images/${item.name}/thumb.jpg`} width={500} height={350} />
      <Card.Body>
        <Card.Title className="text-nowrap text-truncate">{item.name}</Card.Title>
        <Card.Text>
          {item.description}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex align-items-center">
        <span className="flex-fill">{formatter.format(item.price)}</span>
        {onBuy ? (<Button variant="outline-primary" onClick={onBuy}>Buy</Button>) : null}
      </Card.Footer>
    </Card>
  );
}
