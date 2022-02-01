import React, { useState } from "react";

import Image from "next/image";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import { MenuItem } from "../db/DbTypes";
import { formatter } from "../utils/Utils";

type MenuItemCardProps = {
  item: MenuItem;
  onBuy?: (count: number) => void;
};
export function MenuItemCard({ item, onBuy }: MenuItemCardProps) {
  const [count, setCount] = useState<number>(1);
  const [show, setShow] = useState<boolean>(false);

  const openModal = () => setShow(true);
  const closeModal = () => setShow(false);
  const incCount = () => setCount(count + 1);
  const decCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const onCountChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const value = Number(e.target.value);
    setCount(value > 0 ? value : 1);
  };

  return (
    <>
      <Card>
        <Card.Img variant="top" as={Image} src={`/api/images/${item.name}/thumb.jpg`} width={500} height={350} />
        <Card.Body>
          <Card.Title className="text-nowrap text-truncate">{item.name}</Card.Title>
          <Card.Text>
            {item.description}
          </Card.Text>
        </Card.Body>
        <Card.Footer className="d-flex align-items-center">
          <span className="flex-fill">{formatter.format(item.price)}</span>
          {onBuy ? (
            <Button variant="outline-primary" onClick={openModal}>
              Buy
            </Button>
          ) : null}
        </Card.Footer>
      </Card>
      {onBuy ? (
        <Modal show={show} onHide={closeModal} fullscreen="md-down" size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Select count</Modal.Title>
          </Modal.Header>
          <Modal.Body as={Row}>
            <Col md={8}><Image alt="" src={`/api/images/${item.name}/thumb.jpg`} width={500} height={350} /></Col>
            <Col md={4} as={Stack}>
              <strong>{item.name}</strong>
              <small>{item.description}</small>
              <Form.Group className="mt-auto">
                <Form.Label>Count</Form.Label>
                <InputGroup>
                  <Button variant="outline-secondary" onClick={decCount}> - </Button>
                  <Form.Control type="text" value={count} onChange={onCountChange} className="text-end" />
                  <Button variant="outline-secondary" onClick={incCount}> + </Button>
                </InputGroup>
              </Form.Group>
            </Col>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-primary" onClick={() => { closeModal(); onBuy(count); }}>Add</Button>
          </Modal.Footer>
        </Modal>
      ) : null}
    </>
  );
}
