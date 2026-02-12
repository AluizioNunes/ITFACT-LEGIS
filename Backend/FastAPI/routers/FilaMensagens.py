"""
RabbitMQ queue integration — async document indexing (#7).
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import json

router = APIRouter(prefix="/queue", tags=["RabbitMQ Queues"])

_connection = None
_channel = None

QUEUE_SEMANTIC_INDEX = "semantic.index"
QUEUE_GRAPHITI_INDEX = "graphiti.index"


async def get_channel():
    """Lazy-init RabbitMQ connection"""
    global _connection, _channel
    if _channel is None or _channel.is_closed:
        try:
            import aio_pika
            from core.Configuracao import RABBITMQ_URL
            _connection = await aio_pika.connect_robust(RABBITMQ_URL)
            _channel = await _connection.channel()
            await _channel.declare_queue(QUEUE_SEMANTIC_INDEX, durable=True)
            await _channel.declare_queue(QUEUE_GRAPHITI_INDEX, durable=True)
            print("INFO: RabbitMQ connected - queues declared")
        except Exception as e:
            print(f"INFO: RabbitMQ unavailable: {e}")
            return None
    return _channel


class IndexJobRequest(BaseModel):
    documento_id: str
    documento_tipo: str
    origem: str
    titulo: str
    conteudo: str
    metadata: Optional[dict] = {}


@router.post("/enqueue/semantic-index")
async def enqueue_semantic_index(request: IndexJobRequest):
    """
    Enfileira um documento para indexação semântica assíncrona.
    Usado pelo NestJS ao criar minutas/proposituras para não bloquear a resposta.
    """
    channel = await get_channel()
    if not channel:
        raise HTTPException(status_code=503, detail="RabbitMQ indisponível")

    try:
        import aio_pika
        message = aio_pika.Message(
            body=json.dumps(request.dict()).encode(),
            delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
        )
        await channel.default_exchange.publish(message, routing_key=QUEUE_SEMANTIC_INDEX)
        return {"status": "enqueued", "queue": QUEUE_SEMANTIC_INDEX, "documento_id": request.documento_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/enqueue/graphiti-index")
async def enqueue_graphiti_index(request: IndexJobRequest):
    """Enfileira um documento para indexação no Knowledge Graph."""
    channel = await get_channel()
    if not channel:
        raise HTTPException(status_code=503, detail="RabbitMQ indisponível")

    try:
        import aio_pika
        message = aio_pika.Message(
            body=json.dumps(request.dict()).encode(),
            delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
        )
        await channel.default_exchange.publish(message, routing_key=QUEUE_GRAPHITI_INDEX)
        return {"status": "enqueued", "queue": QUEUE_GRAPHITI_INDEX, "documento_id": request.documento_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats")
async def queue_stats():
    """Status das filas RabbitMQ"""
    channel = await get_channel()
    if not channel:
        return {"status": "disconnected", "error": "RabbitMQ unavailable"}

    try:
        import aio_pika
        semantic_q = await channel.declare_queue(QUEUE_SEMANTIC_INDEX, durable=True, passive=True)
        graphiti_q = await channel.declare_queue(QUEUE_GRAPHITI_INDEX, durable=True, passive=True)
        return {
            "status": "connected",
            "queues": {
                QUEUE_SEMANTIC_INDEX: {"messages": semantic_q.declaration_result.message_count},
                QUEUE_GRAPHITI_INDEX: {"messages": graphiti_q.declaration_result.message_count},
            }
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}
