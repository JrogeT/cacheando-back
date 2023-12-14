import Scoreboard from "./scoreboard";

export default class Player{
    constructor(
        public id: string,
        public ready: boolean,
        public username: string,
        public scoreboard: Scoreboard = new Scoreboard()
    ) { }
}