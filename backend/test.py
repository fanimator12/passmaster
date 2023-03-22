from fastapi.testclient import TestClient
from main import app
from passmaster import Crypto

client = TestClient(app)
crypto = Crypto()

password_data = {
    "website": "gmail.com",
    "email": "test@gmail.com",
    "username": "test_user",
    "password": "test_password"
}

def test_save_password():
    response = client.post("/passmaster/save_password", json=password_data)
    assert response.status_code == 200

    response_json = response.json()
    assert response_json["website"] == password_data["website"]
    assert response_json["email"] == password_data["email"]
    assert response_json["username"] == password_data["username"]

    # Ensure the password is encrypted
    encrypted_password = response_json["encrypted_password"]
    assert encrypted_password != password_data["password"]

def test_get_password():
    response = client.post("/passmaster/save_password", json=password_data)
    assert response.status_code == 200
    
    website = password_data["website"]
    response = client.get(f"/passmaster/get_password?website={website}")
    assert response.status_code == 200

    response_json = response.json()
    assert response_json["website"] == website

    # Ensure the password is decrypted
    decrypted_password = crypto.decrypt(response_json["encrypted_password"])
    assert decrypted_password == "test_password"