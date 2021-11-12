import React, { useState } from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import OrderBox from './OrderBox'

export default function Trolley({ count }: any) {
  const [orderIsShown, setOrderIsShown] = useState(false)

  return (
    <Col className="mb-2 d-flex justify-content-end position-relative">
      <span
        onMouseEnter={() => setOrderIsShown(true)}
        onMouseLeave={() => setOrderIsShown(false)}
      >
        <Icon icon={faShoppingCart} size="lg" />
        &nbsp;&nbsp;
        <Badge className="d-sm-inline-flex align-items-center" variant="warning" style={{ fontSize: ".8em" }} pill>
          {count}
        </Badge>
      </span>
      {orderIsShown && <OrderBox />}
    </Col>
  )
}
