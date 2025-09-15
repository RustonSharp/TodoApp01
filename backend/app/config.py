from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    app_name: str = "Todo API"
    app_version: str = "1.0.0"
    database_url: str = "sqlite:///./database.db"
    cors_origins: List[str] = ["http://localhost:3000"]
    debug: bool = False
    
    class Config:
        env_file = ".env"

settings = Settings()