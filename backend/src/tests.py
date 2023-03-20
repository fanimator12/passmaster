from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

key = "fWAdafxVLN9Cx62Z69sz"
site = "gmail.com"
encrypted_pwd = "ALrngIozKrauwcbJo+vm3haxSl1xsa8dujoJCJ0Wqb0="

def test_create_pass_manager():
    response = client.post(
        "/passmaster",
        json={
            "key": key,
            "pwd_dict": {site: encrypted_pwd}
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["key"] == key
    assert data["pwd_dict"] == {site: encrypted_pwd}

def test_get_pass_manager():
    # Create a Password Manager
    response = client.post(
        "/passmaster",
        json={
            "key": key,
            "pwd_dict": {site: encrypted_pwd}
        },
    )
    assert response.status_code == 201
    created_pass_manager = response.json()

    # Get the Password Manager by ID
    response = client.get(f"/passmaster/{created_pass_manager['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == created_pass_manager["id"]
    assert data["key"] ==  key
    assert data["pwd_dict"] == {site: encrypted_pwd}