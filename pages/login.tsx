import React, { useState, useRef, useEffect, SyntheticEvent } from 'react'
import { Container, Form, Row, Col, Button, Alert, Overlay, Popover, OverlayTrigger } from 'react-bootstrap';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import fetchJson, { FetchError } from '../lib/fetchJson';
import useUser from '../lib/useUser';


const initialState = {
  mail: '',
  password: '',
  rePassword: '',
}

export default function Login() {
  const [input, setInput] = useState(initialState)
  const [validated, setValidated] = useState(false)
  const [errorLogMsg, setErrorLogMsg] = useState('')
  const [errorRegMsg, setErrorRegMsg] = useState('')

  const [show, setShow] = useState(false);

  useEffect(() => {
    console.log(input)

  }, [input])

  const { mutateUser } = useUser({
    redirectTo: '/',
    redirectIfFound: true,
  })

  const handleInputChange = (event: any) => {
    event.preventDefault();
    setInput(input => ({ ...input, [event.target.name]: event.target.value }));
  }

  const sendRequest = async (path: string, setMsg: any) => {
    try {
      mutateUser(
        await fetchJson(path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        }),
      )
    } catch (error) {
      if (error instanceof FetchError) {
        setMsg(error.data.message)
      } else {
        console.error('An unexpected error happened:', error)
      }
    }
  }

  const handleSubmitLogin = async (event: any) => {
    event.preventDefault();
    sendRequest('/api/login', setErrorLogMsg)
  };

  const handleSubmitRegister = (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);

    if (input.password !== input.rePassword) {
      setShow(true)
      // setErrorRegMsg('Repeat Password must match Password')
      return
    }

    const regex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    if (!regex.test(input.mail)) {
      setShow(true)
      // setErrorRegMsg('Please use a valid email')
      return
    }
    sendRequest('/api/register', setErrorRegMsg)
  };

  const setPopover = (text: string) => {
    return (
      <Popover id="popover-basic" className="d-flex align-items-start border border-danger">
        <Popover.Content>
          {text}
        </Popover.Content>
        <Button style={{ 'fontSize': '1em', 'padding': '2px 5px', 'border': 0 }} onClick={() => setShow(false)} variant="outline-secondary">
          X
        </Button>
      </Popover>
    );
  }



  return (
    <Layout>
      <Container>
        <Row className="mt-3 justify-content-center">
          <Col xs={4} className="border-right border-dark border-2">
            <h3 className="mb-3">Login</h3>
            <Form noValidate validated={validated} onSubmit={handleSubmitLogin}>
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control required name='mail' type="email" placeholder="Enter email" onChange={handleInputChange} />
                <Form.Text className="text-muted">
                  Please enter a valid email address
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4" controlId="loginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control required name='password' type="password" placeholder="Password" onChange={handleInputChange} />
                <Form.Text className="text-muted">
                  Please use at least eight symbols
                </Form.Text>
              </Form.Group>
              <Button variant="info" type="submit" className="mb-3">
                Submit
              </Button>
              {errorLogMsg &&
                <Alert variant="warning" className="mt-3 p-2 d-flex justify-content-between align-items-center" >
                  <Alert.Heading style={{ 'fontSize': '1em', 'margin': 0 }}>{errorLogMsg}</Alert.Heading>
                  <Button style={{ 'fontSize': '1em', 'padding': '2px 5px', 'border': 0 }} onClick={() => setErrorLogMsg("")} variant="outline-secondary">
                    X
                  </Button>
                </Alert>
              }
            </Form>
          </Col>
          <Col xs={4}>
            <h3 className="mb-3">Register</h3>
            <Form noValidate validated={validated} onSubmit={handleSubmitRegister}>
              <OverlayTrigger show={show} onEntered={() => setTimeout(() => { setShow(false) }, 3000)} placement="right" overlay={setPopover('Please use a valid email')}>
                <Form.Group className="mb-3" controlId="registerEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control required name='mail' type="email" placeholder="Enter email" onChange={handleInputChange} />
                  <Form.Text className="text-muted">
                    Please enter a valid email address
                  </Form.Text>
                </Form.Group>
              </OverlayTrigger>
              <Form.Group className="mb-3" controlId="registerPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control required name='password' type="password" placeholder="Password" onChange={handleInputChange} />
                <Form.Text className="text-muted">
                  Please use at least eight symbols
                </Form.Text>
              </Form.Group>
              <OverlayTrigger show={show} onEntered={() => setTimeout(() => { setShow(false) }, 3000)} placement="right" overlay={setPopover('Repeat Password must match Password')}>
                <Form.Group className="mb-4" controlId="rePassword">
                  <Form.Label>Repeat Password</Form.Label>
                  <Form.Control required name='rePassword' type="password" placeholder="Repeat Password" onChange={handleInputChange} />
                </Form.Group>
              </OverlayTrigger>
              <Button variant="info" type="submit" className="mb-3">
                Register
              </Button>
              {errorRegMsg &&
                <Alert variant="warning" className="mt-3 p-2 d-flex justify-content-between align-items-center" >
                  <Alert.Heading style={{ 'fontSize': '1em', 'margin': 0 }}>{errorRegMsg}</Alert.Heading>
                  <Button style={{ 'fontSize': '1em', 'padding': '2px 5px', 'border': 0 }} onClick={() => setErrorRegMsg("")} variant="outline-secondary">
                    X
                  </Button>
                </Alert>
              }
            </Form>
          </Col>
        </Row>
      </Container>
      <Footer positionFixed={true} />
    </Layout>

  )
}
