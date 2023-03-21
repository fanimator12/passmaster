from fastapi.testclient import TestClient
from main import app
from uuid import UUID
import unittest

client = TestClient(app)

key = "fWAdafxVLN9Cx62Z69sz"
site = "gmail.com"
encrypted_pwd = "ALrngIozKrauwcbJo+vm3haxSl1xsa8dujoJCJ0Wqb0="

class TestPassMaster(unittest.TestCase):
    def test_create_pass_manager(self):
        response = client.post(
            "/passmaster",
            json={
                "key": key,
                "pwd_dict": {site: encrypted_pwd}
            },
        )
        print("Test create_pass_manager response:", response.status_code, response.content)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertIn("id", data)
        self.assertIsInstance(UUID(data["id"]), UUID.__class__)
        self.assertEqual(data["key"], key)
        self.assertEqual(data["pwd_dict"], {site: encrypted_pwd})

    def test_get_pass_manager(self):
        # Create a Password Manager
        response = client.post(
            "/passmaster",
            json={
                "key": key,
                "pwd_dict": {site: encrypted_pwd}
            },
        )
        print("Test get_pass_manager create response:", response.status_code, response.content)
        self.assertEqual(response.status_code, 201)
        created_pass_manager = response.json()

        # Get the Password Manager by ID
        response = client.get(f"/passmaster/{created_pass_manager['id']}")
        print("Test get_pass_manager get response:", response.status_code, response.content)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["id"], created_pass_manager["id"])
        self.assertEqual(data["key"], key)
        self.assertEqual(data["pwd_dict"], {site: encrypted_pwd})

if __name__ == "__main__":
    unittest.main()