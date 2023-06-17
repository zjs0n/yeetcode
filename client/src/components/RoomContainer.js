import React from 'react';

export function RoomContainer({title, players}) {
  return (
    <div className="roombox_container">
        <h3 className="roombox_text">{title}</h3>
        <div className="roombox">
            {players.map(x => (<div> {x}</div>))}
        </div>
    </div>
    
  );
}