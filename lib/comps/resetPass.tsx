import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Alert from "react-bootstrap/Alert";

import rest, { FetchError } from "../utils/rest-client";
import { APIMessageContext } from "../comps/GlobalMessageHook";

type mail = { userMail: string }

type resetProps = {
  mail: string;
  setShowResetComp: (a: boolean) => void;
};

export default function ResetPass({ mail, setShowResetComp }: resetProps) {
  const [errorMsg, setErrorMsg] = useState<string>("");
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
      setErrorMsg("Password must be at least eight symbols long!");
      return;
    }
    if (input.password !== input.rePassword) {
      setErrorMsg("Confirm password must match password!");
      return;
    }

    try {
      setShowResetComp(false);
      const resetPass: mail = await rest.put("/api/user", { mail, newPass: input.password });
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
          <div className="mb-2">
            <h4 style={{ textAlign: "center" }}>Change password for</h4>
            <h4 style={{ textAlign: "center" }}>{`${mail}`}</h4>
          </div>
          {errorMsg && errorMsg.length > 0 &&
            <Alert className="p-2 m-0 position-relative" variant="warning" >
              <div className="pe-3" >
                {errorMsg}
              </div>
              <Button className="position-absolute top-0 end-0 ps-2 border-0 " variant="outline-dark" size="sm" onClick={() => setErrorMsg("")}>
                <i className="fas fa-times" />
              </Button>
            </Alert>
          }
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
    </Container >
  );
}

