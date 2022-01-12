import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import useSWR from "swr";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import Image from "next/image";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons/faCircleXmark";
import { faEdit } from "@fortawesome/free-regular-svg-icons/faEdit";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons/faPlusSquare";

import Cropper from "react-easy-crop";

import { MenuItem } from "../../db/DbTypes";
import { TabHeader } from "./TabHeader";
import { Area, Point } from "react-easy-crop/types";

export function ItemsPanel() {
  const [item, setItem] = useState<Partial<MenuItem>>();
  const [categories, setCats] = useState<string[]>([]);
  const {
    data: items, error: itemsError, mutate
  } = useSWR<MenuItem[]>("/api/menu", url => fetch(url).then(r => r.json()));

  const onRemove = (idx: number) => async () => {
    const item = items![idx];
    const res = await fetch(`/api/menu/${item._id}`, { method: "DELETE" });
    if (res.ok) {
      mutate();
    }
  };

  const showModal = (item?: Partial<MenuItem>) => () => {
    setItem(item);
  };

  useEffect(() => {
    const c = items?.reduce((a, i) => (a.add(i.category), a), new Set<string>());
    c && setCats(Array.from(c!.values()));
  }, [items]);


  return (
    <Container>
      <TabHeader title="Items" button={
        <Button onClick={showModal({})}>
          <Icon icon={faPlusSquare} />
          <span className="ms-1">Add</span>
        </Button>
      } />
      <ListGroup>
        {items?.map((item, idx) => (
          <ListGroup.Item as={Stack} direction="horizontal" gap={3} key={idx}>
            <Image src={`/api/images/${item.name}/thumb.jpg`} alt="" className="rounded align-self-center" width={100} height={80} />
            <Stack className="flex-fill">
              <strong>{item.name}</strong>
              <small className="text-muted">{item.description}</small>
            </Stack>

            <Button variant="outline-success" size="sm" className="text-nowrap" onClick={showModal(item)}>
              <Icon icon={faEdit} />
              <span className="ms-1">Edit</span>
            </Button>
            <Button variant="outline-danger" size="sm" onClick={onRemove(idx)}>
              <Icon icon={faCircleXmark} />
            </Button>

          </ListGroup.Item>
        ))}
      </ListGroup>
      <ItemEditModal handleClose={showModal()} item={item as MenuItem} cats={categories} />
    </Container>
  );
}

interface ItemEditModalProp {
  handleClose: () => void;
  item?: MenuItem;
  cats: string[];
}

function ItemEditModal({ handleClose, item, cats }: ItemEditModalProp) {
  const [zoom, setZoom] = useState<number>(1);
  const [menuItem, setItem] = useState<MenuItem>();
  const [upImg, setUpImg] = useState<string>();
  const [croppedImg, setCroppedImg] = useState<Blob | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });

  const onSelectFile: ChangeEventHandler<HTMLInputElement> = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setUpImg(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onControlChange = (prop: keyof MenuItem) => (e: ChangeEvent<HTMLInputElement>) => setItem({ ...menuItem!, [prop]: e.target.value });

  useEffect(() => {
    setItem(item);
    if (item && item.name) {
      setUpImg(`/api/images/${item.name}/thumb.jpg`);
    } else {
      setUpImg(undefined);
    }
  }, [item]);

  async function createImage(imgBlob: string) {
    return new Promise<HTMLImageElement>((resolve) => {
      const img = document.createElement("img");
      img.src = imgBlob;
      img.onload = () => resolve(img);
    });
  }

  const getCroppedImg = async (_croppedArea: Area, croppedAreaPixels: Area) => {
    const image = await createImage(upImg!);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 500;
    canvas.height = 400;

    ctx!.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      500,
      400
    );

    // As a blob
    canvas.toBlob(setCroppedImg, "image/jpeg");
  };

  const onSaveClick = async () => {
    if (menuItem !== undefined) {
      const body = new FormData();

      Object.entries(menuItem).forEach(([prop, value]) => {
        body.append(prop, value);
      });

      if (croppedImg instanceof Blob) {
        body.append("image", croppedImg, "thumb.jpg");
      }

      const url = `/api/menu${menuItem._id !== undefined ? `/${menuItem._id}` : ""}`;
      const method = menuItem._id !== undefined ? "PATCH" : "PUT";
      await fetch(url, {
        method,
        body,
        // headers: {
        //   "Content-Type": "multipart/form-data"
        // }
      });
    }

    handleClose();

  };

  return (
    <Modal show={!!item} onHide={handleClose} fullscreen="md-down" scrollable={true} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body as={Row} xs={1} lg={2} xl={3}>

        <Col xl={8} as={Stack}>
          <div className="position-relative flex-fill" style={{ minHeight: "20rem" }}>
            <Cropper
              image={upImg!}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onCropComplete={getCroppedImg}
              onZoomChange={setZoom}
              maxZoom={3}
              zoomSpeed={3 / 12}
              showGrid={false}
            />
          </div>
          <Form.Range value={zoom} onChange={e => setZoom(Number(e.target.value))} min="1" max="3" step={3 / 12} />
        </Col>

        <Col>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select product image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={onSelectFile} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name..." value={menuItem?.name} onChange={onControlChange("name")} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" style={{ minHeight: "10rem" }} placeholder="Enter description..."
              value={menuItem?.description} onChange={onControlChange("description")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control type="number" placeholder="Enter price..." value={menuItem?.price} onChange={onControlChange("price")} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <datalist id="item-edit-modal-categories">
              {cats.map((value, key) => (<option value={value} key={key} />))}
            </datalist>
            <Form.Control type="search" placeholder="Enter category..."
              list="item-edit-modal-categories" value={menuItem?.category}
              onChange={onControlChange("category")}
            />
          </Form.Group>

        </Col>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={onSaveClick}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}
