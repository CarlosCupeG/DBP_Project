from sqlalchemy import Column, Integer, String, Sequence, DateTime, ForeignKey, ARRAY
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declarative_base
from web.database import connector


class Document(connector.Manager.Base):
    __tablename__ = 'document'
    id = Column(Integer, Sequence('document_id_seq'), primary_key=True)
    name = Column(String(100))
    status = Column(Integer)
    content = Column(String(10000))


class User(connector.Manager.Base):
    __tablename__ = 'users'
    id = Column(Integer, Sequence('user_id_seq'), primary_key=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(50))
    password = Column(String(12))
    username = Column(String(12))
    status = Column(String(12))
    document_id = Column(Integer, ForeignKey('document.id'))
    document = relationship(Document, backref=backref('user', uselist=True))
