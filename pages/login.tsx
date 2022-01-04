import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import CloseButton from "react-bootstrap/CloseButton";

import Layout from "../lib/comps/Layout";
import { fetchJson, FetchError } from "../lib/utils/Utils";
import useUser from "../lib/utils/useUser";

const initialState = {
  mail: "",
  password: "",
  rePassword: "",
};

export default function Login() {
  const [input, setInput] = useState(initialState);
  const [validated, setValidated] = useState(false);
  const [errorLogMsg, setErrorLogMsg] = useState("");
  const [errorRegMsg, setErrorRegMsg] = useState("");

  const [show, setShow] = useState(false);

  const { mutateUser } = useUser({
    redirectTo: "/",
    redirectIfFound: true,
  });

  const handleInputChange = (event: any) => {
    event.preventDefault();
    setInput(input => ({ ...input, [event.target.name]: event.target.value }));
  };

  const sendRequest = async (path: string, setMsg: any) => {
    try {
      mutateUser(
        await fetchJson(path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        }),
      );
    } catch (error) {
      if (error instanceof FetchError) {
        setMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  };

  const handleSubmitLogin = async (event: any) => {
    event.preventDefault();
    sendRequest("/api/login", setErrorLogMsg);
  };

  const handleSubmitRegister = (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);

    if (input.password !== input.rePassword) {
      setShow(true);
      // setErrorRegMsg('Repeat Password must match Password')
      return;
    }

    const regex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (!regex.test(input.mail)) {
      setShow(true);
      // setErrorRegMsg('Please use a valid email')
      return;
    }
    sendRequest("/api/register", setErrorRegMsg);
  };

  const setPopover = (text: string) => {
    return (
      <Popover id="popover-basic" className="border border-danger">
        <Popover.Header>
          Warning
          <CloseButton onClick={() => setShow(false)} />
        </Popover.Header>
        <Popover.Body>
          {text}
        </Popover.Body>
      </Popover>
    );
  };

  return (
    <Layout navLinks={<></>}>
      <Container>
        <Row className="mt-3 justify-content-center">
          <Col xs={4} className="border-right">
            <h3>Login</h3>
            <Form noValidate validated={validated} onSubmit={handleSubmitLogin}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control required placeholder="Enter name" />

              </Form.Group>
              <Form.Group controlId="loginEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control required name='mail' type="email" placeholder="Enter email" onChange={handleInputChange} />
                <Form.Text className="text-muted">
                  Please enter a valid email address
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="loginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control required name='password' type="password" placeholder="Password" onChange={handleInputChange} />
                <Form.Text className="text-muted">
                  Please use at least eight symbols
                </Form.Text>
              </Form.Group>
              <Button variant="info" type="submit">
                Submit
              </Button>
              {errorLogMsg &&
                <Alert variant="warning" onClose={() => setErrorLogMsg("")} dismissible>
                  {errorLogMsg}
                </Alert>
              }
            </Form>
          </Col>
          <Col xs={4}>
            <h3>Register</h3>
            <Form noValidate validated={validated} onSubmit={handleSubmitRegister}>
              <OverlayTrigger show={show} onEntered={() => setTimeout(() => { setShow(false); }, 3000)} placement="right" overlay={setPopover("Please use a valid email")}>
                <Form.Group controlId="registerEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control required name='mail' type="email" placeholder="Enter email" onChange={handleInputChange} />
                  <Form.Text className="text-muted">
                    Please enter a valid email address
                  </Form.Text>
                </Form.Group>
              </OverlayTrigger>
              <Form.Group controlId="registerPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control required name='password' type="password" placeholder="Password" onChange={handleInputChange} />
                <Form.Text className="text-muted">
                  Please use at least eight symbols
                </Form.Text>
              </Form.Group>
              <OverlayTrigger show={show} onEntered={() => setTimeout(() => { setShow(false); }, 3000)} placement="right" overlay={setPopover("Repeat Password must match Password")}>
                <Form.Group controlId="rePassword">
                  <Form.Label>Repeat Password</Form.Label>
                  <Form.Control required name='rePassword' type="password" placeholder="Repeat Password" onChange={handleInputChange} />
                </Form.Group>
              </OverlayTrigger>
              <Button variant="info" type="submit">
                Register
              </Button>
              {errorRegMsg &&
                <Alert variant="warning" onClose={() => setErrorRegMsg("")} dismissible>
                  {errorRegMsg}
                </Alert>
              }
            </Form>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
