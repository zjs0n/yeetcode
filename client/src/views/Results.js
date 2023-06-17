import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from "styled-components";
import { useNavigate } from 'react-router-dom'

const Table = styled.table`
width: 100%;
text-align: center;
margin-bottom: 10%;
height:max-content
`;

const TableHeader = styled.th`
font-size: 35px;
`;
const TableData = styled.td`
margin-bottom: 100%;
font-size:30px;
`;
const Center = styled.div`
text-align: center;
`;
function Results() {
    // use to navigate to another page
    const navigate = useNavigate()
    // get the location object from react router
    const location = useLocation();
    console.log(location.state.usermap)
    console.log(typeof (location.state.usermap))
    const sortable = Object.entries(location.state.usermap)
        .sort(([, a], [, b]) => b - a).slice(0, Object.keys(location.state.usermap).length).reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
    console.log(sortable)
  return (
      <>
          <Header />
          <h1>Final Results</h1>
          <Table>
              <tbody>
                  <tr>
                      <TableHeader>RANK</TableHeader>
                      <TableHeader>NAME</TableHeader>
                      <TableHeader>SCORE</TableHeader>
                  </tr>
                  {Object.keys(sortable).map((key, index) => (
                      <tr key={key}>
                          <TableData>{index + 1}</TableData>
                          <TableData>{key}</TableData>
                          <TableData>
                              {sortable[Object.keys(sortable)[index]]}
                          </TableData>
                      </tr>
                  ))}
              </tbody>
          </Table>
          <Center><Button className="button-modal" onClick={() => navigate("/")}>Play Again</Button></Center>
          
          
      </>
  );
}

export default Results;