import { ListGroup } from 'react-bootstrap';
import Layout from '../layout/Layout';
import { ListGroupItem } from '../share/ListGroupItem';

function BuildList() {
  return (
    <Layout>
      <>
        <h2 className="text-secondary">repo1</h2>
        <ListGroup>
          <ListGroupItem to="/2/1">Cras justo odio</ListGroupItem>
          <ListGroupItem to="/2/2">Dapibus ac facilisis in</ListGroupItem>
          <ListGroupItem to="/2/3">Morbi leo risus</ListGroupItem>
          <ListGroupItem to="/2/4">Porta ac consectetur ac</ListGroupItem>
          <ListGroupItem to="/2/5">Vestibulum at eros</ListGroupItem>
        </ListGroup>
      </>
    </Layout>
  );
}

export default BuildList;
