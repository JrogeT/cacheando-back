import AuthService from "./services/auth.service";
import RoomsService from "./services/rooms.service";
import Room from "./models/room";
import Player from "./models/player";
import GamesService from "./services/games.service";

require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const roomsService: RoomsService = new RoomsService();
const authService: AuthService = new AuthService();
const gamesService: GamesService = new GamesService();

app.post("/pusher/auth", (req: any, res: any) => {

    const authReponse = authService.auth(
        req.body.socket_id,
        req.body.channel_name,
        req.body.username
    );

    let player: Player = new Player(
        'player-' + req.body.socket_id,
        false,
        req.body.username
    );
    roomsService.addPlayerToRoom(req.body.roomId, player);

    console.log('member authenticated: ' + player.id);
    res.send(authReponse);
});

app.post("/api/webhooks", (req: any, res: any) => {
    try {
        if (req.body.events[0].name == 'member_removed') {
            const channel = req.body.events[0].channel;
            const userId = req.body.events[0].user_id;

            const room = roomsService.getRoomByChannel(channel);
            roomsService.removePlayerFromRoom(room.id, userId);
            console.log('member removed: ' + userId);
        }
    }catch(e: any){
        console.log(e.message);
    }finally {
        res.status(200).send();
    }
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

   roomsService.setPlayerReady(roomId, playerId);

   res.status(200).send();
});

app.post("/api/rooms/:roomId/players/:playerId/results", (req: any, res: any) => {
    const {roomId, playerId} = req.params;
    const { result } = req.body;

    roomsService.finishTurn(roomId, playerId, result);

    res.status(200).send();
});

app.post("/api/results", (req: any, res: any): void => {
   const {dicesValue, launchesMade, scoreboard} = req.body;

   const results = gamesService.getResults(dicesValue, launchesMade, scoreboard);

    res.send(results);
});


const port = process.env.PORT || 3001;
app.listen(port);

// console.log(roomsService.finishTurn('','',{}));

console.log("App listening: " + port);