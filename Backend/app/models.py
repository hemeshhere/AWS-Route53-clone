from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship back to Sessions
    sessions = relationship("Session", back_populates="user")

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship back to User
    user = relationship("User", back_populates="sessions")

class HostedZone(Base):
    __tablename__ = "hosted_zones"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False) # e.g., example.com
    zone_id = Column(String, unique=True, index=True, nullable=False) # e.g., Z123456789
    type = Column(String, nullable=False) # Public or Private
    description = Column(String)
    private_zone = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationship back to DNS Records
    records = relationship("DNSRecord", back_populates="hosted_zone", cascade="all, delete-orphan")

class DNSRecord(Base):
    __tablename__ = "dns_records"

    id = Column(Integer, primary_key=True, index=True)
    hosted_zone_id = Column(Integer, ForeignKey("hosted_zones.id"), nullable=False)
    name = Column(String, nullable=False) # e.g., www.example.com
    type = Column(String, nullable=False) # e.g., A, TXT, CNAME
    ttl = Column(Integer, default=300)
    value = Column(String, nullable=False)
    routing_policy = Column(String, default="Simple")
    priority = Column(Integer, nullable=True) # Used for MX and SRV records
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationship back to Hosted Zone
    hosted_zone = relationship("HostedZone", back_populates="records")