from sqlalchemy import Column, Integer, String, Sequence, DateTime, ForeignKey, ARRAY
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declarative_base
from web.database import connector

import datetime


class DocumentUser(connector.Manager.Base):
    __tablename__ = 'document_user'
    document_id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    user_id = Column(Integer, ForeignKey('document.id'), primary_key=True)


class DocumentChange(connector.Manager.Base):
    __tablename__ = 'document_change'
    document_id = Column(Integer, ForeignKey('change.id'), primary_key=True)
    change_id = Column(Integer, ForeignKey('document.id'), primary_key=True)


class Change(connector.Manager.Base):
    __tablename__ = 'change'
    id = Column(Integer, Sequence('change_id_seq'), primary_key=True)
    user = Column(Integer)
    val = Column(String(12))
    event = Column(String(12))
    documents = relationship('Document', secondary='document_change')


class User(connector.Manager.Base):
    __tablename__ = 'user'
    id = Column(Integer, Sequence('user_id_seq'), primary_key=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(50))
    password = Column(String(12))
    username = Column(String(12))
    status = Column(String(12))
    documents = relationship('Document', secondary='document_user')


class Document(connector.Manager.Base):
    __tablename__ = 'document'
    id = Column(Integer, Sequence('document_id_seq'), primary_key=True)
    name = Column(String(100))
    date = Column(String, default=datetime.datetime.utcnow)
    content = Column(String(100000))
    users = relationship('User', secondary='document_user')
    changes = relationship('Change', secondary='document_change')


