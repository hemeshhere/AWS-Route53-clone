from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Base properties shared across multiple schemas
class HostedZoneBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: str = "Public hosted zone"
    private_zone: bool = False

# Schema for POST request body (creating a zone)
class HostedZoneCreate(HostedZoneBase):
    pass

# Schema for PUT request body (updating a zone)
# In Route53, you can typically only update the description/comment of a zone once created
class HostedZoneUpdate(BaseModel):
    description: Optional[str] = None

# Schema for outgoing response (what we send back to Next.js)
class HostedZoneResponse(HostedZoneBase):
    id: int
    zone_id: str
    created_at: datetime
    updated_at: datetime
    
    # We will compute this on the fly later, but default to 0 for now
    record_count: int = 0

    class Config:
        from_attributes = True # Allows Pydantic to read directly from SQLAlchemy models