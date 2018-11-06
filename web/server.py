from flask import Flask,render_template, request, session, redirect, Markup, Response

from web.database import connector
from web.model import entities

import json
import datetime

db = connector.Manager()
engine = db.createEngine()

app = Flask(__name__)
app.secret_key = 'Legends never die'


@app.route('/', methods=['GET'])
def index():
    if 'logged_user_id' in session:
            return render_template('control.html')
    return render_template('index.html')


@app.route('/sign_in', methods=['GET'])
def sign_in():
    if 'logged_user_id' in session:
        redirect('/')

    return render_template('sign_in.html')


@app.route('/login', methods=['GET'])
def login():
    if 'logged_user_id' in session:
        redirect('/')

    return render_template('login.html')


@app.route('/logout', methods=['GET'])
def logout():
    db_session = db.getSession(engine)
    user = db_session.query(entities.User).filter(entities.User.id == session['logged_user_id']).first()
    user.status = "Offline"
    db_session.add(user)
    db_session.commit()
    session.clear()
    return redirect('/')


@app.route('/editor', methods=['GET'])
def editor():
    if "current_document_id" in session:
        return render_template('editor.html')
    redirect('/')


@app.route('/current_user', methods=['GET'])
def current_user():
    db_session = db.getSession(engine)
    user = db_session.query(entities.User).filter(entities.User.id == session['logged_user_id']).first()
    db_session.commit()
    return Response(json.dumps(user, cls=connector.AlchemyEncoder), mimetype='application/json')


@app.route('/do_login', methods=['POST'])
def do_login():
    username = request.form['username']
    password = request.form['password']

    db_session = db.getSession(engine)
    users = db_session.query(entities.User).filter(entities.User.username == username)

    for user in users:
        if user.password == password:
            session['logged_user_id'] = user.id
            user.status = 'Online'
            db_session.add(user)
            db_session.commit()
            return redirect('/')
    return render_template('login.html')


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

    #usernames = db_session.query(entities.User).filter(entities.User.username == username)
    #emails = db_session.query(entities.User).filter(entities.User.email == email)

    #if usernames or emails:
    #    return Response(json.dumps([len(username), len(emails)], cls=connector.AlchemyEncoder), mimetype="application/json")

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


@app.route('/current_document', methods=['POST'])
def current_document_assign():
    info = request.get_json(silent=True)
    session['current_document_id'] = info['document']
    return Response(json.dumps([], cls=connector.AlchemyEncoder), mimetype="application/json")


@app.route('/current_document', methods=['GET'])
def current_document():
    db_session = db.getSession(engine)
    document = db_session.query(entities.Document).filter(entities.Document.id == session['current_document_id']).first()
    db_session.commit()
    return Response(json.dumps(document, cls=connector.AlchemyEncoder), mimetype="application/json")


@app.route('/document', methods=['POST'])
def create_document():
    name = request.form['recipient']
    print("hldas")
    db_session = db.getSession(engine)
    user = db_session.query(entities.User).filter(entities.User.id == session['logged_user_id']).first()
    document = entities.Document(name=name)

    document.content = '<span id=Cursor.>|</span>'.replace("Cursor.", str(user.id))

    document.users.append(user)
    db_session.add(document)

    db_session.commit()
    return redirect('/')


@app.route('/document', methods=['GET'])
def get_all_documents():
    db_session = db.getSession(engine)
    documents = db_session.query(entities.Document)
    data = []
    for document in documents:
        data.append(document)
    return Response(json.dumps(data, cls=connector.AlchemyEncoder), mimetype="application/json")


@app.route('/document_user/<user_id>', methods=['GET'])
def get_document_by_user(user_id):
    db_session = db.getSession(engine)
    documents = db_session.query(entities.Document).filter(entities.Document.users.any(entities.User.id == user_id))
    data = []
    for document in documents:
        data.append(document)
    return Response(json.dumps(data, cls=connector.AlchemyEncoder), mimetype="application/json")


@app.route('/document/<id>', methods=['GET'])
def get_document(id):
    db_session = db.getSession(engine)
    documents = db_session.query(entities.Document).filter(entities.Document.id == id)
    data = []
    for document in documents:
        data.append(document)
    return Response(json.dumps(data, cls=connector.AlchemyEncoder), mimetype="application/json")


@app.route('/document/<id>', methods=['DELETE'])
def delete_document(id):
    db_session = db.getSession(engine)
    document = db_session.query(entities.Document).filter(entities.Document.id == id).first()

    document.users = []
    db_session.delete(document)
    db_session.commit()
    return Response(json.dumps([], cls=connector.AlchemyEncoder), mimetype="application/json")


@app.route('/document_user', methods=['PUT'])
def add_user_document():
    info = request.get_json(silent=True)
    db_session = db.getSession(engine)
    document = db_session.query(entities.Document).filter(entities.Document.id == info['document_id']).first()
    user = db_session.query(entities.User).filter(entities.User.id == session['logged_user_id']).first()

    if not document:
        return Response(json.dumps([], cls=connector.AlchemyEncoder), mimetype="application/json")
    try:
        document.content += '<span id=Cursor.>|</span>'.replace("Cursor.", str(user.id))
    except:
        pass

    document.users.append(user)
    db_session.add(document)
    db_session.commit()
    return Response(json.dumps([], cls=connector.AlchemyEncoder), mimetype="application/json")


@app.route('/document/<id>', methods=['PUT'])
def update_document(id):
    info = request.get_json(silent=True)

    db_session = db.getSession(engine)
    print(info)
    document = db_session.query(entities.Document).filter(entities.Document.id == session['current_document_id']).first()

    pointer = '<span id=Curso.>|</span>'.replace('Curso.', str(session['logged_user_id']))

    if info['event'] == 'write':
        document.content = document.content.replace(pointer, str(info['value']) + pointer)
    elif info['event'] == 'delete':
        pos = document.content.find(pointer)
        document.content = document.content[:pos-info['len']] + document.content[pos:]
    elif info['event'] == 'left':
        pos = document.content.find(pointer)
        character = document.content[pos - info['len']: pos]
        print(character)
        document.content = document.content[:pos - info['len']] + document.content[pos:]
        document.content = document.content.replace(pointer, pointer + character)
    elif info['event'] == 'right':
        pos = document.content.find(pointer)
        character = document.content[pos + len(pointer): pos + len(pointer) + info['len']]
        document.content = document.content[:pos + len(pointer)] + document.content[pos + len(pointer) + info['len']:]
        document.content = document.content.replace(pointer, character + pointer)

    db_session.add(document)
    db_session.commit()
    return Response(json.dumps([], cls=connector.AlchemyEncoder), mimetype="application/json")


if __name__ == '__main__':
    # app.run(port=8080, threaded=True, host=('localhost'))       # Windows
    app.run(port=8080, threaded=True, host='0.0.0.0')       # Linux