import React from 'react';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Header } from '../components/Header';
import { RoomContainer } from '../components/RoomContainer'
import { useNavigate } from 'react-router-dom'
import { addUser } from '../api/User'

function CreateRoom() {
    // state that is set after the random room ID is generated
    const [roomId, setRoomId] = useState(0)
    // state to determine the current username
    const [username, setUser] = useState("")

    // once the room has been created, we switch views to show the start game section via this state
    const [created, setCreated] = useState(false)

    // defines the list of users that have joined the created room
    const [userlist, setUserList] = useState([])

    // defines whether start was triggered in order to initiate the game
    const [start, setStart] = useState(false)

    // slider 
    const [time_slider, setTimeSlider] = useState(30)

    // difficulty 
    const [difficulty, setDifficulty] = useState("Easy")

    // use to navigate to another page
    const navigate = useNavigate()

    useEffect(() => {
        if (start) {
            navigate("/game")
        }
    }, [start, navigate])

    useEffect(() => {
        let interval = null
        if (roomId !== 0) {
            interval = setInterval(() => {
                ws.send(JSON.stringify({type: "get_all", params: {id: roomId.toString()}}))
            }, 2000)
        }
        return () => clearInterval(interval)
    }, [roomId])


    const ws = new WebSocket("ws://localhost:8080")

    ws.onmessage = function(event) {
        // convert the server response into JSON
        const result = JSON.parse(event.data)

        // this interval will continuously run get_all
        if (result.type === 'create') {
            // result will be in the form of {create: " ", room_id: " ", username: " "}
            setRoomId(result.room_id)

            // sends to the server the room_id and username to be saved as a state
            addUser({username: result.username, room_id: result.room_id})
            // once we create the room id we will constantly poll for the available users
            
        } else if (result.type === 'get_all') {
            // result.users is of the form {client: x, username: y} and so we extract the usernames and put them in a list
            let users = []
            result.users.forEach(x => {
                users.push(x["username"])
            });
            setUserList(users)
        } else if (result.type === 'start') {
            // after we start the game we no longer fetch users from this page
            ws.close()
            console.log("Start game")
            if (result.message === 'Success') {
                setStart(true)
            }
        }
    }

    /**
     * Function handler that will send a create user message to the websocket server
     */
    function submitHandler() {
        ws.send(JSON.stringify({type: "create", params: {user: username, client: ws}}))
        // initialize the list of users to contain the creator
        setUserList([username])
        setCreated(true)
    }

    /**
     * Handler function that will transition to the Game page after a game is started
     */
    function startHandler() {
        ws.send(JSON.stringify({ type: 'start', params: { id: roomId, difficulty: difficulty, duration: time_slider } }))
    }

    console.log(time_slider)

    return (
        <>
        <Header />
        <Container className="center-container d-flex align-items-center justify-content-center" style={{marginTop: "50px"}}>
            {!created && (
                <Form.Group className="mb-3 text-body" controlId="form">
                    <h1 id="header-text">Create a Room</h1>
                    <div className="form_box">
                        <Form.Label style={{fontSize: "20px"}}>Enter a nickname: </Form.Label>
                        <Form.Control className="master_id" onChange={(e) => setUser(e.target.value)}/>
                    </div>

                    <Button className="create_button" variant="primary" onClick={() => submitHandler()}>
                        Create!
                    </Button>
                </Form.Group>
            )}
            {created && (
                <div>
                <Form.Group className="mb-3 text-body" controlId="form2">
                    <h1 id="header-text">Room Created! </h1>
                    <h4>Invite others to join with this link or go to yeetcode.co and enter room id: </h4>
                    <h2 style={{marginTop: "20px", color: "#EB971A"}}>{roomId}</h2>
                    <Button className="start_button" onClick={() => startHandler()}> Start Game </Button>
                </Form.Group>
                <div className="container-space">
                    <RoomContainer title={"Players"} players={userlist}/>
                    <div className="settingsbox_container">
                        <h3 id="game-settings">Game Settings</h3>
                        <div className="settingsbox">
                            <div>
                                Duration of Game: 
                            </div>
                            <div class="slidecontainer">
                                <input type="range" min="1" max="60" value={time_slider} class="slider" id="myRange" onInput={(event) => {console.log(event); setTimeSlider(event.target.value)}}/>
                            </div>
                            <div>
                                {time_slider} Minutes
                            </div>
                            <div>
                                Difficulty:
                            </div>
                            <div>{difficulty}</div> 
                            <div></div>
                            
                            <div style={{display: "flex"}}>
                            <Button className="difficulty_button" onClick={() => setDifficulty("Easy")}> Easy </Button>
                            
                            <Button className="difficulty_button" onClick={() => setDifficulty("Medium")}> Medium </Button>
                            <Button className="difficulty_button" onClick={() => setDifficulty("Hard")}> Hard </Button>

                            </div>
                        </div>
                    </div>
                </div>
                
                </div>
                
            )}
            
        </Container>
        </>
    );
}

export default CreateRoom;
