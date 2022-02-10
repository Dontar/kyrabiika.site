import React, { FC, useState } from "react";
import Router from "next/router";
import { getProviders, signIn, getSession } from "next-auth/react";
import { AppProviders, BuiltInProviders, Provider } from "next-auth/providers";
import { SignInResponse } from "next-auth/react/types";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import CloseButton from "react-bootstrap/CloseButton";
import Stack from "react-bootstrap/Stack";

import Layout from "../lib/comps/Layout";
import { useOrderContext } from "../lib/comps/OrderContext";
import rest, { FetchError } from "../lib/utils/rest-client";

type LoginProps = {
  callBackUrl: string,
  providers: Provider[]
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  const { req } = context;
  const providers = await getProviders();
  const session = await getSession({ req });
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      callBackUrl: context.req.headers.referer || "/",
      providers: providers
    }
  };
};

export default function Login({ providers, callBackUrl }: LoginProps) {
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    mail: "",
    phone: "",
    password: "",
    rePassword: "",
  });
  const [validated, setValidated] = useState(false);
  const [errorLogMsg, setErrorLogMsg] = useState<string>();
  const [errorRegMsg, setErrorRegMsg] = useState<string>();
  const [show, setShow] = useState(false);

  // You dont need this anymore, redirection is happen in getServerSideProps, if session is available.
  const order = useOrderContext({
    redirectTo: "back",
    redirectIfFound: true,
  });

  const handleInputChange = (event: any) => {
    event.preventDefault();
    setInput(input => ({ ...input, [event.target.name]: event.target.value }));
  };

  const handleSubmitLogin = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const status: SignInResponse | undefined = await signIn("credentials", {
      redirect: false, /* leave ths option if you don't want to be a redirected after sign in */
      username: input.mail,
      password: input.password,
      // callbackUrl: callBackUrl
    });
    if (status!.ok === true) {
      console.log(callBackUrl);
      await order.setUser();
      Router.push(callBackUrl);
      // return null;
    };
    if (status!.error === "CredentialsSignin") {
      return setErrorLogMsg("Wrong user or password");
    };
    // order.setUser(rest.post("/api/login", input)).catch(e => {
    //   if (e instanceof FetchError) {
    //     return setErrorLogMsg(e.data?.message || e.message);
    //   }
    //   console.error("An unexpected error:", e);
    // });
  };

  const handleSubmitRegister = async (event: React.FormEvent<HTMLFormElement>) => {
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

    const newUser = await rest.post("/api/register", { ...input, rePassword: undefined }).catch(e => {
      if (e instanceof FetchError) {
        return setErrorRegMsg(e.data?.message || e.message);
      }
      console.error("An unexpected error:", e);
    });
    console.log(newUser);

    if (!!newUser) {
      handleSubmitLogin();
    }
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
    <Layout>
      <Container className="pt-5">
        <Row className="justify-content-center" xs={1} md={3}>
          <Col className="border-end">
            <h3>Login</h3>
            <hr />
            <Stack as={Form} noValidate validated={validated} onSubmit={handleSubmitLogin} gap={2}>
              <Form.Group controlId="loginEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control required name='mail' type="email" placeholder="Enter email" onChange={handleInputChange} autoComplete="username" />
                {/* <Form.Text className="text-muted">
                      Please enter a valid email address
                    </Form.Text> */}
              </Form.Group>
              <Form.Group controlId="loginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control required name='password' type="password" placeholder="Password" onChange={handleInputChange} autoComplete="current-password" />
                {/* <Form.Text className="text-muted">
                      Please use at least eight symbols
                    </Form.Text> */}
              </Form.Group>
              {errorLogMsg &&
                <Alert variant="danger" onClose={() => setErrorLogMsg("")} dismissible>
                  {errorLogMsg}
                </Alert>
              }
              <div>
                <hr />
                <Button variant="outline-success" type="submit" className="float-end">
                  Login
                </Button>
              </div>
            </Stack>
            <hr />
            {
              Object.values(providers).map(provider => {
                if (provider?.name === "Credentials") return null;
                return (
                  <Row key={provider.name}>
                    <Button onClick={() => signIn(provider.id)}>
                      Sign in with {provider.name}
                    </Button>
                  </Row>
                );
              })
            }
          </Col>
          <Col>
            <h3>Register</h3>
            <hr />
            <Row as={Form} noValidate validated={validated} onSubmit={handleSubmitRegister} className="gap-2">
              <Form.Group as={Col}>
                <Form.Label>First name</Form.Label>
                <Form.Control required name="firstName" placeholder="First name..." onChange={handleInputChange} autoComplete="on" />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Last name</Form.Label>
                <Form.Control required name="lastName" placeholder="Last name..." onChange={handleInputChange} autoComplete="on" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control required name="phone" placeholder="Phone..." onChange={handleInputChange} autoComplete="tel" />
              </Form.Group>
              <OverlayTrigger show={show} onEntered={() => setTimeout(() => { setShow(false); }, 3000)} placement="right" overlay={setPopover("Please use a valid email")}>
                <Form.Group controlId="registerEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control required name='mail' type="email" placeholder="Enter email" onChange={handleInputChange} autoComplete="username" />
                  {/* <Form.Text className="text-muted">
                    Please enter a valid email address
                  </Form.Text> */}
                </Form.Group>
              </OverlayTrigger>
              <Form.Group controlId="registerPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control required name='password' type="password" placeholder="Password" onChange={handleInputChange} autoComplete="new-password" />
                {/* <Form.Text className="text-muted">
                  Please use at least eight symbols
                </Form.Text> */}
              </Form.Group>
              <OverlayTrigger show={show} onEntered={() => setTimeout(() => { setShow(false); }, 3000)} placement="right" overlay={setPopover("Repeat Password must match Password")}>
                <Form.Group controlId="rePassword">
                  <Form.Label>Repeat Password</Form.Label>
                  <Form.Control required name='rePassword' type="password" placeholder="Repeat Password" onChange={handleInputChange} autoComplete="new-password" />
                </Form.Group>
              </OverlayTrigger>
              {errorRegMsg &&
                <Alert variant="danger" onClose={() => setErrorRegMsg("")} dismissible>
                  {errorRegMsg}
                </Alert>
              }
              <div>
                <hr />
                <Button variant="outline-success" type="submit" className="float-end">
                  Register
                </Button>
              </div>
            </Row>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
