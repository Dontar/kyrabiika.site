import React, { useEffect, useState, useContext } from "react";
import Router from "next/router";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Modal } from "react-bootstrap";

import { useOrderContext } from "../OrderContext";
import { APIMessageContext } from "../GlobalMessageHook";
import { User, LoggedInUser } from "../../db/DbTypes";
import rest, { FetchError } from "../../utils/rest-client";
import { TabHeader } from "../TabHeader";
import ResetPass from "../resetPass";

type Input = Partial<User> | undefined;

export default function UserProfile() {

  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const order = useOrderContext();
  const { writeMessage } = useContext(APIMessageContext);

  const [validated, setValidated] = useState(false);
  const [errorRegMsg, setErrorRegMsg] = useState<string>("");
  const [dirty, setDirty] = useState(false);
  const [showResetComp, setShowResetComp] = useState(false);

  const [input, setInp] = useState<Input>(order.user);
  const setInput = (val: Input) => {
    setDirty(true);
    setInp(val);
  };

  useEffect(() => {
    setInp(order.user);
  }, [order]);


  const handleSubmitRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);

    try {
      const newUser: LoggedInUser = await rest.post("/api/user", input);
      if (!!newUser.mail) {
        writeMessage("success", "The user data was changed successfully.");
      } else {
        writeMessage("danger", "Something went wrong, please try again later!");
      }
      if (!!newUser) {
        order.setUser();
      }
    } catch (e) {
      if (e instanceof FetchError) {
        // console.error(e.data?.message || e.message);
        writeMessage("danger", e.data?.message || e.message);
        return;
      }
      console.error("An unexpected error:", e);
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
              <Button variant="warning" className="mt-4" onClick={() => setShowResetComp(true)}>
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
          <ResetPass setShowResetComp={setShowResetComp} mail={`${input?.mail}`} />
        </Modal.Body>
      </Modal>
    </>
  );
}
