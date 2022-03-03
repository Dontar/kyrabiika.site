import React, { useCallback, useEffect, useState, useRef } from "react";
import Router from "next/router";


import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Card, Modal } from "react-bootstrap";

import { useOrderContext } from "../OrderContext";
import { User } from "../../db/DbTypes";
import rest, { FetchError } from "../../utils/rest-client";
import { TabHeader } from "../TabHeader";
import GoogleMap, { GoogleMapOptions } from "../GoogleMap";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import ResetPass from "../resetPass";

type Input = Partial<User & { rePassword: string }> | undefined;

export default function UserProfile() {

  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const order = useOrderContext();

  const [validated, setValidated] = useState(false);
  const [errorRegMsg, setErrorRegMsg] = useState<string>();
  const [dirty, setDirty] = useState(false);
  const [showResetComp, setShowResetComp] = useState(false);


  const [input, setInp] = useState<Input>(order.user);
  const setInput = (val: Input) => {
    setDirty(true);
    setInp(val);
  };

  const pin = useRef<google.maps.LatLngLiteral>();
  const info = useRef<string>();


  useEffect(() => {
    setInp(order.user);
    pin.current = order.user?.address_pos;
    info.current = order.user?.address;
  }, [order]);


  const handleSubmitRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);

    const newUser = await rest.post("/api/user", { ...input, rePassword: undefined }).catch(e => {
      if (e instanceof FetchError) {
        return setErrorRegMsg(e.data?.message || e.message);
      }
      console.error("An unexpected error:", e);
    });
    console.log("Profile", newUser);

    if (!!newUser) {
      order.setUser();
      Router.back();
    }

    // order.setUser(rest.post("/api/user", input)).catch(e => {
    //   if (e instanceof FetchError) {
    //     return setErrorRegMsg(e.data?.message || e.message);
    //   }
    //   console.error("An unexpected error:", e);
    // });

  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onNewPosition: GoogleMapOptions["onNewPosition"] = (pos, address) => {
    setInput({ ...input, address, address_pos: pos });
    pin.current = pos;
    info.current = address;
  };

  const render = (status: Status): React.ReactElement => {
    if (status === Status.LOADING) return <h3>{status} ..</h3>;
    if (status === Status.FAILURE) return <h3>{status} ...</h3>;
    return <></>;
  };

  return (
    <>
      <Container as={Form} noValidate validated={validated} onSubmit={handleSubmitRegister}>
        <TabHeader title="Profile" button={
          <Button variant="success" type="submit" className="float-end" disabled={!dirty}>
            <i className="far fa-save" />
            <span className="ms-1">Save</span>
          </Button>
        } />
        {errorRegMsg &&
          <Alert variant="danger" onClose={() => setErrorRegMsg("")} dismissible>
            {errorRegMsg}
          </Alert>
        }
        <Row md={2} className="justify-content-center">
          <Col>
            <Stack className="gap-2">
              <Row>
                <Form.Group controlId="registerFirstName" as={Col}>
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    value={input?.firstName}
                    required
                    name="firstName"
                    placeholder="First name..."
                    onChange={handleInputChange}
                    autoComplete="on" />
                  <Form.Control.Feedback type="invalid">No first name provided.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="registerLastName" as={Col}>
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    value={input?.lastName ?? ""}
                    required
                    name="lastName"
                    placeholder="Last name..."
                    onChange={handleInputChange}
                    autoComplete="on" />
                  <Form.Control.Feedback type="invalid">No last name provided.</Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group controlId="registerEmail" as={Col}>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    value={input?.mail}
                    required
                    name="mail"
                    type="email"
                    placeholder="Enter email..."
                    onChange={handleInputChange}
                    isInvalid={!regex.test(input?.mail!)}
                    autoComplete="username" />
                  <Form.Control.Feedback type="invalid">Invalid e-mail provided.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="registerPhone" as={Col}>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    value={input?.phone ?? ""}
                    required
                    name="phone"
                    placeholder="Phone..."
                    onChange={handleInputChange}
                    autoComplete="tel" />
                  <Form.Control.Feedback type="invalid">No phone provided.</Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Wrapper apiKey="AIzaSyDCTQ1_GSpfRU2tyKg78QLkN8BeaGQr4Ho" render={render}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={input?.address ?? ""}
                    readOnly
                    name="address"
                  />
                  <Form.Control.Feedback type="invalid">No address provided.</Form.Control.Feedback>

                  <Card className="mt-3">
                    <Card.Body>
                      <GoogleMap pin={input?.address_pos} address={input?.address} onNewPosition={onNewPosition} />
                    </Card.Body>
                  </Card>
                </Form.Group>
              </Wrapper>
              <Button variant="warning" className="mt-2" onClick={() => setShowResetComp(true)}>
                Change password
              </Button>
            </Stack>
          </Col>
        </Row>
      </Container>
      <Modal show={showResetComp} onHide={() => setShowResetComp(false)}>
        <Modal.Header closeButton className="border-0 p-2">
        </Modal.Header>
        <Modal.Body className="pb-5 pt-0">
          <ResetPass name={`${input?.firstName} ${input?.lastName}`} />
        </Modal.Body>
      </Modal>
    </>
  );
}
