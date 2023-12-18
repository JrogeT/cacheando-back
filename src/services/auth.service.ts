import PusherService from "./pusher.service";

export default class AuthService {

    private pusher: PusherService;
    constructor() {
        this.pusher = PusherService.Instance;
    }

    public auth(socketId: string, channel: string, username: string): any{
        const playerId = 'player-' + socketId;
        const presenceData = {
            user_id: playerId,
            user_info: {username}
        };
        return this.pusher.authorizeChannel(socketId, channel, presenceData);
    }

}