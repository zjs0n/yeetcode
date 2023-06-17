import React from 'react';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Navigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { RoomContainer } from '../components/RoomContainer'
import { useNavigate } from 'react-router-dom'
import { addUser } from '../api/User'

function Room() {
  const [user, setUser] = useState('')
  const [roomId, setRoomId] = useState(0)
  const [currInterval, setCurrInterval] = useState(null)
  const [start, setStart] = useState(false)

  // use to navigate to another page
  const navigate = useNavigate()

  // if start becomes true, we trigger the current page to navigate to the game page
  useEffect(() => {
    if (start) {
      navigate("/game")
    }
  }, [start, navigate])

  // defines the list of users that have joined the created room
  const [userlist, setUserList] = useState([])

  // this state determines if we have joined the game. If we have, we render the lobby view
  const [joined, setJoined] = useState(false)
  // define the web socket for this user who wants to join the room
  const ws = new WebSocket("ws://localhost:8080")

  ws.onmessage = function(event) {
    // convert the server message into JSON and process what kind of message is being received
    const result = JSON.parse(event.data)
    if (result.type === 'get_all') {
      let users = []
      // receive the users of the room and update the user list
      result.users.forEach(x => {
        users.push(x["username"])
      });
      setUserList(users)
    } else if (result.type === 'start') {
        if (result.message === 'Success') {
          setStart(true)
          console.log("ROOM CHECKER");
          console.log(result.scores.game.duration);
          ws.send(
            JSON.stringify({
              type: "continue_timer",
              params: {
                id: user.room_id.toString(),
                timer: result.scores.game.duration,
              },
            })
          );
        }
        console.log("Start game")
    } else if (result.type === 'join') {
      if (result.message === 'Success') {
        // we establish a session for this user as long as we have successfully joined the room
        addUser({username: result.username, room_id: result.room_id})
      }
    }
    console.log(result)

  }

  function submitHandler() {
    ws.send(JSON.stringify({type: "join", params: {user: user, id: roomId, client: ws}}))
    const interval = setInterval(() => {
      ws.send(JSON.stringify({type: "get_all", params: {id: roomId}}))
    }, 2000)
    setUserList([user])
    setCurrInterval(interval)
    // change the view
    setJoined(true)
  }
  return (
    <>
      <Header />
      <Container className="center-container d-flex align-items-center justify-content-center">
        {!joined && (
          <Form.Group className="mb-3 text-body" controlId="form">
            <h1 id="header-text">Join a Room!</h1>
            <div className="join_box">
              <Form.Label style={{fontWeight: 'bold', color: '#421688'}}>Enter Username: </Form.Label>
              <Form.Control className="room_id" onChange={(e) => setUser(e.target.value)}/>
              <Form.Label style={{fontWeight: 'bold', color: '#421688'}}>Enter Room ID: </Form.Label>
              <Form.Control className="room_id" onChange={(e) => setRoomId(e.target.value)}/>
              <Button className="create_button" variant="primary" onClick={() => submitHandler()}>
                Join
              </Button>
            </div>
          </Form.Group>
        )}

        {joined && (
            <div>
              <Form.Group className="mb-3 text-body" controlId="form2">
                <h1 id="header-text">Joined Room! </h1>
                <h4>Invite others to join with this link or go to yeetcode.co and enter room id: </h4>
                <h2 style={{marginTop: "20px", color: "#EB971A"}}>{roomId}</h2>
                <Button variant="danger" className="leave_button"> Leave Game </Button>
              </Form.Group>
              <div className="container-space">
                <RoomContainer title={"Players"} players={userlist}/>
                <RoomContainer title={"Game Settings"} players={[]}/>
              </div>
                
            </div>
                
        )}
      </Container>
    </>
  );
}

export default Room;
