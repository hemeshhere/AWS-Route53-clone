from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DNSRecordBase(BaseModel):
    name: str
    type: str
    ttl: int = 300
    value: str
    routing_policy: str = "Simple"
    priority: Optional[int] = None

class DNSRecordCreate(DNSRecordBase):
    pass

class DNSRecordUpdate(BaseModel):
    ttl: Optional[int] = None
    value: Optional[str] = None
    routing_policy: Optional[str] = None
    priority: Optional[int] = None

class DNSRecordResponse(DNSRecordBase):
    id: int
    hosted_zone_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True