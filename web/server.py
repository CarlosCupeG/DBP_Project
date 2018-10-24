from flask import Flask,render_template, request, session, redirect, Markup, Response

from web.database import connector
from web.model import entities

import json

db = connector.Manager()
engine = db.createEngine()

app = Flask(__name__)
app.secret_key = 'Legends never die'


@app.route('/')
def index():
    try:
        if session['logged_user_id']:
            return render_template('game.html')
    except KeyError:
        pass
    return render_template('index.html')


@app.route('/login', methods=['GET'])
def login():
    if 'logged_user_id' in session:
        redirect('/')

    return render_template('login.html')


@app.route('/create_server', methods=['POST'])
def create_server():
    server = entities.Server()

    session = db.getSession()
    session.add(server)
    session.commit()


@app.route('/get_server/<id>', methods=['GET'])
def get_server(id):
    db_session = db.getSession(engine)
    servers = db_session.query(entities.Server).filter(entities.Server.id == id)


@app.route('/get_server/<id>', methods=['PUT'])
def update_server(id):
    db_session = db.getSession(engine)
    servers = db_session.query(entities.Server).filter(entities.Server.id == id)

    info = request.form['status'] + "," + request.form['x'] + "," + request.form['y']

    for server in servers:
        if server.p1_id == id:
            server.p1_info = info
        elif server.p2_id == id:
            server.p2_info = info
        elif server.p3_id == id:
            server.p3_info = info
        elif server.p4_id == id:
            server.p4_info = info


if __name__ == '__main__':
    # app.run(port=8080, threaded=True, host=('localhost'))       # Windows
    app.run(port=8080, threaded=True, host='0.0.0.0')       # Linux