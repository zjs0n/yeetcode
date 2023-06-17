import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Header } from '../components/Header';

function Loading() {
  return (
    <>
      <Header />
      <Container className="center-container d-flex align-items-center justify-content-center">
        <Form.Group className="mb-3 text-body" controlId="form">
          <h1 id="header-text">Loading Page</h1>
        </Form.Group>
      </Container>
    </>
  );
}

export default Loading;
