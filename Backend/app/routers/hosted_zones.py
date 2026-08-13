from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import uuid
from typing import List

from ..database import get_db
from ..models import HostedZone, User
from ..schemas.hosted_zone import HostedZoneCreate, HostedZoneUpdate, HostedZoneResponse
from ..dependencies.auth import get_current_user

router = APIRouter()

# CREATE: POST /api/hosted-zones
@router.post("/", response_model=HostedZoneResponse)
def create_hosted_zone(
    zone: HostedZoneCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # Protects the route
):
    # AWS Route53 Zone IDs usually look like Z0123456789ABCDEF. We mock that here.
    new_zone_id = "Z" + uuid.uuid4().hex[:14].upper()
    
    db_zone = HostedZone(
        name=zone.name,
        description=zone.description,
        type=zone.type,
        private_zone=zone.private_zone,
        zone_id=new_zone_id
    )
    db.add(db_zone)
    db.commit()
    db.refresh(db_zone) # Grabs the newly generated ID and timestamps from SQLite
    return db_zone

# READ ALL: GET /api/hosted-zones (Includes optional search query param)
@router.get("/", response_model=List[HostedZoneResponse])
def get_hosted_zones(
    search: str = Query(None, description="Search by domain name"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(HostedZone)
    
    if search:
        # SQL LIKE operator for partial string matching
        query = query.filter(HostedZone.name.ilike(f"%{search}%"))
        
    zones = query.all()
    
    # We will attach the record count manually for now
    for zone in zones:
        zone.record_count = len(zone.records) if zone.records else 0
        
    return zones

# READ ONE: GET /api/hosted-zones/{id}
@router.get("/{id}", response_model=HostedZoneResponse)
def get_hosted_zone(
    id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    zone = db.query(HostedZone).filter(HostedZone.id == id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    
    zone.record_count = len(zone.records) if zone.records else 0
    return zone

# UPDATE: PUT /api/hosted-zones/{id}
@router.put("/{id}", response_model=HostedZoneResponse)
def update_hosted_zone(
    id: int, 
    zone_update: HostedZoneUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_zone = db.query(HostedZone).filter(HostedZone.id == id).first()
    if not db_zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    
    if zone_update.description is not None:
        db_zone.description = zone_update.description
        
    db.commit()
    db.refresh(db_zone)
    db_zone.record_count = len(db_zone.records) if db_zone.records else 0
    return db_zone

# DELETE: DELETE /api/hosted-zones/{id}
@router.delete("/{id}")
def delete_hosted_zone(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_zone = db.query(HostedZone).filter(HostedZone.id == id).first()
    if not db_zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    
    db.delete(db_zone)
    db.commit()
    return {"message": "Hosted zone deleted successfully"}