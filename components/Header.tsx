import React, { Fragment } from 'react';
import Link from 'next/link';
import { Navbar, Nav } from 'react-bootstrap';
import { useRouter } from 'next/router'
import useUser from '../lib/useUser'
import fetchJson from '../lib/fetchJson'

export default function Header() {
  const { user, mutateUser } = useUser()
  const router = useRouter()

  const logOut = async (e: any) => {
    e.preventDefault()
    mutateUser(
      await fetchJson('/api/logout'),
      false
    )
    router.push('/login')
  }


  return (
    <Navbar bg="light" expand="md" sticky="top" className="border-bottom border-secondary mb-2">
      <Navbar.Brand href="/">
        <span>Kyrabiika</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="#products">Products</Nav.Link>
          <Nav.Link href="#history">History</Nav.Link>
          <Nav.Link href="#contacts">Contacts</Nav.Link>
          <Link href="/order" passHref={true}>
            <Nav.Link>Order</Nav.Link>
          </Link>
          {user?.isLoggedIn === false && (
            <Link href="/login" passHref={true}>
              <Nav.Link>Login / Register</Nav.Link>
            </Link>
          )}
          {user?.isLoggedIn === true && (
            <>
              <Link href="/admin" passHref={true}>
                <Nav.Link>Admin</Nav.Link>
              </Link>
              <Link href="/api/logout" passHref={true}>
                <Nav.Link onClick={(e: any) => logOut(e)} >Logout</Nav.Link>
              </Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
