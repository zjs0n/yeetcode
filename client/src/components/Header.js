import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export function Header() {
  return (
    <Navbar className="Yeetcode-red-bg" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <span id='header-orange'>Yeet</span>
          <span id='header-purple'>Code</span>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
