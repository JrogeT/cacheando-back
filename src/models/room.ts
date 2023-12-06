import Player from "./player";

export default class Room{
    constructor(
        public id: string,
        public channelName: string,
        public players: Player[]
    ) { }
}