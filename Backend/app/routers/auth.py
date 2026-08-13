from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
import secrets
from datetime import datetime, timedelta, timezone

from ..database import get_db
from ..models import User, Session as DBSession
from ..schemas.auth import LoginRequest

# This is equivalent to const router = express.Router()
router = APIRouter()

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # 1. Find the user
    user = db.query(User).filter(User.email == req.email).first()
    
    # 2. Check credentials (we are using simple mocked passwords here)
    if not user or user.password_hash != req.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # 3. Generate a random 64-character token
    token = secrets.token_hex(32)
    expires = datetime.now(timezone.utc) + timedelta(days=7) # Token valid for 7 days
    
    # 4. Save session to database
    db_session = DBSession(user_id=user.id, token=token, expires_at=expires)
    db.add(db_session)
    db.commit()
    
    # 5. Return token to the frontend
    return {
        "token": token, 
        "user": {"id": user.id, "email": user.email, "name": user.name}
    }

@router.post("/logout")
def logout(authorization: str = Header(None), db: Session = Depends(get_db)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        # Delete the session from the database
        db.query(DBSession).filter(DBSession.token == token).delete()
        db.commit()
    
    return {"message": "Logged out successfully"}