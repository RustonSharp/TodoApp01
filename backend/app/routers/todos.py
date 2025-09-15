from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import crud, schemas

router = APIRouter(tags=["todos"])

@router.get("/todos", response_model=schemas.ApiResponse)
async def get_todos(
    status: Optional[str] = Query(None, regex="^(all|completed|pending)$"),
    db: Session = Depends(get_db)
):
    try:
        todos = crud.get_todos(db, status=status)
        return schemas.ApiResponse(
            code=200,
            message="success",
            data=[schemas.TodoResponse.model_validate(todo) for todo in todos]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/todos", response_model=schemas.ApiResponse)
async def create_todo(
    todo: schemas.TodoCreate,
    db: Session = Depends(get_db)
):
    try:
        db_todo = crud.create_todo(db, todo)
        return schemas.ApiResponse(
            code=201,
            message="Todo created successfully",
            data=schemas.TodoResponse.model_validate(db_todo)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/todos/{todo_id}", response_model=schemas.ApiResponse)
async def update_todo(
    todo_id: int,
    todo_update: schemas.TodoUpdate,
    db: Session = Depends(get_db)
):
    try:
        db_todo = crud.get_todo(db, todo_id)
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        
        updated_todo = crud.update_todo(db, todo_id, todo_update)
        return schemas.ApiResponse(
            code=200,
            message="Todo updated successfully",
            data=schemas.TodoResponse.model_validate(updated_todo)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/todos/completed", response_model=schemas.ApiResponse)
async def delete_completed_todos(db: Session = Depends(get_db)):
    try:
        deleted_count = crud.delete_completed_todos(db)
        return schemas.ApiResponse(
            code=200,
            message="Completed todos deleted successfully",
            data={"deleted_count": deleted_count}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/todos/all", response_model=schemas.ApiResponse)
async def delete_all_todos(db: Session = Depends(get_db)):
    try:
        deleted_count = crud.delete_all_todos(db)
        return schemas.ApiResponse(
            code=200,
            message="All todos deleted successfully",
            data={"deleted_count": deleted_count}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/todos/{todo_id}", response_model=schemas.ApiResponse)
async def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db)
):
    try:
        todo = crud.get_todo(db, todo_id)
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        
        crud.delete_todo(db, todo_id)
        return schemas.ApiResponse(
            code=200,
            message="Todo deleted successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))