import Room from "../models/room";

export default class RoomsRepository{
    private roomList: Room[];

    constructor() {
        this.roomList = [];
    }

    public createRoom(channelName: string): Room{
        let newRoom: Room = new Room(
            this.generateId(),
            channelName,
            []
        );
        this.roomList.push(newRoom);
        return newRoom;
    }

    public findAll(): Room[] {
        return this.roomList;
    }

    public findRoomById(id: string): Room | undefined{
        return this.roomList.find((room: Room)=>room.id === id);
    }

    private generateId(): string {
        let result: string = '';
        const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charactersLength: number = characters.length;
        let counter: number = 6;
        while (counter > 0) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter--;
        }
        return result;
    }

}