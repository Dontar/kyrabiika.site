import { Badge, ListGroup } from 'react-bootstrap';
import Layout from '../layout/Layout';
import { ListGroupItem } from '../share/ListGroupItem';


function BuildDecor(props: React.PropsWithChildren<any>) {
  return (
    <>
      <Badge pill variant="light"><i className="bi-gear" style={{fontSize: " large"}}/></Badge>
      <span {...props} className="ml-2"/>
    </>
  );
}


function BuildList() {
  return (
    <Layout>
      <>
        <h2 className="text-secondary">repo1</h2>
        <ListGroup>
          <ListGroupItem to="/2/1"><BuildDecor>Cras justo odio</BuildDecor></ListGroupItem>
          <ListGroupItem to="/2/2"><BuildDecor>Dapibus ac facilisis in</BuildDecor></ListGroupItem>
          <ListGroupItem to="/2/3"><BuildDecor>Morbi leo risus</BuildDecor></ListGroupItem>
          <ListGroupItem to="/2/4"><BuildDecor>Porta ac consectetur ac</BuildDecor></ListGroupItem>
          <ListGroupItem to="/2/5"><BuildDecor>Vestibulum at eros</BuildDecor></ListGroupItem>
        </ListGroup>
      </>
    </Layout>
  );
}

export default BuildList;
