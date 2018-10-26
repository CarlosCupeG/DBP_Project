from sqlalchemy import Column, Integer, String, Sequence, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from web.database import connector


class User(connector.Manager.Base):
    __tablename__ = 'users'
    id = Column(Integer, Sequence('user_id_seq'), primary_key=True)
    name = Column(String(50))
    lastname = Column(String(50))
    email = Column(String(50))
    password = Column(String(12))
    username = Column(String(12))
    status = Column(String(12))
    count = Column(Integer)
    pos_x = Column(Integer)
    pos_y = Column(Integer)


class Server(connector.Manager.Base):
    __tablename__ = 'servers'
    id = Column(Integer, Sequence('server_id_seq'), primary_key=True)
    status = Column(String(12))

    player_1_id = Column(Integer, ForeignKey('users.id'))
    player_1 = relationship(User, foreign_keys=[player_1_id])

    player_2_id = Column(Integer, ForeignKey('users.id'))
    player_2 = relationship(User, foreign_keys=[player_2_id])

    player_3_id = Column(Integer, ForeignKey('users.id'))
    player_3 = relationship(User, foreign_keys=[player_3_id])

    player_4_id = Column(Integer, ForeignKey('users.id'))
    player_4 = relationship(User, foreign_keys=[player_4_id])


class Message(connector.Manager.Base):
    __tablename__ = 'messages'
    id = Column(Integer, Sequence('message_id_seq'), primary_key=True)
    content = Column(String(500))
    sent_on = Column(DateTime(timezone=True))
    user_from_id = Column(Integer, ForeignKey('users.id'))
    user_to_id = Column(Integer, ForeignKey('users.id'))
    user_from = relationship(User, foreign_keys=[user_from_id])
    user_to = relationship(User, foreign_keys=[user_to_id])
