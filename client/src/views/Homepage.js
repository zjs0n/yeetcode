import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Header } from '../components/Header';

function Landing() {
  return (
    <>
      <Header />
      <Container className="center-container d-flex align-items-center justify-content-center">
        <Form.Group className="mb-3 text-body" controlId="form">
          <h1 id="header-text">
            <span id='header-orange'>Yeet</span>
            <span id='header-purple'>Code</span>
          </h1>
          <a href="/createroom">
            <Button variant="primary">
              Create a room
            </Button>
          </a>
          <a href="/room">
            <p>
              Or join an existing room
            </p>
          </a>
        </Form.Group>
      </Container>
    </>
  );
}

export default Landing;
