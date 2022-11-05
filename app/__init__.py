from flask import Flask
from flask_bootstrap import Bootstrap
from flask_login import LoginManager


from .config import config

import logging
from sys import stdout
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

login_manager = LoginManager()
#ruta del login:
login_manager.login_view = 'auth.login'
db = SQLAlchemy()
ma = Marshmallow()

from models.User import UserModel

@login_manager.user_loader
def load_user(username):
    return UserModel.query(username)


def create_app():
    app = Flask(__name__)
    #si el template se llama distiton entonces app = Flask(__name__, template_folder='./templates')
    bootstrap = Bootstrap(app)

    app.config.from_object(config['development'])

    login_manager.init_app(app)
    db.init_app(app)
    ma.init_app(app)
    from auth import auth
    app.register_blueprint(auth)
    from lector import lector
    app.register_blueprint(lector)

    
    #para  que funcione y se pueda usar la variable app  "from app import db" en el modelo de ProductoModel que se llama en api_sql_alchemy
  #  from api_sql_alchemy import api_alchemy
   # app.register_blueprint(api_alchemy, url_prefix='/api2')  

    app.logger.addHandler(logging.StreamHandler(stdout))

    return app
