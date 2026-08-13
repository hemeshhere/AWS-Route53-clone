from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from ..database import get_db
from ..models import Session as DBSession

# This tells FastAPI we are using standard Bearer tokens.
# It automatically adds the green "Authorize" padlock button to Swagger UI!
token_auth_scheme = HTTPBearer()

def get_current_user(
    token_data: HTTPAuthorizationCredentials = Depends(token_auth_scheme), 
    db: Session = Depends(get_db)
):
    # token_data.credentials automatically strips the "Bearer " part for us!
    token = token_data.credentials
    
    # Find session in database
    session = db.query(DBSession).filter(DBSession.token == token).first()
    
    if not session:
        raise HTTPException(status_code=401, detail="Session not found or invalid")
        
    # Check if session is expired
    now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
    expire_utc = session.expires_at.replace(tzinfo=None)
    
    if expire_utc < now_utc:
        # Delete expired session
        db.delete(session)
        db.commit()
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
        
    return session.user