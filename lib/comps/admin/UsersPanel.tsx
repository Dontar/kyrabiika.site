import useSWR from "swr";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";

import { MenuItem } from "../../db/DbTypes";
import { TabHeader } from "./TabHeader";

export function UsersPanel() {
  const { data: users, error: usersError } = useSWR<MenuItem[]>("/api/users", url => fetch(url).then(r => r.json()));

  return (
    <Container>
      <TabHeader title="Users" button={<Button>Add</Button>} />
      <ListGroup>
        {users?.map((user, idx) => (
          <ListGroup.Item key={idx}>
            {JSON.stringify(user)}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}
