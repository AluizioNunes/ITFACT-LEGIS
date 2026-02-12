"""
Storage (MinIO) + Cache (Redis) endpoints.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Optional
from datetime import datetime
from core.Configuracao import MINIO_BUCKET
from core import BancoDados

router = APIRouter(tags=["Storage & Cache"])


@router.post("/storage/upload")
async def upload_to_minio(file: UploadFile = File(...)):
    """Upload file to MinIO"""
    try:
        contents = await file.read()
        object_name = f"{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{file.filename}"

        BancoDados.minio_client.put_object(
            MINIO_BUCKET,
            object_name,
            data=contents,
            length=len(contents),
            content_type=file.content_type,
        )
        return {
            "bucket": MINIO_BUCKET,
            "object_name": object_name,
            "size": len(contents),
            "content_type": file.content_type,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/cache/get/{key}")
async def get_from_cache(key: str):
    """Get value from Redis cache"""
    try:
        value = await BancoDados.redis_client.get(key)
        return {"key": key, "value": value}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/cache/set")
async def set_in_cache(key: str, value: str, ttl: Optional[int] = None):
    """Set value in Redis cache"""
    try:
        if ttl:
            await BancoDados.redis_client.setex(key, ttl, value)
        else:
            await BancoDados.redis_client.set(key, value)
        return {"key": key, "value": value, "ttl": ttl}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
