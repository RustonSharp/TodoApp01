from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models import Todo
from app.schemas import TodoCreate, TodoUpdate
from typing import List, Optional

def get_todos(db: Session, status: Optional[str] = None) -> List[Todo]:
    query = db.query(Todo)
    
    if status == "completed":
        query = query.filter(Todo.completed == True)
    elif status == "pending":
        query = query.filter(Todo.completed == False)
    # Return all records when status == "all" or None
    
    return query.order_by(Todo.created_at.desc()).all()

def get_todo(db: Session, todo_id: int) -> Optional[Todo]:
    return db.query(Todo).filter(Todo.id == todo_id).first()

def create_todo(db: Session, todo: TodoCreate) -> Todo:
    db_todo = Todo(title=todo.title)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_todo(db: Session, todo_id: int, todo_update: TodoUpdate) -> Todo:
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    
    update_data = todo_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)
    
    db.commit()
    db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, todo_id: int) -> bool:
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo:
        db.delete(db_todo)
        db.commit()
        return True
    return False

def delete_completed_todos(db: Session) -> int:
    deleted_count = db.query(Todo).filter(Todo.completed == True).count()
    db.query(Todo).filter(Todo.completed == True).delete()
    db.commit()
    return deleted_count

def delete_all_todos(db: Session) -> int:
    deleted_count = db.query(Todo).count()
    db.query(Todo).delete()
    db.commit()
    return deleted_count