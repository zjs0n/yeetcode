import React from "react";
import styled from "styled-components";

const ProblemName = styled.div`
  display: inline-block;
  margin-right: 10px;
  text-align: left;
`;
const ProblemDifficulty = styled.div`
  display: inline-block;
  background-color: green;
  font-size: 1.5em;
  color: white;
  text-align: left;
  rounded: 5px;
  padding-left: 10px;
  padding-right: 10px;
`;

const ProblemTitle = styled.div`
  text-align: left;
`;
const ProblemDescription = styled.div`
  text-align: left;
`;
// later on, we would parse the problem from the database
// for now we will just hardcode it
function ProblemPanel({title, level, description}) {
  return (
    <div>
      <ProblemTitle>
        <ProblemName>
          <h1>{title}</h1>
        </ProblemName>
        <ProblemDifficulty>
          <h3>{level}</h3>
        </ProblemDifficulty>
      </ProblemTitle>
      <ProblemDescription>
        <p>
          {description}
        </p>
      </ProblemDescription>
    </div>
  );
}

export default ProblemPanel;
