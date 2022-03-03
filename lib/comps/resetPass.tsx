import React, { useEffect, useState, useContext, ReactPropTypes } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";


import rest, { FetchError } from "../utils/rest-client";
import { APIMessageContext } from "../comps/GlobalMessageHook";

type mail = { userMail: string }

export default function ResetPass({ name }: { name: string }) {
  const [input, setInput] = useState({
    password: "",
    rePassword: "",
  });
  const { writeMessage } = useContext(APIMessageContext);

  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push("/login");
    }
  });

  if (!status) {
    return (<h3>...Loading</h3>);
  }


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
      const resetPass: mail = await rest.put("/api/user", { mail: name, newPass: input.password });
      if (!!resetPass.userMail) {
        writeMessage("success", "The password was changed successfully.");
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
    <Container >
      <Row style={{ margin: "auto", width: "18rem" }}>
        <Stack className="pt-0" as={Form} noValidate onSubmit={handleSubmit} gap={2}>
          {/* {message && message.text.length > 0 &&
                <Alert className="p-2 pe-5" variant={message?.variant} onClose={() => writeMessage(null)} dismissible>
                  {message.text}
                </Alert>
              } */}
          <div className="mb-2">
            <h4 style={{ textAlign: "center" }}>Change password for</h4>
            <h4 style={{ textAlign: "center" }}>{`@ ${name}`}</h4>
          </div>
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

          <Button className="mt-4" variant="success" type="submit" >
            Change password
          </Button>
        </Stack>
      </Row>
    </Container>
  );
}

