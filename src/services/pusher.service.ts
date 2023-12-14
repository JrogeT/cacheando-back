const Pusher = require("pusher");

export default class PusherService {

    private static instance: PusherService;
    private pusher: any = undefined;
    private constructor() {
        this.pusher = new Pusher({
            appId: `${process.env.PUSHER_APP_ID}`,
            key: `${process.env.PUSHER_API_KEY}`,
            secret: `${process.env.PUSHER_API_SECRET}`,
            cluster: `${process.env.PUSHER_APP_CLUSTER}`,
            encrypted: true
        });
    }

    public static get Instance()
    {
        return this.instance || (this.instance = new this());
    }

    public authorizeChannel(socketId: string, channel: string, presenceData: any): any {
        return this.pusher.authorizeChannel(socketId, channel, presenceData);
    }

    public trigger(channelName: string, eventName: string, data: any): void {
        this.pusher.trigger(channelName, eventName, data);
    }



}