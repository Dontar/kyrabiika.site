import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import Image from 'next/image';

import { OrderItem } from '../db/DbTypes';

const formatter = new Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'BGN' });

type OrderItemsListProps = {
  item: OrderItem;
  onRemove?: React.MouseEventHandler<HTMLElement>;
};

export function OrderItemRow({ item, onRemove }: OrderItemsListProps): JSX.Element {
  return (
    <ListGroup.Item className="d-flex">
      <div className="mr-1">
        <Image src={`/api/images/${item.item.name}/thumb.jpg`} alt="" className="rounded" width={100} height={80} />
      </div>
      <div className="flex-fill">
        <span>{item.item.name}</span>
      </div>
      <div className="mr-1">
        <Badge bg="secondary">{`${item.count}x`}</Badge>
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
