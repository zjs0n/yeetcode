import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Header } from "../components/Header";
import { useEffect, useState, useRef } from "react";
import { getUser } from "../api/User";
import ProblemPanel from "../components/game/ProblemPanel";
import Loading from './Loading'
import styled from "styled-components";
import Editor from "@monaco-editor/react";
import { SubmissionBox } from "../components/game/SubmissionBox";
import Participant from "../components/game/Participant";
import Modal from "react-bootstrap/Modal";
import { submitAnswer, getDefaultCodeMap, Language } from "../api/Game"
import ReactMarkdown from "react-markdown";
import { useNavigate } from 'react-router-dom';

const ProblemContent = styled.div`
  float: left;
  display: inline-block;
  width: 50%;
  outline: 1px lightgray solid;
  margin-left: -10px;
  height: 83vh;
  overflow-y: scroll;
`;
const EditorContent = styled.div`
  display: inline-block;
  outline: 1px lightgray solid;
  width: 100%;
`;

const Submit = styled.div`
  outline: 1px lightgray solid;
`;

const EditAndSubmit = styled.div`
  display: inline-block;
  width: 50%;
  outline: 1px lightgray solid;
`;

function Game() {
  // value is the input code that we set
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState(5);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // function to set the current code value based on the editor
  function handleEditorChange(value, event) {
    setValue(value);
  }

  // the current user playing
  const [user, setUser] = useState({});
  // usermap is a map of all users in the room and their current score
  const [usermap, setUserMap] = useState(null);

  // the current game setting
  const [game, setGame] = useState({})

  // the default code available
  const [codeMap, setCodeMap] = useState(null);

  // sets the results of running the tester
  const [tester, setTester] = useState({});

  // the latest output from the user's code
  const [latestOutput, setLatestOutput] = useState(null);

  // the language type chosen (currently only Python)
  const language = Language.PYTHON;

  // initialize the game websocket with a useRef to prevent it from changing on a re-render
  const ws = useRef(null);

  /**
   * This function handles the submission of the problem and sends a post request to the tester
   */

  // use to navigate to another page
  const navigate = useNavigate()
  
  async function onSubmit() {
    let tests = []
    console.log("in submit")
    console.log(game)
    for (let i = 0; i < game["test_input"].length; i++) {
      const current = {"input": game["test_input"][i], "output": game["test_output"][i]}
      tests.push(current)
    }

    let inputs = []
    for (let i = 0; i < game["input_type"].length; i++) {
      const current = {"name": game["input_type"][i]["name"], "type": game["input_type"][i]["type"]}
      inputs.push(current)
    }
    
    let result = {
      "problem": {
        "testCases": tests, 
        "problemInputs":  inputs,
        "outputType": game["output_type"]
      },
      "code": value,
      "language": "PYTHON"
    }

    const results = await submitAnswer(JSON.stringify(result))
    ws.current.send(
      JSON.stringify({ type: "update_score", params: {"id": user.room_id.toString(), "username": user.username, "score": (results.numCorrect / results.numTestCases) * 100.0}})
    )
    console.log('answer submitted')
    // sets the tester results
    setTester(results)
    console.log(results)
    handleShow()
  }

  // calls the GET request to the server in order to fetch the current session data of the user
  useEffect(() => {
    // initialize a websocket for the room to retrieve the user socket connection
    ws.current = new WebSocket("ws://localhost:8080");

    let game_ws = ws.current

    game_ws.onmessage = function (event) {
      // convert the server response into JSON
      const result = JSON.parse(event.data)
      if (result.type === 'get_all_scores') {
        setUserMap(new Object(result.scores["users"]))
        setGame(result.scores["game"])
        //console.log(result.scores["users"])
        let params = "self, "
        result.scores["game"]["input_type"].forEach(x => {
          params += `${x.name}, `
        })
        console.log(params)
  
      } else if (result.type === 'update_score') {
        console.log('Updating Score')
      } else if (result.type === "continue_timer") {
        //timer stuff
        if (result.timer == null) {
          //do nothing
        } else {
          setTimer(result.timer);
        }
      }
      if (result.type === 'leave') {
        if (result.timer === 0) {
          console.log('Time to leave game')
          ws.current.close()
          //alert('Game has ended')
          navigate('/results', {
            state: { usermap: result.scores.users}
          })
        }
      }
    }
  
    const fetchData = async () => {
      const info = await getUser();
      console.log(info);
      return info;
    };

    fetchData().then((x) => {
      setUser(x);
      if (Object.keys(x).length !== 0) {
        const interval = setInterval(() => {
          game_ws.send(
            JSON.stringify({ type: "get_all_scores", params: { id: x.room_id.toString() } })
          );
          game_ws.send(
            JSON.stringify({
              type: "continue_timer",
              params: {
                id: x.room_id.toString(),
              },
            })
          );
        }, 1000);
      }
    });
  }, []);


  // once the problem on the game page is present, set the default code
  useEffect(() => {
    // Ensure the codeMap only changes once, as the game problem should not be modified
    if (game && game["problem_id"] && codeMap == null) {
      getDefaultCodeMap(game["problem_id"]).then(data => {
        setCodeMap(data);
      });
    }
  }, [game, codeMap, setCodeMap])

  if (usermap == null) {
    return Loading();
  }

  return (
    <>
      <Header />
      <Participant players={usermap} user={user}/>
      <Container className="center-container d-flex align-items-center justify-content-center">
        <Form.Group className="mb-3 text-body" controlId="form">
          {/* <h1 id="header-text">Game Page for {user["username"]}</h1> */}
          <div>Countdown: {timer}</div>
          <ProblemContent>
            <ProblemPanel title={game["problem_name"]} level={game["difficulty"]} description={<ReactMarkdown>{game["problem_description"]}</ReactMarkdown>}/>
          </ProblemContent>
          <EditAndSubmit>
            <EditorContent>
              <Editor
                height="50vh"
                defaultLanguage="python"
                value={codeMap ? codeMap[language] : 'Loading...'}
                onChange={handleEditorChange}
              />
            </EditorContent>
            <Submit>
              <Form style={{"padding": "10px"}}>
                {!tester.exception_type ? (
                  <div>
                    <div>
                      Your score: {!tester.numCorrect ? (
                        <span>0%</span>
                      ) : (
                        <span>{tester.numCorrect} / {tester.numTestCases}</span>
                      )}
                    </div>
                    {(tester.compilationError && tester.compilationError !== null) && (
                      <div>
                        The following <span style={{ color: 'red' }}>compilation error</span> occurred:
                        <div style={{ background: 'lightgrey', borderRadius: '5px' }}>{tester.compilationError}</div>
                      </div>
                    )}
                    {tester.results && tester.results.map((result, index) => {
                      if (result.error) {
                        return (
                          <p>
                            <hr></hr>
                            Error on <span style={{ fontWeight: 700 }}>test case #{index}</span>
                            <br></br>
                            {result.error}
                          </p>
                        )
                      }
                    })}
                  </div>
                ) : (
                  <div style={{ backgroundColor: "#ffcccb", borderRadius: "5px" }}>
                    <p>
                      The code could not be tested because the error <span style={{ fontWeight: 700 }}>{tester.exception_type}</span> was encountered, with the following message:
                      <br></br>
                      {tester.message}
                    </p>
                  </div>
                )}
                <Button variant="primary" onClick={() => onSubmit()}>
                  Submit
                </Button>
              </Form>
            </Submit>
          </EditAndSubmit>
        </Form.Group>
      </Container>
    </>
  );
}

export default Game;
