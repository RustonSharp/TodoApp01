from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Any

class TodoBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Task title")

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    completed: Optional[bool] = None

class TodoResponse(TodoBase):
    id: int
    completed: bool
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}

class ApiResponse(BaseModel):
    code: int
    message: str
    data: Optional[Any] = None

class ErrorResponse(BaseModel):
    code: int
    message: str
    detail: Optional[str] = None