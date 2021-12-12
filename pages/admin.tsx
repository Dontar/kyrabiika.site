import React, { } from 'react'
import { Container } from 'react-bootstrap';
import Layout from '../lib/Layout';
import useUser from '../lib/useUser'


export default function Admin() {
  const { user } = useUser({
    redirectTo: '/login',
  })

  return (
    <Layout navLinks={<></>}>
      {user && (
        <Container>
          <h1>This is Admin page </h1>
        </Container>
      )}
    </Layout>
  )
}
