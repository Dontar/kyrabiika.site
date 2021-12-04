import React, { Fragment } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export default function Footer({ positionFixed }: any) {

  return (
    <Container id="contacts" fluid className={`bg-secondary bg-gradient mt-5 text-light ${positionFixed && "fixed-bottom"}`}>
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
  )
}


