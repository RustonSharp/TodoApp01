import pytest
from fastapi.testclient import TestClient

def test_root_endpoint(client: TestClient):
    """测试根端点"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data

def test_health_check(client: TestClient):
    """测试健康检查端点"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_get_empty_todos(client: TestClient):
    """测试获取空的待办事项列表"""
    response = client.get("/api/v1/todos")
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 200
    assert data["message"] == "success"
    assert data["data"] == []

def test_create_todo(client: TestClient):
    """测试创建待办事项"""
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
    """测试创建无效标题的待办事项"""
    todo_data = {"title": ""}
    response = client.post("/api/v1/todos", json=todo_data)
    assert response.status_code == 422

def test_get_todos_after_creation(client: TestClient):
    """测试创建后获取待办事项列表"""
    # 创建一个待办事项
    todo_data = {"title": "Test Todo"}
    client.post("/api/v1/todos", json=todo_data)
    
    # 获取列表
    response = client.get("/api/v1/todos")
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 200
    assert len(data["data"]) == 1
    assert data["data"][0]["title"] == "Test Todo"

def test_update_todo(client: TestClient):
    """测试更新待办事项"""
    # 创建一个待办事项
    todo_data = {"title": "Test Todo"}
    create_response = client.post("/api/v1/todos", json=todo_data)
    todo_id = create_response.json()["data"]["id"]
    
    # 更新待办事项
    update_data = {"title": "Updated Todo", "completed": True}
    response = client.put(f"/api/v1/todos/{todo_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 200
    assert data["message"] == "Todo updated successfully"
    assert data["data"]["title"] == "Updated Todo"
    assert data["data"]["completed"] == True

def test_update_nonexistent_todo(client: TestClient):
    """测试更新不存在的待办事项"""
    update_data = {"title": "Updated Todo"}
    response = client.put("/api/v1/todos/999", json=update_data)
    assert response.status_code == 404

def test_delete_todo(client: TestClient):
    """测试删除待办事项"""
    # 创建一个待办事项
    todo_data = {"title": "Test Todo"}
    create_response = client.post("/api/v1/todos", json=todo_data)
    todo_id = create_response.json()["data"]["id"]
    
    # 删除待办事项
    response = client.delete(f"/api/v1/todos/{todo_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 200
    assert data["message"] == "Todo deleted successfully"
    
    # 验证已删除
    get_response = client.get("/api/v1/todos")
    assert len(get_response.json()["data"]) == 0

def test_delete_nonexistent_todo(client: TestClient):
    """测试删除不存在的待办事项"""
    response = client.delete("/api/v1/todos/999")
    assert response.status_code == 404

def test_filter_todos_by_status(client: TestClient):
    """测试按状态筛选待办事项"""
    # 创建多个待办事项
    client.post("/api/v1/todos", json={"title": "Todo 1"})
    create_response = client.post("/api/v1/todos", json={"title": "Todo 2"})
    todo_id = create_response.json()["data"]["id"]
    
    # 标记一个为完成
    client.put(f"/api/v1/todos/{todo_id}", json={"completed": True})
    
    # 测试筛选所有
    response = client.get("/api/v1/todos?status=all")
    assert len(response.json()["data"]) == 2
    
    # 测试筛选已完成
    response = client.get("/api/v1/todos?status=completed")
    assert len(response.json()["data"]) == 1
    assert response.json()["data"][0]["completed"] == True
    
    # 测试筛选未完成
    response = client.get("/api/v1/todos?status=pending")
    assert len(response.json()["data"]) == 1
    assert response.json()["data"][0]["completed"] == False

def test_delete_completed_todos(client: TestClient):
    """测试删除已完成的待办事项"""
    # 创建多个待办事项
    client.post("/api/v1/todos", json={"title": "Todo 1"})
    create_response = client.post("/api/v1/todos", json={"title": "Todo 2"})
    todo_id = create_response.json()["data"]["id"]
    
    # 标记一个为完成
    client.put(f"/api/v1/todos/{todo_id}", json={"completed": True})
    
    # 删除已完成的待办事项
    response = client.delete("/api/v1/todos/completed")
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 200
    assert data["data"]["deleted_count"] == 1
    
    # 验证只剩下未完成的
    get_response = client.get("/api/v1/todos")
    remaining_todos = get_response.json()["data"]
    assert len(remaining_todos) == 1
    assert remaining_todos[0]["completed"] == False

def test_delete_all_todos(client: TestClient):
    """测试删除所有待办事项"""
    # 创建多个待办事项
    client.post("/api/v1/todos", json={"title": "Todo 1"})
    client.post("/api/v1/todos", json={"title": "Todo 2"})
    
    # 删除所有待办事项
    response = client.delete("/api/v1/todos/all")
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 200
    assert data["data"]["deleted_count"] == 2
    
    # 验证列表为空
    get_response = client.get("/api/v1/todos")
    assert len(get_response.json()["data"]) == 0