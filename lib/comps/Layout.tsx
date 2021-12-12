import React, { Fragment } from 'react';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';

import Link from 'next/link';
import { useRouter } from 'next/router'
import fetchJson from '../fetchJson'
import useUser from '../useUser'

export interface LayoutProps {
  navLinks: React.ReactNode;
}

export default function Layout(props: React.PropsWithChildren<LayoutProps>) {
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
    <Fragment>
      <Navbar bg="light" expand="md" sticky="top" className="border-bottom">
        <Navbar.Brand href="/">
          <span>Kyrabiika</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          {props.navLinks}

          <Nav>
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
      {props.children}
      <Container id="contacts" fluid className="bg-secondary bg-gradient mt-5 text-light">
        <Container className="py-5">
          <Row>
            <Col sm>
              <p>
                Печем,<br />
                нещо ново за теб!<br />
                Регистрирайте се за нашия бюлетин, за да получавате най-новите известия,продукти и промоции!<br />
                Въведете вашия мейл<br />
                * Не се безпокойте, никога няма да изпратим СПАМ<br />
              </p>
            </Col>
            <Col sm>
              <p>
                Logo<br />
                Христо Белчев 1, 1000, София, България<br />
                Телефон: +359 884 782 976<br />
                Ангел Кънчев 37, 1000, София, България<br />
                Телефон: +359 885 886 190<br />
                Мейл: feedback@jovan.bg<br />
              </p>
            </Col>
            <Col sm>
              <p>
                Работно време<br />
                Понеделник: - Събота: 08:00 - 20:00<br />
                Неделя: Затворено<br />
                Полезно<br />
                Общи Условия<br />
                Политика за Поверителност
              </p>
            </Col>
          </Row>
        </Container>
      </Container>
    </Fragment>
  );
}
