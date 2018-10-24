from sqlalchemy import Column, Integer, String, Sequence, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from web.database import connector


class User(connector.Manager.Base):
    __tablename__ = 'users'
    id = Column(Integer, Sequence('user_id_seq'), primary_key=True)
    name = Column(String(50))
    fullname = Column(String(50))
    password = Column(String(12))
    username = Column(String(12))


class Server(connector.Manager.Base):
    __tablename__ = 'servers'
    id = Column(Integer, Sequence('server_id_seq'), primary_key=True)
    status = Column(String(12))

    p1_id = Column(Integer)
    p1_info = Column(String(20))

    p2_id = Column(Integer)
    p2_info = Column(String(20))

    p3_id = Column(Integer)
    p3_info = Column(String(20))

    p4_id = Column(Integer)
    p4_info = Column(String(20))


class Message(connector.Manager.Base):
    __tablename__ = 'messages'
    id = Column(Integer, Sequence('message_id_seq'), primary_key=True)
    content = Column(String(500))
    sent_on = Column(DateTime(timezone=True))
    user_from_id = Column(Integer, ForeignKey('users.id'))
    user_to_id = Column(Integer, ForeignKey('users.id'))
    user_from = relationship(User, foreign_keys=[user_from_id])
    user_to = relationship(User, foreign_keys=[user_to_id])
