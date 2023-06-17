import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Header } from '../components/Header';

function Problem() {
  return (
    <>
      <Header />
      <Container className="center-container d-flex align-items-center justify-content-center">
        <Form.Group className="mb-3 text-body" controlId="form">
          <h1 id="header-text">Problem Page</h1>
          <a href="/">
            <Button variant="primary">
              Back
            </Button>
          </a>
        </Form.Group>
      </Container>
    </>
  );
}

export default Problem;
