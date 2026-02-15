from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from core.PackageManager import PackageManager

router = APIRouter(prefix="/system/packages", tags=["Package Management"])

class PackageCheckRequest(BaseModel):
    packages: List[str]

class PackageInstallRequest(BaseModel):
    packages: List[str]

@router.post("/check")
async def check_packages(req: PackageCheckRequest):
    """
    Checks if the requested packages are installed.
    Returns: {"pkg_name": true/false}
    """
    if not req.packages:
        return {"status": "ok", "missing": []}
    
    status = PackageManager.check_packages(req.packages)
    missing = [pkg for pkg, installed in status.items() if not installed]
    
    return {
        "status": "ok" if not missing else "missing_packages",
        "details": status,
        "missing": missing
    }

@router.post("/install")
async def install_packages(req: PackageInstallRequest):
    """
    Installs requested packages and restarts the server.
    """
    if not req.packages:
        return {"status": "ok", "message": "No packages to install"}
    
    success = PackageManager.install_packages(req.packages)
    
    if success:
        # Trigger restart in background? Or just return success and let frontend poll?
        # Ideally, we return success then restart.
        import asyncio
        asyncio.create_task(restart_later())
        return {"status": "success", "message": "Packages installed. Server restarting..."}
    else:
        raise HTTPException(status_code=500, detail="Failed to install packages. Check logs.")

async def restart_later():
    import asyncio
    await asyncio.sleep(2)
    PackageManager.restart_server()
