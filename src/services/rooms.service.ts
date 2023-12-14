import RoomsRepository from "../repositories/rooms.repository";
import Room from "../models/room";
import Player from "../models/player";
import PusherService from "./pusher.service";

export default class RoomsService {

    private roomsRepository: RoomsRepository;
    private pusherService: PusherService;

    constructor() {
        this.roomsRepository = new RoomsRepository();
        this.pusherService = PusherService.Instance;
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

        this.pusherService.trigger(
            room.channelName,
            'client-' + room.channelName + '-ready',
            { playerReadyId: playerId }
        );

        const  roomReadyToStart= !room.players.some(
            (player: Player) => !player.ready);
        if(roomReadyToStart) this.startGame(room);
    }

    private startGame(room: Room): void {
        console.log('starting game in: ' + room.channelName);
        this.pusherService.trigger(
            room.channelName,
            'client-' + room.channelName + '-start-game',
            {
                firstPlayer: room.players[0]
            }
        );
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