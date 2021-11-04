import React from 'react';
import image from 'next/image';
import { Button, Card, Col } from 'react-bootstrap';
import { MenuItem } from './DbTypes';
import { formatter } from './Utils';

type MenuItemCardProps = {
  item: MenuItem;
  onBuy?: React.MouseEventHandler<HTMLElement>;
};
export function MenuItemCard({ item, onBuy }: MenuItemCardProps) {
  return (
    <Card>
      <Card.Img variant="top" as={image} src={`/api/images/${item.name}/thumb.jpg`} width={500} height={350} />
      <Card.Body>
        <Card.Title className="text-nowrap">{item.name}</Card.Title>
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
  );
}
