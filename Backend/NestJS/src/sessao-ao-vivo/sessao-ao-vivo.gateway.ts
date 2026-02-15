import {
    WebSocketGateway, WebSocketServer, SubscribeMessage,
    MessageBody, OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

/**
 * Painel ao Vivo de Sessões — WebSocket Gateway.
 * Streaming da sessão plenária com votação em tempo real.
 */
@WebSocketGateway({ namespace: '/sessao-ao-vivo', cors: { origin: '*' } })
@Injectable()
export class SessaoAoVivoGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private sessaoAtiva: {
        id: string;
        status: string;
        tipo: string;
        itemAtual: string;
        iniciadaEm: string;
        presentes: string[];
        votos: Record<string, { vereador: string; voto: string }>;
    } | null = null;

    private espectadores = 0;

    handleConnection(client: Socket) {
        this.espectadores++;
        client.emit('espectadores', this.espectadores);
        if (this.sessaoAtiva) {
            client.emit('sessao:estado', this.sessaoAtiva);
        }
        this.server.emit('espectadores', this.espectadores);
    }

    handleDisconnect() {
        this.espectadores = Math.max(0, this.espectadores - 1);
        this.server.emit('espectadores', this.espectadores);
    }

    @SubscribeMessage('sessao:iniciar')
    handleIniciarSessao(@MessageBody() data: { id: string; tipo: string }) {
        this.sessaoAtiva = {
            id: data.id,
            status: 'EM_ANDAMENTO',
            tipo: data.tipo,
            itemAtual: 'Abertura',
            iniciadaEm: new Date().toISOString(),
            presentes: [],
            votos: {},
        };
        this.server.emit('sessao:estado', this.sessaoAtiva);
        return { success: true, sessaoId: data.id };
    }

    @SubscribeMessage('sessao:presenca')
    handlePresenca(@MessageBody() data: { vereadorId: string; nome: string }) {
        if (this.sessaoAtiva && !this.sessaoAtiva.presentes.includes(data.nome)) {
            this.sessaoAtiva.presentes.push(data.nome);
            this.server.emit('sessao:presenca-atualizada', {
                presentes: this.sessaoAtiva.presentes,
                total: this.sessaoAtiva.presentes.length,
            });
        }
        return { success: true };
    }

    @SubscribeMessage('sessao:item-pauta')
    handleItemPauta(@MessageBody() data: { item: string; numero: number }) {
        if (this.sessaoAtiva) {
            this.sessaoAtiva.itemAtual = data.item;
            this.sessaoAtiva.votos = {};
            this.server.emit('sessao:item-mudou', { item: data.item, numero: data.numero });
        }
        return { success: true };
    }

    @SubscribeMessage('sessao:voto')
    handleVoto(@MessageBody() data: { vereadorId: string; nome: string; voto: 'SIM' | 'NAO' | 'ABSTENCAO' }) {
        if (this.sessaoAtiva) {
            this.sessaoAtiva.votos[data.vereadorId] = { vereador: data.nome, voto: data.voto };
            const votos = Object.values(this.sessaoAtiva.votos);
            const sim = votos.filter(v => v.voto === 'SIM').length;
            const nao = votos.filter(v => v.voto === 'NAO').length;
            const abstencao = votos.filter(v => v.voto === 'ABSTENCAO').length;

            this.server.emit('sessao:voto-registrado', {
                vereador: data.nome,
                voto: data.voto,
                placar: { sim, nao, abstencao, total: votos.length },
            });
        }
        return { success: true };
    }

    @SubscribeMessage('sessao:resultado-votacao')
    handleResultado(@MessageBody() data: { itemId: string }) {
        if (this.sessaoAtiva) {
            const votos = Object.values(this.sessaoAtiva.votos);
            const sim = votos.filter(v => v.voto === 'SIM').length;
            const nao = votos.filter(v => v.voto === 'NAO').length;
            const resultado = sim > nao ? 'APROVADO' : 'REJEITADO';

            this.server.emit('sessao:resultado', {
                itemId: data.itemId,
                item: this.sessaoAtiva.itemAtual,
                resultado,
                placar: { sim, nao, abstencao: votos.filter(v => v.voto === 'ABSTENCAO').length },
            });
        }
        return { success: true };
    }

    @SubscribeMessage('sessao:encerrar')
    handleEncerrar() {
        const sessaoEncerrada = { ...this.sessaoAtiva, status: 'ENCERRADA', encerradaEm: new Date().toISOString() };
        this.sessaoAtiva = null;
        this.server.emit('sessao:encerrada', sessaoEncerrada);
        return { success: true };
    }

    @SubscribeMessage('sessao:orador')
    handleOrador(@MessageBody() data: { vereadorId: string; nome: string; tipo: string; assunto: string }) {
        this.server.emit('sessao:orador-ativo', {
            ...data,
            inicioEm: new Date().toISOString(),
        });
        return { success: true };
    }
}
