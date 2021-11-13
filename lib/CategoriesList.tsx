import React, { useState } from 'react';
import { Dropdown, DropdownButton, ListGroup, Badge, Col } from 'react-bootstrap';

type CategoriesNameCount = {
  categories: [string, number][];
  onSelected: (select: String) => void;
};


export function CatListSort({ categories, onSelected }: CategoriesNameCount): JSX.Element {
  const [selected, setSelected] = useState('Всички');
  console.log(categories)
  return (
    <Col>
      {/* <Icon icon={faClipboardList} size="lg" /> */}
      <DropdownButton variant="outline-secondary" size="sm" title="Избери категория" style={{ marginBottom: "1em" }}>
        {categories.map((cat, i) => (
          <Dropdown.Item
            key={i}
            active={selected == cat[0]}
            onClick={() => {
              setSelected(cat[0])
              onSelected && onSelected(cat[0])
            }}
          >{cat[0]}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </Col>
  );
}

export function CategoriesList({ categories, onSelected }: CategoriesNameCount): JSX.Element {
  const [selected, setSelected] = useState('Всички');
  return (
    <ListGroup className="position-sticky" style={{ top: "4em" }} variant="flush">
      {categories.map((cat, i) => (
        <ListGroup.Item
          className="d-flex justify-content-between"
          action
          key={i}
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






