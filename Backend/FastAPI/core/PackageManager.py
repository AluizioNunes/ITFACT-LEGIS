import subprocess
import sys
import os
import time
from typing import List, Dict

class PackageManager:
    """
    Manages Python package verification and installation at runtime.
    Use with caution in production environments.
    """

    @staticmethod
    def get_installed_packages() -> Dict[str, str]:
        """Returns a dict of installed packages and their versions."""
        try:
            # Using simple pip list parsing or importlib.metadata
            import importlib.metadata
            return {d.metadata["Name"].lower(): d.version for d in importlib.metadata.distributions()}
        except Exception as e:
            print(f"Error getting installed packages: {e}")
            return {}

    @staticmethod
    def check_packages(packages: List[str]) -> Dict[str, bool]:
        """Checks if listed packages are installed."""
        installed = PackageManager.get_installed_packages()
        status = {}
        for pkg in packages:
            pkg_name = pkg.split("==")[0].split(">=")[0].lower()
            status[pkg] = pkg_name in installed
        return status

    @staticmethod
    def install_packages(packages: List[str]) -> bool:
        """
        Installs packages via pip.
        Returns True if successful, False otherwise.
        """
        if not packages:
            return True
            
        print(f"INSTALL: Attempting to install {packages}...")
        try:
            # Determine pip executable
            pip_cmd = [sys.executable, "-m", "pip", "install"]
            
            # Add --no-cache-dir to save space in container
            pip_cmd.append("--no-cache-dir")
            
            # Append packages
            pip_cmd.extend(packages)
            
            # Run pip
            result = subprocess.run(pip_cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"INSTALL SUCCESS: {result.stdout}")
                return True
            else:
                print(f"INSTALL ERROR: {result.stderr}")
                return False
        except Exception as e:
            print(f"INSTALL EXCEPTION: {e}")
            return False

    @staticmethod
    def restart_server():
        """
        Triggers a server restart. 
        In Docker with WatchFiles/Uvicorn reload, touching a watched file works.
        Alternatively, sys.exit() relies on Docker restart policy (unless configured differently).
        Here we use the 'touch main.py' strategy to trigger uvicorn reload if available.
        """
        print("RESTART: Triggering server reload...")
        try:
            # Touch main.py to trigger reloader
            main_py = os.path.join(os.path.dirname(os.path.dirname(__file__)), "main.py")
            if os.path.exists(main_py):
                 os.utime(main_py, None)
                 print(f"RESTART: Touched {main_py}")
            else:
                # Fallback: Exit and let Docker/Supervisor restart
                print("RESTART: main.py not found, calling sys.exit(0)")
                sys.exit(0) 
        except Exception as e:
            print(f"RESTART ERROR: {e}")
