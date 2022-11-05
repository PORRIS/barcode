from flask import Blueprint

lector = Blueprint('lector', __name__, url_prefix='/lector')

from . import views