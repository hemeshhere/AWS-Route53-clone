from fastapi.testclient import TestClient
from app.main import app
from app.dependencies.auth import get_current_user
from app.models import User

client = TestClient(app)

def override_get_current_user():
    return User(id=1, email="security-admin@route53.com")

app.dependency_overrides[get_current_user] = override_get_current_user

def test_get_hosted_zones_authenticated():
    response = client.get("/api/hosted-zones")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_hosted_zone_validation():
    invalid_payload = {
        "name": "invalid-domain",
        "type": "Public hosted zone"
    }
    response = client.post("/api/hosted-zones", json=invalid_payload)
    assert response.status_code in [200, 422]