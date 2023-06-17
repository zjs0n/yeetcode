import React from "react";
import styled from "styled-components";

const Player = styled.div`
  border-radius: 50px;
  width: 45px;
  height: 45px;
  background: green;
  display: flex;
  text-align: center;
  color: white;
  justify-content: center;
  align-items: center;
  margin: 5px;
`;
const PlayerHeader = styled.div`
  display: flex;
  justify-content: center;
`;
// const PlayerName = styled.div`
//   width: fit-content;
//   height: fit-content;
// `;

// designate a color to a user based on their index
const color_map = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink']

// this function parses the first letter from a user's name
function get_first_letter(name) {
  return name[0].toUpperCase()
}

function Participant({players, user}) {
  return (
    <PlayerHeader>
      {Object.keys(players).map((x, idx) => (
        <div style={{"backgroundColor": x === user.username ? "rgba(52, 52, 52, 0.4)" : ""}}>
          <Player style={{'backgroundColor': color_map[idx]}}>
            <h3>{get_first_letter(x)}</h3>
          </Player>
          <h5>{players[x]}%</h5>
      </div>
      ))}
    </PlayerHeader>
  );
}

export default Participant;
