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

    let player: Player = new Player(
        'player-' + req.body.socket_id,
        false,
        req.body.username
    );
    roomsService.addPlayerToRoom(req.body.roomId, player);

    const authReponse = authService.auth(
        req.body.socket_id,
        req.body.channel_name,
        req.body.username
    );

    console.log('member authenticated: ' + player.id);
    res.send(authReponse);
});

app.post("/api/webhooks", (req: any, res: any) => {
    try {
        console.log('---------------------------------NEW WEBHOOK---------------------------------------');
        console.log(req.body.events);
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
        console.log('-----------------------------------------------------------------------------------');
        res.status(200).send();
    }
});
app.get("/api/rooms", (req: any, res: any) => {
    try{
        const rooms: Room[] = roomsService.getRooms();
        res.status(200).send(rooms);
    }catch (e: any) {
        res.status(500).send(e.message);
    }
});

app.post("/api/rooms", (req: any, res: any) => {
    try{
        const room: Room = roomsService.createRoom();
        res.status(200).send(room);
    }catch (e: any) {
        res.status(500).send(e.message);
    }
});

app.get("/api/rooms/:id", (req: any, res: any) => {
    try{
       const roomId = req.params.id;
       const room = roomsService.getRoom(roomId);
       res.status(201).send(room);
    }catch (e: any) {
        res.status(500).send(e.message);
    }
});

app.get("/api/rooms/:roomId/players/:playerId/ready", (req: any, res: any) => {
    try{
       const {roomId, playerId} = req.params;

       roomsService.setPlayerReady(roomId, playerId);

       res.status(200).send();
    }catch (e: any) {
        res.status(500).send(e.message);
    }
});

app.post("/api/rooms/:roomId/players/:playerId/results", (req: any, res: any) => {
    try{
        const {roomId, playerId} = req.params;
        const { result } = req.body;

        roomsService.finishTurn(roomId, playerId, result);

        res.status(200).send();
    }catch (e: any) {
        res.status(500).send(e.message);
    }
});

app.post("/api/results", (req: any, res: any): void => {
    try{
       const {dicesValue, launchesMade, scoreboard} = req.body;

       const results = gamesService.getResults(dicesValue, launchesMade, scoreboard);

        res.send(results);
    }catch (e: any) {
        res.status(500).send(e.message);
    }
});


const port = process.env.PORT || 3001;
app.listen(port);

// console.log(roomsService.finishTurn('','',{}));

console.log("App listening: " + port);