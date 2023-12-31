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
            throw new Error('Room not found by id: ' + id);
        }
        return room;
    }

    public getRoomByChannel(channel: string): Room {
        const room = this.roomsRepository.findRoomByChannel(channel);
        if(!room){
            throw new Error('Room not found by channel: ' + channel);
        }
        return room;
    }

    public addPlayerToRoom(roomId: string, player: Player): void {
        const room = this.roomsRepository.findRoomById(roomId);
        if(!room) throw new Error('Room not found');
        room.players.push(player);
    }

    public removePlayerFromRoom(roomId: string, playerId: string): void {
        const room = this.getRoom(roomId);
        const playerIndex: number = room.players.findIndex((player: Player) => player.id === playerId);
        if(room.playerInTurnId == playerId){
            this.finishTurn(roomId, playerId, {});
        }
        room.players.splice(playerIndex, 1);

        if(room.players.length == 0)this.roomsRepository.deleteRoom(roomId);
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
        console.log('starting game in room: ' + room.channelName);
        room.playing = true;
        room.playerInTurnId = room.players[0].id;
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

    public finishTurn(roomId: string, playerId: string, result: any): void {
        const room = this.roomsRepository.findRoomById(roomId);
        if(!room) return;

        const player = room.players.find((player: Player) => player.id === playerId);
        if(!player) return;

        player.scoreboard.apply(result);

        let actualPlayerIndex = room.players.findIndex((player: Player) => player.id === playerId);
        if(actualPlayerIndex === room.players.length - 1) actualPlayerIndex = -1;
        const nextPlayer = room.players[actualPlayerIndex + 1];

        room.playerInTurnId = nextPlayer.id;

        // const nextPlayer = new Player('',false,'');
        // nextPlayer.scoreboard = new Scoreboard(1,2,3,4,5,6,0,0,0);
        // nextPlayer.scoreboard.getTotal();

        if(nextPlayer.scoreboard.isFull()){
            const winner = room.players.reduce(
                (a: Player, b: Player): Player => {
                    return a.scoreboard.total > b.scoreboard.total ? a : b;
                });
            this.pusherService.trigger(
                room.channelName,
                'client-' + room.channelName + '-end-game',
                {
                    playerInTurn: player,
                    winner,
                }
            )
            room.players.forEach((player: Player): void => {player.ready = false});
        }else
            this.pusherService.trigger(
                room.channelName,
                'client-' + room.channelName + '-turn-finished',
                {
                    playerInTurn: player,
                    nextPlayer
                }
            )
    }
}