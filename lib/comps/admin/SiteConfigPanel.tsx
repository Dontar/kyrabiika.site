import { ChangeEvent } from "react";
import Image from "next/image";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import Stack from "react-bootstrap/Stack";
import Modal from "react-bootstrap/Modal";

import { TabHeader } from "../TabHeader";
import { MenuItemRow } from "./MenuItemRow";
import { useSiteConfigContext } from "./SiteConfigContext";

export function SiteConfigPanel() {
  const {
    config, isDirty, isSaving, mutateConfig: mutate, setDirty, setSaving, toggleModal
  } = useSiteConfigContext();

  const onMissonStatementChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    mutate({ ...config!, mission_statement: e.target.value });
    setDirty(true);
  };
  const onAddressChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    mutate({ ...config!, address: e.target.value });
    setDirty(true);
  };
  const onPromoChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    mutate({ ...config!, small_promo: e.target.value });
    setDirty(true);
  };
  const onWorkChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    mutate({ ...config!, addr_worktime: e.target.value });
    setDirty(true);
  };

  const onSave = async () => {
    const fetchConfig: RequestInit = {
      method: "POST",
      body: JSON.stringify(config),
      headers: { "Content-Type": "application/json" }
    };
    setSaving(true);
    try {
      const res = await fetch("/api/config", fetchConfig);
      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
    setDirty(false);
  };

  const onRemove = (idx: number) => () => {
    config!.promo_items.splice(idx, 1);
    mutate({ ...config! });
    setDirty(true);
  };

  return (
    <Container>
      <TabHeader title="Site config" button={<Button variant="success" disabled={!isDirty} onClick={onSave} className="text-nowrap">
        {isSaving
          ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          : <i className="far fa-save" />}
        <span className="ms-1">Save</span>
      </Button>} />
      <Row xs={1} md={2}>
        <Form.Group as={Col} controlId="mission_statement" className="mb-3">
          <Form.Label>Mission statement</Form.Label>
          <Form.Control as="textarea" className="mw-10" value={config?.mission_statement} onChange={onMissonStatementChange} />
        </Form.Group>
        <Form.Group as={Col} controlId="address" className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control as="textarea" className="mw-10" value={config?.address} onChange={onAddressChange} />
        </Form.Group>
        <Col className="mb-3">
          <Stack direction="horizontal" className="my-1">
            <label>Showcased products</label>
            <Button className="ms-auto" variant="outline-primary" size="sm" onClick={toggleModal}>
              <i className="far fa-plus-square" />
              <span className="ms-1">Add</span>
            </Button>
          </Stack>
          <ListGroup>
            {config?.promo_items.map((item, idx) => (
              <MenuItemRow key={idx} item={item} onRemove={onRemove(idx)} />
            ))}
          </ListGroup>
        </Col>
        <Col className="mb-3">
          <Form.Group controlId="small_promo" className="mb-3">
            <Form.Label>E-contacts &amp; Small promo</Form.Label>
            <Form.Control as="textarea" className="mw-10" value={config?.small_promo} onChange={onPromoChange} />
          </Form.Group>
          <Form.Group controlId="addr_worktime">
            <Form.Label>Address &amp; Work time</Form.Label>
            <Form.Control as="textarea" className="mw-10" value={config?.addr_worktime} onChange={onWorkChange} />
          </Form.Group>
        </Col>
      </Row>
      <SelectPromoItemsModal />
    </Container>
  );
}

function SelectPromoItemsModal() {
  const {
    mutateConfig, items, isModalOpen: show, toggleModal, mutateItems: mutate, getSelectedItems, config, setDirty
  } = useSiteConfigContext();

  const onSave = () => {
    mutateConfig({ ...config!, promo_items: getSelectedItems() });
    setDirty(true);
    toggleModal();
  };

  return (
    <Modal show={show} onHide={toggleModal} fullscreen="sm-down" scrollable={true}>

      <Modal.Header closeButton>
        <Modal.Title>Select items...</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        <ListGroup variant="flush"/*  className="overflow-auto mh-vh-75" */>
          {items?.map((item, idx) => (
            <Form.Group className="hstack gap-3" controlId={`check-${idx}`} as={ListGroup.Item} key={idx}>
              <Stack as={Form.Label} direction="horizontal" gap={3}>
                <Image src={`/api/images/${item.name}/thumb.jpg`} alt="" className="rounded align-self-center" width={100} height={80} />
                <Stack>
                  <strong>{item.name}</strong>
                  <small className="text-muted">{item.description}</small>
                </Stack>
              </Stack>
              <Form.Check type="checkbox" checked={item.selected} onChange={() => (item.selected = !item.selected, mutate([...items]))} />
            </Form.Group>
          ))}
        </ListGroup>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={toggleModal}>
          Close
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save Changes
        </Button>
      </Modal.Footer>

    </Modal>
  );
}

