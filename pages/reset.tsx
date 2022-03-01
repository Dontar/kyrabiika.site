import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Stack from "react-bootstrap/Stack";


import rest, { FetchError } from "../lib/utils/rest-client";
import Layout from "../lib/comps/Layout";
import { APIMessageContext } from "../lib/comps/GlobalMessageHook";

type mail = { userMail: string }
type message = {
  variant: string;
  text: string;
}

export default function ResetPass() {
  const [name, setName] = useState<String | null>(null);
  // const [message, writeMessage] = useState<message | null>();
  const [input, setInput] = useState({
    password: "",
    rePassword: "",
  });
  const router = useRouter();
  const { code } = router.query;
  console.log(router.query);

  const { writeMessage } = useContext(APIMessageContext);

  useEffect(() => {
    const newUser = async () => {
      return await rest.get(`/api/resetPass?code=${code}`);
    };

    if (code !== undefined) {
      newUser()
        .then((res: mail) => {
          setName(() => res.userMail);
          console.log(`I am in promise ${JSON.stringify(res)}`);
        })
        .catch(e => {
          if (e instanceof FetchError) {
            console.error(e.data?.message || e.message);
            return;
            // return setErrorRegMsg(e.data?.message || e.message);
          }
          console.error("An unexpected error:", e);
        });
    }
  }, [code]);

  const handleInputChange = (event: any) => {
    event.preventDefault();
    setInput(input => ({ ...input, [event.target.name]: event.target.value }));
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input.password.length < 8) {
      writeMessage("warning", "Password must be at least eight symbols long.");
      return;
    }
    if (input.password !== input.rePassword) {
      writeMessage("warning", "Password confirmation doesn't match the password.");
      return;
    }

    try {
      const resetPass: mail = await rest.put("/api/resetPass", { mail: name, newPass: input.password, token: code });
      if (!!resetPass.userMail) {
        writeMessage("success", "The password was changed successfully please Sign in.");
      } else {
        writeMessage("danger", "Something went wrong, please try again later!");
      }
    } catch (e) {
      if (e instanceof FetchError) {
        // console.error(e.data?.message || e.message);
        writeMessage("danger", e.data?.message || e.message);
        return;
      }
      console.error("An unexpected error:", e);
    }
  };

  return (
    <Layout >
      <Container className="pt-5 mh-100">
        <Row style={{ margin: "auto", width: "18rem" }}>
          <Col className="d-flex flex-column justify-content-center">
            <h4 style={{ textAlign: "center" }}>Change password for</h4>
            <h4 style={{ textAlign: "center" }}>{name && `@ ${name.split("@")[0]}`}</h4>
            <Stack className="pt-3" as={Form} noValidate onSubmit={handleSubmit} gap={2}>
              {/* {message && message.text.length > 0 &&
                <Alert className="p-2 pe-5" variant={message?.variant} onClose={() => writeMessage(null)} dismissible>
                  {message.text}
                </Alert>
              } */}
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control required name='password' type="password" onChange={handleInputChange} />
              </Form.Group>

              <Form.Group controlId="rePassword">
                <Form.Label>Confirm password</Form.Label>
                <Form.Control required name='rePassword' type="password" onChange={handleInputChange} />
              </Form.Group>
              <Form.Text className="text-muted mt-0">
                Please use at least eight symbols.
              </Form.Text>

              <Button className="mt-2" variant="success" type="submit" >
                Change password
              </Button>
            </Stack>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

