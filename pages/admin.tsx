import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import Layout from "../lib/comps/Layout";
import { OrderItemRow } from "../lib/comps/OrderItemRow";
import useUser from '../lib/useUser'

export default function Admin() {
  const [key, setKey] = useState<string | undefined>('site_config');

  const { user } = useUser({
    redirectTo: '/login',
  })


  return (
    <Layout navLinks={
      <Nav>
        <Link href="/" passHref={true}>
          <Nav.Link>Home</Nav.Link>
        </Link>
      </Nav>
    }>
      <Container fluid className="mt-2">
        <Tab.Container defaultActiveKey="#site_config">
          <Row>
            <Col lg={2}>
              <ListGroup className="position-sticky" style={{ top: "4em" }} variant="flush">
                <ListGroup.Item action href="#site_config">Site config</ListGroup.Item>
                <ListGroup.Item action href="#items">Items</ListGroup.Item>
                <ListGroup.Item action href="#users">Users</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col>
              <Tab.Content>
                <Tab.Pane eventKey="#site_config" title="Site config" as={Form}>
                  <Container>
                    <Row className="pt-3">
                      <Col>
                        <h4>Site config</h4>
                        <hr />
                      </Col>
                      <Col sm={1}>
                        <Button variant="success" disabled> Save </Button>
                      </Col>
                    </Row>
                    <Row>
                      <Form.Group as={Col} className="py-3" md={6}>
                        <Form.Label>Mission statement</Form.Label>
                        <Form.Control as="textarea" placeholder="Leave a comment here" style={{ minHeight: '10rem' }} />
                      </Form.Group>
                      <Form.Group as={Col} className="py-3" md={6}>
                        <Form.Label>Address</Form.Label>
                        <Form.Control as="textarea" placeholder="Enter address" style={{ minHeight: '10rem' }} />
                      </Form.Group>
                      <Col className="py-3" md={6}>
                        <Row className="flex-nowrap mb-1">
                          <Col className="flex-fill">Showcased products</Col>
                          <Col className="text-nowrap">
                            <Button className="me-1" size="sm"> + </Button>
                            <Button variant="danger" size="sm"> - </Button>
                          </Col>
                        </Row>
                        <ListGroup>
                          {"Item ".repeat(5).split(" ").map((i, idx) => (
                            <OrderItemRow key={idx} item={{ item: { name: `${i}-${idx}`, category: "", price: 0 }, count: 1 }} />
                          ))}
                        </ListGroup>
                      </Col>
                      <Col className="py-3" md={6}>
                        <Form.Group className="mb-2">
                          <Form.Label>E-contacts &amp; Small promo</Form.Label>
                          <Form.Control as="textarea" placeholder="Enter comment" style={{ minHeight: '10rem' }} />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Address &amp; Work time</Form.Label>
                          <Form.Control as="textarea" placeholder="Enter comment" style={{ minHeight: '10rem' }} />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Container>
                </Tab.Pane>
                <Tab.Pane eventKey="#items" title="Items">
                  <Container>
                    <Row className="py-3">
                      <Col>
                        <h4>Items</h4>
                        <hr />
                      </Col>
                      <Col sm={1}>
                        <Button>Add</Button>
                      </Col>
                    </Row>
                    <ListGroup>
                      {"Item ".repeat(10).split(" ").map((i, idx) => (
                        <OrderItemRow key={idx} item={{ item: { name: `${i}-${idx}`, category: "", price: 0 }, count: 1 }} />
                      ))}
                    </ListGroup>
                  </Container>
                </Tab.Pane>
                <Tab.Pane eventKey="#users" title="Users">
                  <Container>
                    <Row className="py-3">
                      <Col>
                        <h4>Users</h4>
                        <hr />
                      </Col>
                      <Col sm={1}>
                        <Button>Add</Button>
                      </Col>
                    </Row>
                    <ListGroup>
                      {"User ".repeat(10).split(" ").map((i, idx) => (
                        <OrderItemRow key={idx} item={{ item: { name: `${i}-${idx}`, category: "", price: 0 }, count: 1 }} />
                      ))}
                    </ListGroup>
                  </Container>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Layout>
  );
}

/*
function ItemEditModal() {
  const imgRef = useRef<HTMLImageElement>();
  const previewCanvasRef = useRef<HTMLCanvasElement>();
  const [upImg, setUpImg] = useState<string>();
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 30, aspect: 16 / 9 } as Crop);
  const [completedCrop, setCompletedCrop] = useState<Crop>();

  function onSelectFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setUpImg(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback((img: HTMLImageElement) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx!.imageSmoothingQuality = 'high';

    ctx!.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input type="file" accept="image/*" onChange={onSelectFile} />
        <ReactCrop
          src={upImg!}
          onImageLoaded={onLoad}
          crop={crop}
          onChange={c => setCrop(c)}
          onComplete={c => setCompletedCrop(c)}
          locked={true}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleClose}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
}
*/
