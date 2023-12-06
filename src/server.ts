// -------------------------------
// Import Node Modules
// -------------------------------
import RoomsService from "./services/rooms.service";
import Room from "./models/room";
import Player from "./models/player";

require("dotenv").config();
const cors = require("cors");
const Pusher = require("pusher");
const express = require("express");
const bodyParser = require("body-parser");

const corsOption = {
    origin: '*',
    method: '*',
};

// ------------------------------
// Create express app
// ------------------------------
const app = express();
// ------------------------------
// Load the middlewares
// ------------------------------
// app.use(cors(corsOption));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const pusher = new Pusher({
    appId: `${process.env.PUSHER_APP_ID}`,
    key: `${process.env.PUSHER_API_KEY}`,
    secret: `${process.env.PUSHER_API_SECRET}`,
    cluster: `${process.env.PUSHER_APP_CLUSTER}`,
    encrypted: true
});

Pusher.logToConsole = true;

// const rooms: { id:string, players: any[] }[] = [];
const roomsService: RoomsService = new RoomsService();

app.post("/pusher/auth", (req: any, res: any) => {

    console.log("Trying to auth");
    // console.log(req.body);

    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const playerId = 'player-'+socketId;
    let player = {
        id: playerId,
        username: req.body.username,
        ready: false
    };
    const presenceData = {
        user_id: playerId,
        user_info: {username: player.username}
    };

    const authReponse = pusher.authorizeChannel(socketId, channel, presenceData);

    roomsService.addPlayerToRoom(req.body.roomId, player);

    res.send(authReponse);
});

app.get("/api/rooms", (req: any, res: any) => {
    const rooms: Room[] = roomsService.getRooms();
    res.status(200).send(rooms);
});

app.post("/api/rooms", (req: any, res: any) => {
    const room: Room = roomsService.createRoom();
    res.status(200).send(room);
});

app.get("/api/rooms/:id", (req: any, res: any) => {
   const roomId = req.params.id;
   const room = roomsService.getRoom(roomId);
   res.status(201).send(room);
});

app.get("/api/rooms/:roomId/players/:playerId/ready", (req: any, res: any) => {
   const {roomId, playerId} = req.params;
    // console.log(roomId,playerId)
   roomsService.setPlayerReady(roomId, playerId);

   const room = roomsService.getRoom(roomId);
    console.log('triggering to: ' + room.channelName);
    console.log('this event: ' + 'client-' + room.channelName + '-ready')
   pusher.trigger(
       room.channelName,
       'client-' + room.channelName + '-ready',
       {
           playerReadyId: playerId
   }).then(
       (value: any) =>{
           console.log('response from trigger')
           // console.log(value);
       }
   )
   res.status(200).send();
});


const port = process.env.PORT || 3001;
app.listen(port);

console.log("App listening: " + port);