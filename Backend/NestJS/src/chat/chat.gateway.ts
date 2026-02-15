import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private chatService: ChatService) { }

    handleConnection(client: Socket) {
        console.log(`Client connected to chat: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected from chat: ${client.id}`);
    }

    @SubscribeMessage('joinDept')
    async handleJoinDept(
        @MessageBody() departamentoId: string,
        @ConnectedSocket() client: Socket,
    ) {
        client.join(`dept:${departamentoId}`);
        const history = await this.chatService.getHistory('DEPARTAMENTO', undefined, departamentoId);
        client.emit('deptHistory', history);
    }

    @SubscribeMessage('joinOrgan')
    async handleJoinOrgan(
        @MessageBody() orgaoId: string,
        @ConnectedSocket() client: Socket,
    ) {
        client.join(`organ:${orgaoId}`);
        const history = await this.chatService.getHistory('ORGAO', orgaoId);
        client.emit('organHistory', history);
    }

    @SubscribeMessage('joinGlobal')
    async handleJoinGlobal(
        @ConnectedSocket() client: Socket,
    ) {
        client.join('global');
        const history = await this.chatService.getHistory('GLOBAL');
        client.emit('globalHistory', history);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @MessageBody() data: {
            content: string;
            senderId: string;
            scope: 'DEPARTAMENTO' | 'ORGAO' | 'GLOBAL';
            orgaoId?: string;
            departamentoId?: string;
        },
    ) {
        const savedMessage = await this.chatService.saveMessage(
            data.content,
            data.senderId,
            data.scope,
            data.orgaoId,
            data.departamentoId,
        );

        // Broadcast based on scope
        let room = 'global';
        if (data.scope === 'DEPARTAMENTO') room = `dept:${data.departamentoId}`;
        if (data.scope === 'ORGAO') room = `organ:${data.orgaoId}`;

        this.server.to(room).emit('newMessage', savedMessage);
    }
}
