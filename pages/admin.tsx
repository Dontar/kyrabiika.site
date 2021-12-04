import React, { } from 'react'
import { Container } from 'react-bootstrap';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import useUser from '../lib/useUser'


export default function Admin() {
  const { user } = useUser({
    redirectTo: '/login',
  })

  return (
    <Layout>
      {user && (
        <Container>
          <h1>This is Admin page </h1>
        </Container>
      )}
      <Footer positionFixed={true} />
    </Layout>
  )
}
