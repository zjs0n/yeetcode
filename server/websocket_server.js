// establish the web sockets
const Websocket = require('ws')
// the websocket server will be listening on port 8080
const wss = new Websocket.Server({ port: 8080 })

// while rooms are being created, this stores all the information about all possible rooms
let rooms = {}

// once a room has been created, this dictionary maps rooms to users, which are mapped to their scores
let active_rooms = {}

// import the database directly to get the question
const easy_data = require('./database/problems_easy.json')
const medium_data = require('./database/problems_medium.json')
const hard_data = require('./database/problems_hard.json')

function generate_id() {
  return Math.floor(100000 + Math.random() * 900000)
}

wss.on('connection', function (ws_client) {
  /**
   * This function will create a new room within the server client after a user initiates the creation on the client side
   * The creator is automatically added as the first user in the room 
   * @param {*} params - of the form {"user": username}
   */
  function create_room(params) {
    // generate the new room id as a random 6 digit integer
    const id = generate_id()
    // add error handling to check a given room doesn't exists already
    rooms[id] = [{"client": ws_client, "username": params["user"], "score": 0}]
    ws_client["room"] = id
    console.log("created room")
    // send the message to the client with the room_id, username and the type of message
    ws_client.send(JSON.stringify({type: "create", room_id: id, username: params["user"]}))
  }
  
  /**
   * Given the room id and the username, a user attempts to join the room with the given id
   * Error handling of non-existant rooms is accounted for
   * @param {*} params of the form {id: , user: }
   * @returns 
   */
  function join_room(params) {
    const room_id = params.id
    if (!Object.keys(rooms).includes(room_id)) {
      console.log(`Room ${room_id} does not exists`)
      return
    }
    console.log('joining room')
    rooms[room_id].push({"client": ws_client, "username": params["user"], "score": 0})
    ws_client["room"] = room_id
    ws_client.send(JSON.stringify({"type": "join", "username": params["user"], "room_id": room_id, "message": "Success"}))
  }
  
  /**
   * This function removes the input room from the list of rooms
   * @param {*} room 
   */
  function close(room) {
    rooms = rooms.filter(x => x != room)
  }

  /**
   * This function is activated when the start button on the client side is hit in order to send start request to all other users in the room
   * @param {*} params - of the form {id: x}
   */
  function start_game(params) {
    let room_settings = {}
    // for each user in the room, we traverse the users for the client and send a message
    rooms[params.id].forEach(x => {
      x["client"].send(JSON.stringify({"type":"start", "message": "Success"}))
      room_settings[x["username"]] = x["score"]
    });
    console.log('Start Room')
    let curr_game = {}
    if (params.difficulty === "Easy") {
      curr_game = easy_data[Math.floor(Math.random() * easy_data.length)]
    } else if (params.difficulty === "Medium") {
      curr_game = medium_data[Math.floor(Math.random() * medium_data.length)]
    } else {
      curr_game = hard_data[Math.floor(Math.random() * hard_data.length)]
    }
    curr_game = easy_data[4]
    curr_game["duration"] = params.duration * 60
    // we initialize the starting time in seconds to be what we currently start with
    // we also initialize an empty set to contain the users who have finished the game in order to track the users in the end
    active_rooms[params.id] = {"users": room_settings, "game": curr_game, "start_time": Math.round(Date.now() / 1000), "users_finish": new Set()}
  }

  /**
   * This function sends a variable to transition the page
   */
  /**
   * This function is used to remove users from rooms once the game has ended or if a user seeks to leave a room 
   * @param {*} params 
   */
  function leave_room(params) {
    const curr_room = ws.room
    // remove the given user from this room
    rooms[curr_room] = rooms[curr_room].filter(x => x != ws_client)
    ws_client["room"] = undefined

    if (rooms[curr_room].length == 0) {
      close(curr_room)
    }
  }

  /**
   * This function is used to retrieve all users that are currently in the room and return it as a list
   */
  function get_all_users(params) {
    const room_id = params.id
    console.log('Get All Users')
    console.log(rooms)
    if (!Object.keys(rooms).includes(room_id)) {
      console.log(`Room ${room_id} does not exists`)
      ws_client.send(`{users: ${[]}}`)
      return
    }
    ws_client.send(JSON.stringify({"type": "get_all", "users": rooms[room_id]}))
  }

  /**
   * This function is used to retrieve all the scores of all the users within a given room
   */
  function get_all_scores(params) {
    const room_id = params.id
    if (!Object.keys(active_rooms).includes(room_id)) {
      console.log(`Room ${room_id} does not exists`)
      ws_client.send(`{users: ${[]}}`)
      return
    } else {
      console.log("This is the active room")
      console.log(active_rooms)
      ws_client.send(JSON.stringify({"type": "get_all_scores", "scores": active_rooms[room_id]}))
    }

    if (active_rooms[room_id]["users_finish"].size == Object.keys(active_rooms[room_id]["users"]).length) {
      ws_client.send(JSON.stringify({type: "leave", timer: 0, scores: active_rooms[room_id]}));
    }
  }

  function update_score(params) {
    const room_id = params.id
    const user = params.username
    const score = params.score

    console.log('Update Score')
    console.log(active_rooms[room_id])
    let curr_score = active_rooms[room_id]["users"][user]
    console.log(`The current score is ${curr_score}`)
    // we take the max in order to allow the users to submit multiple times and maintain their highest score
    active_rooms[room_id]["users"][user] = Math.max(curr_score, score)
    console.log(active_rooms)
    // 100 indicates the user as finished the game
    if (active_rooms[room_id]["users"][user] === 100) {
      active_rooms[room_id]["users_finish"].add(user)
    }

    ws_client.send(JSON.stringify({"type": "update_score", "username": user, "result": "Success"}))
  }

  function continue_timer(params) {
    const room_id = params.id;
    // compute the new time based on the difference of base time and current time and subtract that from the overall time given
    let new_time = active_rooms[room_id].game.duration  - (Math.round(Date.now() / 1000) - active_rooms[room_id].start_time)
    if (new_time <= 0) {
      ws_client.send(JSON.stringify({type: "leave", timer: new_time, "scores": active_rooms[room_id]}));
    } else {
      ws_client.send(JSON.stringify({ type: "continue_timer", room_id: room_id, timer: new_time, scores: active_rooms[room_id]}));
    }
    
  }

  // once we receive a message from this specific client, we handle it as follows
  ws_client.on('message', function (message) {
    // message will come in the form of {type: , params: {}}
    const curr = JSON.parse(message)
    const type = curr["type"]
    const params = curr["params"]

    switch (type) {
      case "create":
        create_room(params)
        break
      case "join":
        join_room(params)
        break
      case "leave":
        leave_room(params)
        break
      case "get_all":
        get_all_users(params)
        break
      case "get_all_scores":
        get_all_scores(params)
        break
      case "update_score":
        update_score(params)
        break
      case "start":
        start_game(params)
        break
      case "continue_timer":
        continue_timer(params)
        break
      default:
        console.log('Invalid Type')
        break
    }
    console.log('Server Messaged')
  })
})