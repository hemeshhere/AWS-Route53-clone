from pydantic import BaseModel

# This validates the incoming request body for the login route
class LoginRequest(BaseModel):
    email: str
    password: str

# This defines what user data we are allowed to send back to the frontend
class UserResponse(BaseModel):
    id: int
    email: str
    name: str

    class Config:
        from_attributes = True  # Tells Pydantic to read SQLAlchemy database models directly