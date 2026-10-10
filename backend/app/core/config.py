from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "Scenia API"
    ENV: str = "development"
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    DATABASE_URL: str = "sqlite:///./scenia.db"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
