import React, { useState } from 'react';
import { Row, Dropdown, DropdownButton, ListGroup, Badge, Col } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';


export function CatListSort({ categories, onSelected }: any): JSX.Element {
  const [selected, setSelected] = useState('Всички');
  console.log(categories)
  return (
    <Col>
      {/* <Icon icon={faClipboardList} size="lg" /> */}
      <DropdownButton variant="outline-secondary" size="sm" title="Избери категория" style={{ marginBottom: "1em" }}>
        {categories.map((c: [string, number], i: number) => (
          <Dropdown.Item
            key={i}
            active={selected == c[0]}
            onClick={() => {
              setSelected(c[0])
              onSelected && onSelected(c[0])
            }}
          >{c[0]}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </Col>
  );
}

export function CategoriesList({ categories, onSelected }: any): JSX.Element {
  const [selected, setSelected] = useState('Всички');
  return (
    <ListGroup className="position-sticky" style={{ top: "4em" }} variant="flush">
      {categories.map((cat: [string, number], idx: number) => (
        <ListGroup.Item
          className="d-flex justify-content-between"
          action
          key={idx}
          active={selected == cat[0]}
          onClick={() => {
            setSelected(cat[0]);
            onSelected && onSelected(cat[0]);
          }}
        >
          {cat[0]}
          <Badge variant="primary" style={{fontSize: ".8em"}} pill>
            {cat[1]}
          </Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}






