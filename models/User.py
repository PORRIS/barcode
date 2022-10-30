
from marshmallow_sqlalchemy import auto_field
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.dialects.postgresql import UUID
from flask_login import UserMixin
import uuid
from app import db
from datetime import date

class User(db.Model):
    __tablename__ = 'fb_users'
    def __init__(self,  username,  password, id,created_at):
        self.id = id
        self.username = username
        self.password = password
        self.created_at = created_at

    id = db.Column(UUID(as_uuid=True), primary_key=True,default=uuid.uuid4)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(45), nullable=False)
    created_at = db.Column(db.Date, nullable=False)  
    #productos = db.relationship('ProductoModel', backref="fb_productos", lazy=True)   

    def __repr__(self):
        return "<UserModel(name={self.username!r})>".format(self=self)

def get_user(username):
    return User.query.filter_by(username=username).first()

def get_id_user(username):
    active_user = get_user(username)
    return active_user.id

def put_user(userdata):
    new_user = User(username=userdata.username, 
    password=userdata.password, 
    id = str(uuid.uuid4()), 
    created_at = date.today())

    db.session.add(new_user)
    db.session.commit()
    

class UserData:
    def __init__(self, username, password):
        self.username = username
        self.password = password

class UserModel(UserMixin):
    def __init__(self, user_data):
        self.id = user_data.username
        self.password = user_data.password


    @staticmethod   
    def query(username):
        user_doc = get_user(username)
        user_data = UserData(
        username=user_doc.username,
        password=user_doc.password,
        )

        return UserModel(user_data) 