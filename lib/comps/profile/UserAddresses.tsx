import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import Router from "next/router";


import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";

import { useOrderContext } from "../OrderContext";
import { Address, User } from "../../db/DbTypes";
import { HTTPMethod } from "../../utils/rest-client";
import rest, { FetchError } from "../../utils/rest-client";
import { TabHeader } from "../TabHeader";
import GoogleMap, { GoogleMapOptions } from "../GoogleMap2";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import ResetPass from "../resetPass";
import { APIMessageContext } from "../../comps/GlobalMessageHook";


export default function UserAddresses() {

  const order = useOrderContext();
  const { writeMessage } = useContext(APIMessageContext);

  const [errorRegMsg, setErrorRegMsg] = useState<string>("");
  const [showAddNew, setShowAddNew] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<Address[] | undefined>(order.user?.address);
  const [editAddress, setEditAddress] = useState<Address | {}>({});
  const [showDeleteAddress, setShowDeleteAddress] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [showGoogle, setShowGoogle] = useState<boolean>(false);

  useEffect(() => {
    setAddresses(order.user?.address?.reverse());
    // pin.current = order.user?.address_pos;
    // info.current = order.user?.address;
  }, [order]);

  const handleAddAddress = () => {
    setEditAddress({});
    setShowAddNew(true);
  };

  const handleUpdateAddress = (id: string) => {
    let selected = addresses?.filter(x => x.id === id)[0];
    setEditAddress(selected || {});
    setShowAddNew(true);
  };

  const handleDeleteAddress = (id: string) => {
    setDeleteId(id);
    setShowDeleteAddress(true);
  };

  const deleteAddressRequest = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setShowDeleteAddress(false);

    try {
      const response = await rest.delete("/api/address", { id: deleteId });
      writeMessage("success", response.message);
      order.setUser();
    } catch (e) {
      if (e instanceof FetchError) {
        return writeMessage("danger", e.data?.message || e.message);
      }
      console.error("An unexpected error:", e);
    }
  };

  return (
    <>
      <Container  >
        <TabHeader title="User Addresses" />
        <Row xl={2} className="justify-content-center">
          <Col xl={8}>
            <Stack direction="horizontal" className="mb-3" gap={3}>
              <Button variant="outline-primary" onClick={handleAddAddress}>
                <i className="far fa-save me-1" />
                <span className="ms-1">Add new</span>
              </Button>
              <Button variant="outline-secondary" onClick={() => setShowGoogle(true)}>
                <i className="fab fa-brands fa-md fa-google me-1"></i>
                <span className="ms-1">Add with Google</span>
              </Button>
            </Stack>
            {errorRegMsg &&
              <Alert variant="danger" onClose={() => setErrorRegMsg("")} dismissible>
                {errorRegMsg}
              </Alert>
            }
            <Stack direction="vertical" gap={2}>
              {
                addresses?.map((x, i) => (
                  <Card key={i} as={Stack} direction="horizontal" >
                    <button className="m-2 border-0" style={{ background: "none", maxWidth: "8rem" }} >
                      <Card.Img src="/GoogleMaps.png" />
                    </button>
                    <Card.Body className="d-flex flex-column justify-content-around">
                      <Card.Title>{x.street}</Card.Title>
                      <Card.Text className="mb-2">
                        {x.completeAddress}
                      </Card.Text>
                      <div>
                        <Card.Link as={Button} variant="link" className="me-3 p-0" style={{ boxShadow: "none", color: "green", textDecoration: "none" }} onClick={() => handleUpdateAddress(x.id)}>Update address</Card.Link>
                        {/* <Card.Link as={Button} variant="link" className="m-0" style={{ boxShadow: "none", textDecoration: "none" }} >Update with Maps</Card.Link> */}
                        <Card.Link as={Button} variant="link" className="m-0 p-0" style={{ boxShadow: "none", color: "#a10827", textDecoration: "none" }} onClick={() => handleDeleteAddress(x.id)}>Remove address</Card.Link>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              }

              <Card as={Stack} direction="horizontal" className="d-flex align-items-stretch" >
                <button className="m-2 border-0" >
                  <Card.Img src="/GoogleMaps.png" style={{ width: "8rem", minHeight: "100%" }} />
                </button>
                <Card.Body >
                  <Card.Title>Card Title</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of
                    the card's content.
                  </Card.Text>
                  <Card.Link as={Button} variant="link" style={{ boxShadow: "none", color: "green", textDecoration: "none" }} >Update address</Card.Link>
                  <Card.Link as={Button} variant="link" className="m-0" style={{ boxShadow: "none", textDecoration: "none" }} >Update with Maps</Card.Link>
                  <Card.Link as={Button} variant="link" className="m-0" style={{ boxShadow: "none", color: "#a10827", textDecoration: "none" }} >Remove address</Card.Link>
                </Card.Body>
              </Card>
            </Stack>
          </Col>
        </Row>
        <AddNewAddress show={showAddNew} hide={setShowAddNew} writeMessage={writeMessage} editAddress={editAddress} />
        <AddWithGoogle show={showGoogle} hide={setShowGoogle} writeMessage={writeMessage} editAddress={editAddress} />
      </Container>
      <Modal show={showDeleteAddress} onHide={() => setShowDeleteAddress(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {"Are you sure you want to delete the selected address?"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-success" className="me-2" onClick={() => setShowDeleteAddress(false)}>
            Cancel
          </Button>
          <Button variant="outline-danger" onClick={deleteAddressRequest} >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


function AddWithGoogle({ show, hide, writeMessage, editAddress }: AddNewAddressType): JSX.Element {
  const [input, setInput] = useState<Partial<Address> /*& { default: boolean }*/>(editAddress);

  const order = useOrderContext();

  const pin = useRef<google.maps.LatLngLiteral>();
  const info = useRef<string>();

  useEffect(() => {
    setInput(editAddress);
  }, [editAddress]);

  const onNewPosition: GoogleMapOptions["onNewPosition"] = (pos, completeAddress) => {
    setInput({ ...input, completeAddress, address_pos: pos });
    pin.current = pos;
    info.current = completeAddress;
  };

  const ifEmptyObject = () => {
    return Object.keys(editAddress).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, httpRequest: HTTPMethod) => {
    event.preventDefault();
    hide(false);
    console.log(input);
    try {
      const response = await rest[httpRequest]("/api/address", input);
      writeMessage("success", response.message);
      order.setUser();
    } catch (e) {
      if (e instanceof FetchError) {
        return writeMessage("danger", e.data?.message || e.message);
      }
      console.error("An unexpected error:", e);
    }
  };

  const render = (status: Status): React.ReactElement => {
    if (status === Status.LOADING) return <h3>{status} ..</h3>;
    if (status === Status.FAILURE) return <h3>{status} ...</h3>;
    return <></>;
  };

  return (
    <Modal show={show} onHide={() => hide(!show)} size="lg" aria-labelledby="googleMaps">
      <Modal.Header closeButton>
        <Modal.Title>
          Add new address with Google maps
        </Modal.Title>
      </Modal.Header>
      <Modal.Body as={Form} noValidate onSubmit={
        ifEmptyObject()
          ? (e: React.FormEvent<HTMLFormElement>) => handleSubmit(e, "post")
          : (e: React.FormEvent<HTMLFormElement>) => handleSubmit(e, "put")
      }>
        <Wrapper apiKey="AIzaSyDCTQ1_GSpfRU2tyKg78QLkN8BeaGQr4Ho" render={render}>
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              value={input?.completeAddress ?? ""}
              readOnly
              name="address"
            />
            <Form.Control.Feedback type="invalid">No address provided.</Form.Control.Feedback>

            <Card className="mt-3">
              <Card.Body >
                <GoogleMap pin={input?.address_pos} address={input?.completeAddress} onNewPosition={onNewPosition} />
              </Card.Body>
            </Card>
          </Form.Group>
        </Wrapper>
        <Button type="submit" className="float-end mt-3" >Confirm</Button>
      </Modal.Body>
    </Modal>

  );
}


type AddNewAddressType = {
  show: boolean;
  hide: (a: boolean) => void;
  writeMessage: (variant: string, text: string) => void;
  editAddress: Address | {};
}

const addressData = ["street", "complex", "entrance", "floor", "apartment", "city", "zip", "phone"] as const;
type Values = { [K in typeof addressData[number]]: string }


function AddNewAddress({ show, hide, writeMessage, editAddress }: AddNewAddressType): JSX.Element {
  // const [address, setAddress] = useState<string>("");
  const [validated, setValidated] = useState(false);
  const [input, setInput] = useState<Partial<Address> /*& { default: boolean }*/>(editAddress);

  const order = useOrderContext();

  useEffect(() => {
    createFullAddress(editAddress);
    setInput(editAddress);
    setValidated(false);
  }, [editAddress]);

  const handleInputChange = (event: any) => {
    if (event.target.type === "checkbox") {
      setInput(input => ({ ...input, [event.target.name]: event.target.checked }));
      return;
    }
    setInput(input => ({ ...input, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, httpRequest: HTTPMethod) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    hide(false);
    const address = createFullAddress(input);

    try {
      const response = await rest[httpRequest]("/api/address", { ...input, completeAddress: address, });
      writeMessage("success", response.message);
      order.setUser();
    } catch (e) {
      if (e instanceof FetchError) {
        return writeMessage("danger", e.data?.message || e.message);
      }
      console.error("An unexpected error:", e);
    }
  };

  const createFullAddress = (addr: Partial<Address>) => {
    let fullAddress = "";
    addressData.forEach(x => {
      let params = addr[x] || "";
      if (params.length > 0) {
        fullAddress = `${fullAddress} ${x}: ${addr[x]},`;
      }
      return;
    });
    fullAddress = fullAddress.substring(0, fullAddress.length - 1);
    return fullAddress;

  };

  const ifEmptyObject = () => {
    return Object.keys(editAddress).length === 0;
  };

  return (
    <Modal show={show} onHide={() => hide(!show)} size="lg" aria-labelledby="customAddress">
      <Modal.Header closeButton>
        <Modal.Title>{ifEmptyObject() ? "Edit address" : "Add new address"}</Modal.Title>
      </Modal.Header>
      <Modal.Body as={Form} noValidate validated={validated} onSubmit={
        ifEmptyObject()
          ? (e: React.FormEvent<HTMLFormElement>) => handleSubmit(e, "post")
          : (e: React.FormEvent<HTMLFormElement>) => handleSubmit(e, "put")
      }>
        <Row >
          <Form.Group as={Col} lg="12" className="mb-2" disable controlId="validationFull">
            <Form.Label>Complete address</Form.Label>
            <Form.Control
              as="textarea"
              value={input?.completeAddress ?? "Пълен адрес"}
              readOnly
              name="address"
            />
          </Form.Group>
        </Row>
        <Row >
          <Form.Group as={Col} lg="6" className="mb-2" controlId="validationCity">
            <Form.Label>City</Form.Label>
            <Form.Control required type="text" name="city" value={input.city ?? ""} placeholder="Град" onChange={handleInputChange} />
            <Form.Control.Feedback type="invalid">
              Please provide a valid city.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} lg="6" className="mb-2" controlId="validationComplex">
            <Form.Label>Complex</Form.Label>
            <Form.Control type="text" name="complex" value={input?.complex ?? ""} placeholder="Квартал" onChange={handleInputChange} />
          </Form.Group>
        </Row>
        <Row >
          <Form.Group as={Col} md="9" className="mb-2" controlId="validationStreet">
            <Form.Label>Street</Form.Label>
            <Form.Control required type="text" name="street" value={input.street ?? ""} placeholder="Балчик" onChange={handleInputChange} />
            <Form.Control.Feedback type="invalid">
              Please provide a street and a number.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="3" className="mb-2" controlId="validationZip">
            <Form.Label>Zip</Form.Label>
            <Form.Control type="text" name="zip" value={input?.zip ?? ""} placeholder="Пощенски код" onChange={handleInputChange} />
          </Form.Group>
        </Row>
        <Row >
          <Form.Group as={Col} md="4" className="mb-2" controlId="validationEntrance">
            <Form.Label>Entrance</Form.Label>
            <Form.Control type="text" name="entrance" value={input?.entrance ?? ""} placeholder="Вход" onChange={handleInputChange} />
          </Form.Group>
          <Form.Group as={Col} md="4" className="mb-2" controlId="validationFloor">
            <Form.Label>Floor</Form.Label>
            <Form.Control type="text" name="floor" value={input?.floor ?? ""} placeholder="Етаж" onChange={handleInputChange} />
          </Form.Group>
          <Form.Group as={Col} md="4" className="mb-2" controlId="validationApp">
            <Form.Label>Apartment</Form.Label>
            <Form.Control type="text" name="apartment" value={input?.apartment ?? ""} placeholder="Апартамент" onChange={handleInputChange} />
          </Form.Group>
        </Row>
        <hr />
        <Stack direction="horizontal" className="mb-2 d-flex align-items-end justify-content-between">
          <Form.Group as={Col} lg="4" controlId="validationPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" name="phone" value={input?.phone ?? ""} placeholder="Телефон" required onChange={handleInputChange} />
            <Form.Control.Feedback type="invalid">
              Please provide a valid phone number.
            </Form.Control.Feedback>
          </Form.Group>
          {/* <Form.Group as={Col} xs="3" controlId="default">
            <Form.Check type="checkbox" name="default" checked={input.default} label="Set as default address" onChange={handleInputChange} />
          </Form.Group> */}
          <Button type="submit" >{ifEmptyObject() ? "Add new address" : "Edit address"}</Button>
        </Stack>
      </Modal.Body>
    </Modal >
  );
}
