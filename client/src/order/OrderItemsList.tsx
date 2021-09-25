import React from 'react';
import { Badge, Button, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { OrderItem } from '../share/DataContext';

const formatter = new Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'BGN' });

type OrderItemsListProps = {
  item: OrderItem;
  imageUrl: string;
  onRemove: React.MouseEventHandler<HTMLElement>;
};

export function OrderItemsList({ item, imageUrl, onRemove}: OrderItemsListProps): JSX.Element {
  return (
    <ListGroup.Item className="d-flex">
      <div className="mr-1">
        <img src={imageUrl} alt="" className="rounded" style={{ width: "5em" }} />
      </div>
      <div className="flex-fill">
        <span>{item.item.name}</span>
      </div>
      <div className="mr-1">
        <Badge variant="secondary">{`${item.count}x`}</Badge>
      </div>
      <span className="mr-2">{formatter.format(item.item.price * item.count)}</span>
      <div>
        <Button variant="outline-danger" size="sm" onClick={onRemove}>
          <Icon icon={faCircleXmark} />
        </Button>
      </div>
    </ListGroup.Item>
  );
}
