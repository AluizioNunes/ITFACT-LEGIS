import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class EventsGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('message')
    handleMessage(
        @MessageBody() data: any,
    ): void {
        this.server.emit('message', data);
    }

    @SubscribeMessage('join')
    handleJoin(
        @MessageBody() room: string,
        @ConnectedSocket() client: Socket,
    ): void {
        client.join(room);
        client.emit('joined', room);
    }

    @SubscribeMessage('leave')
    handleLeave(
        @MessageBody() room: string,
        @ConnectedSocket() client: Socket,
    ): void {
        client.leave(room);
        client.emit('left', room);
    }
}
