import { Badge, Button, Col, ListGroup, Spinner } from 'react-bootstrap';
import Layout from '../layout/Layout';
import { ListGroupItem } from '../share/ListGroupItem';

function RepoDecor(props: React.PropsWithChildren<any>) {
  return (
    <>
      <Badge pill variant="light"><i className="bi-share" style={{fontSize: " large"}}/></Badge>
      <span {...props} className="ml-2"/>
    </>
  );
}

function RepoList() {
  return (
    <Layout syncButton={
      <Col className="pt-1">
        <Button variant="outline-secondary text-nowrap">
          <Spinner size="sm" animation="border" className="mr-2" />
          {/* <i className="bi bi-arrow-clockwise mr-2" /> */}
            Sync
        </Button>
      </Col>
    }>
      <ListGroup>
        <ListGroupItem to="/1"><RepoDecor>Cras justo odio</RepoDecor></ListGroupItem>
        <ListGroupItem to="/2"><RepoDecor>Dapibus ac facilisis in</RepoDecor></ListGroupItem>
        <ListGroupItem to="/3"><RepoDecor>Morbi leo risus</RepoDecor></ListGroupItem>
        <ListGroupItem to="/4"><RepoDecor>Porta ac consectetur ac</RepoDecor></ListGroupItem>
        <ListGroupItem to="/5"><RepoDecor>Vestibulum at eros</RepoDecor></ListGroupItem>
      </ListGroup>

    </Layout>


  );
}

export default RepoList;
