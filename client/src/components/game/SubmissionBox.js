import React from "react";
import styled from "styled-components";
import Form from "react-bootstrap/Form";

//const BoxDim = styled.div``;
function SubmissionBox() {
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Submit your code here</Form.Label>
        <Form.Control as="textarea" rows={3} />
      </Form.Group>
    </Form>
  );
}

export default SubmissionBox;
