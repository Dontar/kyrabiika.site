import { Button, Col, ListGroup } from 'react-bootstrap';
import Layout from '../layout/Layout';
import { ListGroupItem } from '../share/ListGroupItem';

function RepoList() {
  return (
    <Layout syncButton={
      <Col className="pt-1">
        <Button variant="outline-secondary">Sync</Button>
      </Col>
    }>
      <ListGroup>
        <ListGroupItem to="/1">Cras justo odio</ListGroupItem>
        <ListGroupItem to="/2">Dapibus ac facilisis in</ListGroupItem>
        <ListGroupItem to="/3">Morbi leo risus</ListGroupItem>
        <ListGroupItem to="/4">Porta ac consectetur ac</ListGroupItem>
        <ListGroupItem to="/5">Vestibulum at eros</ListGroupItem>
      </ListGroup>

    </Layout>


  );
}

export default RepoList;
