import useSWR from "swr";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";

import md5 from "crypto-js/md5";

import Image from "next/image";

import { User } from "../../db/DbTypes";
import { TabHeader } from "../TabHeader";

export function UsersPanel() {
  const { data: users } = useSWR<User[]>("/api/users", url => fetch(url).then(r => r.json()));

  return (
    <Container>
      <TabHeader title="Users" button={
        <Button>
          <i className="far fa-plus-square" />
          <span className="ms-1">Add</span>
        </Button>
      } />
      <ListGroup>
        {users?.map((user, idx) => (
          <ListGroup.Item key={idx} as={Stack} direction="horizontal" gap={3}>
            <Image src={`https://www.gravatar.com/avatar/${md5(user.mail.toLowerCase())}?d=mp`} alt="" className="rounded align-self-center" width={100} height={80} />
            <Stack className="flex-fill">
              <strong>{`${user.firstName} ${user.lastName}`}</strong>
              <small className="text-muted">{user.mail}</small>
            </Stack>
            <div style={{ minWidth: "60px" }}>
              {user.roles?.map((role, idx) => {
                const variant = role === "Admin" ? "warning" : "success";
                return (
                  <div key={idx}>
                    <Badge bg={variant}>{role}</Badge>
                  </div>
                );
              })}
            </div>
            <Button variant="outline-success" size="sm" className="text-nowrap">
              <i className="far fa-edit" />
              <span className="ms-1">Edit</span>
            </Button>
            <Button variant="outline-danger" size="sm">
              <i className="far fa-times-circle" />
            </Button>

          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}
