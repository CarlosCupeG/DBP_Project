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


@app.route('/game', methods=['GET'])
def game():
    return render_template('game.html')


@app.route('/current_user', methods=['GET'])
def current_user():
    db_session = db.getSession(engine)
    user = db_session.query(entities.User).filter(entities.User.id == session['logged_user_id']).first()
    return Response(json.dumps(user, cls=connector.AlchemyEncoder), mimetype='application/json')


@app.route('/users', methods=['POST'])
def create_user():
    username = request.form['username']
    password = request.form['password']
    email = request.form['email']
    first_name = request.form['first_name']
    last_name = request.form['last_name']
    status = 'Offline'

    user = entities.User(first_name=first_name,
                         last_name=last_name,
                         username=username,
                         password=password,
                         email=email,
                         status=status)

    db_session = db.getSession(engine)
    db_session.add(user)
    db_session.commit()

    if username and password:
        return redirect('/')


@app.route('/users/<id>', methods=['GET'])
def get_users(id):
    db_session = db.getSession(engine)
    users = db_session.query(entities.User).filter(entities.User.id == id)

    data = []
    for user in users:
        data.append(user)
    return Response(json.dumps(data, cls=connector.AlchemyEncoder), mimetype="application/json")


@app.route('/users/<id>', methods=['PUT'])
def update_user(id):
    db_session = db.getSession(engine)
    users = db_session.query(entities.User).filter(entities.User.id == id)

    for user in users:
        if request.form['first_name']:
            user.first_name = request.form['first_name']
        if request.form['last_name']:
            user.last_name = request.form['last_name']
        if request.form['username']:
            user.username = request.form['username']
        if request.form['password']:
            user.password = request.form['password']
        if request.form['email']:
            user.email = request.form['email']
        if request.form['status']:
            user.status = request.form['status']
        db_session.add(user)

    db_session.commit()
    return 'SUCCESS'


@app.route('/users/<id>', methods=['DELETE'])
def delete_users(id):
    db_session = db.getSession(engine)
    user = db_session.query(entities.User).filter(entities.User.id == id).first()

    db_session.delete(user)
    db_session.commit()





@app.route('/server', methods=['POST'])
def create_server():

    info = request.get_json(silent=True)

    db_session = db.getSession(engine)

    admin = db_session.query(entities.User).filter(entities.User.id == info['admin']).first()
    server = entities.Message(player_1=admin, status=info['status'], count=1)

    session['current_server_id'] = server.id

    db_session.add(server)
    db_session.commit()


@app.route('/current_server', methods=['GET'])
def current_server():
    db_session = db.getSession(engine)
    server = db_session.query(entities.Server).filter(entities.Server.id == session['current_server_id']).first()
    return Response(json.dumps(server, cls=connector.AlchemyEncoder), mimetype='application/json')

"""
@app.route('/server/<id>', methods=['GET'])
def get_server(id):
    db_session = db.getSession(engine)
    servers = db_session.query(entities.Server).filter(entities.Server.id == id)
"""


@app.route('/server/<id>', methods=['PUT'])
def update_server(id):
    info = request.get_json(silent=True)

    db_session = db.getSession(engine)

    server = db_session.query(entities.Server).filter(entities.Server.id == id).first()
    server.status = info['ststus']

    db_session.add(server)
    db_session.commit()


if __name__ == '__main__':
    # app.run(port=8080, threaded=True, host=('localhost'))       # Windows
    app.run(port=8080, threaded=True, host='0.0.0.0')       # Linux