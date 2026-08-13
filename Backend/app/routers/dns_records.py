from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import DNSRecord, HostedZone, User
from ..schemas.dns_record import DNSRecordCreate, DNSRecordResponse
from ..dependencies.auth import get_current_user

router = APIRouter()

@router.post("/{zone_id}/records", response_model=DNSRecordResponse)
def create_dns_record(
    zone_id: int,
    record: DNSRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    zone = db.query(HostedZone).filter(HostedZone.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    
    db_record = DNSRecord(
        hosted_zone_id=zone_id,
        name=record.name,
        type=record.type,
        ttl=record.ttl,
        value=record.value,
        routing_policy=record.routing_policy,
        priority=record.priority
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@router.get("/{zone_id}/records", response_model=List[DNSRecordResponse])
def get_dns_records(
    zone_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    zone = db.query(HostedZone).filter(HostedZone.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    
    records = db.query(DNSRecord).filter(DNSRecord.hosted_zone_id == zone_id).all()
    return records

@router.delete("/{zone_id}/records/{record_id}")
def delete_dns_record(
    zone_id: int,
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(DNSRecord).filter(DNSRecord.id == record_id, DNSRecord.hosted_zone_id == zone_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="DNS record not found")
    
    db.delete(record)
    db.commit()
    return {"message": "DNS record deleted successfully"}