import React, { useState, useEffect, useContext, useCallback, useRef } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";

import { useOrderContext } from "../OrderContext";
import { Address } from "../../db/DbTypes";
import { HTTPMethod } from "../../utils/rest-client";
import rest, { FetchError } from "../../utils/rest-client";
import { TabHeader } from "../TabHeader";
import GoogleMap, { GoogleMapOptions } from "../GoogleMap2";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
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
    setAddresses(order.user?.address);
  }, [order]);

  const handleAddAddress = () => {
    setEditAddress({});
    setShowAddNew(true);
  };

  const handleUpdateAddress = (id: string) => {
    let selected = addresses?.filter(x => x.id === id);
    if (Array.isArray(selected) && selected.length === 1) {
      let { address_pos, ...rest } = selected[0];
      setEditAddress(rest);
    } else {
      setEditAddress({});
    }
    setShowAddNew(true);
  };

  const handleAddWithGoogle = () => {
    setEditAddress({});
    setShowGoogle(true);
  };

  const handleUpdateWithGoogle = (id: string) => {
    let selected = addresses?.filter(x => x.id === id);
    if (Array.isArray(selected) && selected.length === 1) {
      let { id, completeAddress, address_pos } = selected[0];
      setEditAddress({ id, completeAddress, address_pos });
    } else {
      setEditAddress({});
    }
    setShowGoogle(true);
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
              <Button variant="outline-secondary" onClick={handleAddWithGoogle}>
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
                    <button className="m-2 border-0" style={{ background: "none", maxWidth: "8rem" }} onClick={() => handleUpdateWithGoogle(x.id)}>
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
                )).reverse()
              }
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
          <Button variant="outline-primary" className="me-2" onClick={() => setShowDeleteAddress(false)}>
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


type GoogleAddressInput = Pick<Address, "id" | "completeAddress" | "address_pos">;
type RegularAddressInput = Omit<Address, "address_pos">;

type AddNewAddressType = {
  show: boolean;
  hide: (a: boolean) => void;
  writeMessage: (variant: string, text: string) => void;
  editAddress: Partial<Address> | {};
}


function AddWithGoogle({ show, hide, writeMessage, editAddress }: AddNewAddressType): JSX.Element {
  const [input, setInput] = useState<Partial<GoogleAddressInput>>({});
  const [validated, setValidated] = useState(false);

  const order = useOrderContext();

  useEffect(() => {
    setValidated(false);
    setInput(editAddress);
  }, [editAddress]);

  const onNewPosition: GoogleMapOptions["onNewPosition"] = (pos, completeAddress) => {
    setInput({ ...input, completeAddress, address_pos: pos });
  };

  const handleInputChange = (event: any) => {
    setInput(input => ({ ...input, [event.target.name]: event.target.value }));
  };

  const ifEmptyObject = () => {
    return Object.keys(editAddress).length === 0;
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
    <Modal show={show} onHide={() => hide(false)} size="lg" aria-labelledby="googleMaps">
      <Modal.Header closeButton>
        <Modal.Title>
          Add new address with Google maps
        </Modal.Title>
      </Modal.Header>
      <Modal.Body as={Form} noValidate validated={validated} onSubmit={
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
              required
              name="completeAddress"
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">No address provided.</Form.Control.Feedback>

            <Card className="mt-3">
              <Card.Body >
                <GoogleMap pin={input!.address_pos} address={input?.completeAddress} onNewPosition={onNewPosition} />
              </Card.Body>
            </Card>
          </Form.Group>
        </Wrapper>
        <Button type="submit" className="float-end mt-3" >Confirm</Button>
      </Modal.Body>
    </Modal>

  );
}


const addressData = ["street", "streetNum", "zip", "city", "complex", "building", "entrance", "floor", "apartment", "phone"] as const;
type Values = { [K in typeof addressData[number]]: string }


export function AddNewAddress({ show, hide, writeMessage, editAddress }: AddNewAddressType): JSX.Element {
  // const [address, setAddress] = useState<string>("");
  const [validated, setValidated] = useState(false);
  const [input, setInput] = useState<Partial<RegularAddressInput>>({});

  const order = useOrderContext();

  useEffect(() => {
    // createFullAddress(editAddress);
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
      const response = await rest[httpRequest]("/api/address", { ...input, completeAddress: address, address_pos: {} });
      writeMessage("success", response.message);
      order.setUser();
    } catch (e) {
      if (e instanceof FetchError) {
        return writeMessage("danger", e.data?.message || e.message);
      }
      console.error("An unexpected error:", e);
    }
  };

  const addressConstructor = (param: string, value: string) => {
    const obj: any = {
      street: (v: string) => `ul. ${v} `,
      streetNum: (v: string) => `${v}, `,
      zip: (v: string) => `zip ${v}, `,
      city: (v: string) => `${v}, `,
      complex: (v: string) => `complex ${v}, `,
      building: (v: string) => `building ${v}, `,
      entrance: (v: string) => `entrance ${v}, `,
      floor: (v: string) => `floor ${v}, `,
      apartment: (v: string) => `app ${v}, `,
      phone: (v: string) => `${v},`,
    };

    return obj[param](value);
  };

  const createFullAddress = useCallback((addr: Partial<Address>) => {
    let fullAddress = "";
    addressData.forEach(x => {
      let params = addr[x] || "";
      if (params.length > 0) {
        fullAddress = `${fullAddress} ${addressConstructor(x, params)}`;
      }
      return;
    });
    fullAddress = fullAddress.substring(0, fullAddress.length - 1);
    return fullAddress;

  }, []);

  const ifEmptyObject = () => {
    return Object.keys(editAddress).length === 0;
  };

  return (
    <Modal show={show} onHide={() => hide(false)} size="lg" aria-labelledby="customAddress">
      <Modal.Header closeButton>
        <Modal.Title>{ifEmptyObject() ? "Add new address" : "Edit address"}</Modal.Title>
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
            <Form.Label>City *</Form.Label>
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
          <Form.Group as={Col} md="7" className="mb-2" controlId="validationStreet">
            <Form.Label>Street *</Form.Label>
            <Form.Control required type="text" name="street" value={input.street ?? ""} placeholder="Улица" onChange={handleInputChange} />
            <Form.Control.Feedback type="invalid">
              Please provide a street and a number.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="2" className="mb-2" controlId="validationZip">
            <Form.Label>№ *</Form.Label>
            <Form.Control required type="text" name="streetNum" value={input?.streetNum ?? ""} placeholder="Номер" onChange={handleInputChange} />
          </Form.Group>
          <Form.Group as={Col} md="3" className="mb-2" controlId="validationZip">
            <Form.Label>Zip</Form.Label>
            <Form.Control type="text" name="zip" value={input?.zip ?? ""} placeholder="Пощенски код" onChange={handleInputChange} />
          </Form.Group>
        </Row>
        <Row >
          <Form.Group as={Col} md="3" className="mb-2" controlId="validationEntrance">
            <Form.Label>Building</Form.Label>
            <Form.Control type="text" name="building" value={input?.building ?? ""} placeholder="Блок" onChange={handleInputChange} />
          </Form.Group>
          <Form.Group as={Col} md="3" className="mb-2" controlId="validationEntrance">
            <Form.Label>Entrance</Form.Label>
            <Form.Control type="text" name="entrance" value={input?.entrance ?? ""} placeholder="Вход" onChange={handleInputChange} />
          </Form.Group>
          <Form.Group as={Col} md="3" className="mb-2" controlId="validationFloor">
            <Form.Label>Floor</Form.Label>
            <Form.Control type="text" name="floor" value={input?.floor ?? ""} placeholder="Етаж" onChange={handleInputChange} />
          </Form.Group>
          <Form.Group as={Col} md="3" className="mb-2" controlId="validationApp">
            <Form.Label>Apartment</Form.Label>
            <Form.Control type="text" name="apartment" value={input?.apartment ?? ""} placeholder="Апартамент" onChange={handleInputChange} />
          </Form.Group>
        </Row>
        <hr />
        <Stack direction="horizontal" className="mb-2 d-flex align-items-end justify-content-between">
          <Form.Group as={Col} lg="4" controlId="validationPhone">
            <Form.Label>Phone *</Form.Label>
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
