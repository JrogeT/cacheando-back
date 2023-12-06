import RoomsRepository from "../repositories/rooms.repository";
import Room from "../models/room";
import Player from "../models/player";

export default class RoomsService {

    private roomsRepository: RoomsRepository;

    constructor() {
        this.roomsRepository = new RoomsRepository();
    }

    public createRoom(): Room{
        const randomString: string = this.generateRandomString();
        const channelName: string = 'presence-channel-' + randomString;
        return this.roomsRepository.createRoom(channelName);
    }

    public getRooms(): Room[] {
        return this.roomsRepository.findAll();
    }

    public getRoom(id: string): Room {
        const room = this.roomsRepository.findRoomById(id);
        if(!room){
            throw new Error('Room not found');
        }
        return room;
    }

    public addPlayerToRoom(roomId: string, player: Player): void {
        const room = this.roomsRepository.findRoomById(roomId);
        if(!room) throw new Error('Room not found');
        room.players.push(player);
    }

    public setPlayerReady(roomId: string, playerId: string): void {
        const room = this.roomsRepository.findRoomById(roomId);
        if(!room) throw new Error('Room not found');

        const player = room.players.find((player: any) => player.id === playerId);
        if(!player)throw new Error('Player not found');

        player.ready = !player.ready;
    }

    private generateRandomString(): string {
        let result: string = '';
        const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength: number = characters.length;
        let counter: number = 4;
        while (counter > 0) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter--;
        }
        return result;
    }

}