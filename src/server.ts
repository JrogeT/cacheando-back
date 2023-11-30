// -------------------------------
// Import Node Modules
// -------------------------------
require("dotenv").config();
const cors = require("cors");
const Pusher = require("pusher");
const express = require("express");
const bodyParser = require("body-parser");

// ------------------------------
// Create express app
// ------------------------------
const app = express();
// ------------------------------
// Load the middlewares
// ------------------------------
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

const rooms: { id:string, players: any[] }[] = [];

app.post("/pusher/auth", (req: any, res: any) => {

    console.log("Trying to auth");

    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const userId = 'user-'+socketId;
    let userData = {
        id: userId,
        username: req.body.username,
        ready: false
    };
    const presenceData = {
        user_id: userId,
        user_info: {username: userData.username}
    };

    const authReponse = pusher.authorizeChannel(socketId, channel, presenceData);

    let room = rooms.find(
        room => room.id === channel
    );
    if(!room){
        room = {
            id: channel,
            players: []
        };
        rooms.push(room);
    };

    room.players.push(userData);

    console.log(JSON.stringify(rooms));

    pusher.trigger(channel,'client-' + channel + '-players',{
        players: room.players
    });

    res.send(authReponse);
});


const port = process.env.PORT || 3001;
app.listen(port);

console.log("App listening: " + port);