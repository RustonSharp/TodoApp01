import pytest
from fastapi.testclient import TestClient

def test_root_endpoint(client: TestClient):
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data

def test_health_check(client: TestClient):
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_get_empty_todos(client: TestClient):
    """Test getting empty todo list"""
    response = client.get("/api/v1/todos")
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 200
    assert data["message"] == "success"
    assert data["data"] == []

def test_create_todo(client: TestClient):
    """Test creating a todo"""
    todo_data = {"title": "Test Todo"}
    response = client.post("/api/v1/todos", json=todo_data)
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 201
    assert data["message"] == "Todo created successfully"
    assert data["data"]["title"] == "Test Todo"
    assert data["data"]["completed"] == False
    assert "id" in data["data"]
    assert "created_at" in data["data"]
    assert "updated_at" in data["data"]

def test_create_todo_invalid_title(client: TestClient):
    """Test creating a todo with invalid title"""
    todo_data = {"title": ""}
    response = client.post("/api/v1/todos", json=todo_data)
    assert response.status_code == 422

def test_get_todos_after_creation(client: TestClient):
    """Test getting todo list after creation"""
    # Create a todo
    todo_data = {"title": "Test Todo"}
    client.post("/api/v1/todos", json=todo_data)
    
    # Get list
    response = client.get("/api/v1/todos")
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 200
    assert len(data["data"]) == 1
    assert data["data"][0]["title"] == "Test Todo"

def test_update_todo(client: TestClient):
    """Test updating a todo"""
    # Create a todo
    todo_data = {"title": "Test Todo"}
    create_response = client.post("/api/v1/todos", json=todo_data)
    todo_id = create_response.json()["data"]["id"]
    
    # Update todo
    update_data = {"title": "Updated Todo", "completed": True}
    response = client.put(f"/api/v1/todos/{todo_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 200
    assert data["message"] == "Todo updated successfully"
    assert data["data"]["title"] == "Updated Todo"
    assert data["data"]["completed"] == True

def test_update_nonexistent_todo(client: TestClient):
    """Test updating a non-existent todo"""
    update_data = {"title": "Updated Todo"}
    response = client.put("/api/v1/todos/999", json=update_data)
    assert response.status_code == 404

def test_delete_todo(client: TestClient):
    """Test deleting a todo"""
    # Create a todo
    todo_data = {"title": "Test Todo"}
    create_response = client.post("/api/v1/todos", json=todo_data)
    todo_id = create_response.json()["data"]["id"]
    
    # Delete todo
    response = client.delete(f"/api/v1/todos/{todo_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 200
    assert data["message"] == "Todo deleted successfully"
    
    # Verify deletion
    get_response = client.get("/api/v1/todos")
    assert len(get_response.json()["data"]) == 0

def test_delete_nonexistent_todo(client: TestClient):
    """Test deleting a non-existent todo"""
    response = client.delete("/api/v1/todos/999")
    assert response.status_code == 404

def test_filter_todos_by_status(client: TestClient):
    """Test filtering todos by status"""
    # Create multiple todos
    client.post("/api/v1/todos", json={"title": "Todo 1"})
    create_response = client.post("/api/v1/todos", json={"title": "Todo 2"})
    todo_id = create_response.json()["data"]["id"]
    
    # Mark one as completed
    client.put(f"/api/v1/todos/{todo_id}", json={"completed": True})
    
    # Test filter all
    response = client.get("/api/v1/todos?status=all")
    assert len(response.json()["data"]) == 2
    
    # Test filter completed
    response = client.get("/api/v1/todos?status=completed")
    assert len(response.json()["data"]) == 1
    assert response.json()["data"][0]["completed"] == True
    
    # Test filter pending
    response = client.get("/api/v1/todos?status=pending")
    assert len(response.json()["data"]) == 1
    assert response.json()["data"][0]["completed"] == False

def test_delete_completed_todos(client: TestClient):
    """Test deleting completed todos"""
    # Create multiple todos
    client.post("/api/v1/todos", json={"title": "Todo 1"})
    create_response = client.post("/api/v1/todos", json={"title": "Todo 2"})
    todo_id = create_response.json()["data"]["id"]
    
    # Mark one as completed
    client.put(f"/api/v1/todos/{todo_id}", json={"completed": True})
    
    # Delete completed todos
    response = client.delete("/api/v1/todos/completed")
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 200
    assert data["data"]["deleted_count"] == 1
    
    # Verify only pending todos remain
    get_response = client.get("/api/v1/todos")
    remaining_todos = get_response.json()["data"]
    assert len(remaining_todos) == 1
    assert remaining_todos[0]["completed"] == False

def test_delete_all_todos(client: TestClient):
    """Test deleting all todos"""
    # Create multiple todos
    client.post("/api/v1/todos", json={"title": "Todo 1"})
    client.post("/api/v1/todos", json={"title": "Todo 2"})
    
    # Delete all todos
    response = client.delete("/api/v1/todos/all")
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 200
    assert data["data"]["deleted_count"] == 2
    
    # Verify list is empty
    get_response = client.get("/api/v1/todos")
    assert len(get_response.json()["data"]) == 0